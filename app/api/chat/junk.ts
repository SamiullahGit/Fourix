/**
 * Pre-flight junk filter for the chat route.
 *
 * Pure and side-effect free so it can be unit tested (see junk.test.ts) and so
 * the route can call it before spending an upstream request.
 *
 * The bias is deliberately asymmetric: a false negative costs one API call, a
 * false positive tells a real customer their question was gibberish. So every
 * rule here is narrow, and anything that looks like language passes.
 */

/** Matches the route's own MAX_MESSAGE_LENGTH, so this is the same ceiling. */
export const JUNK_MAX_LENGTH = 1200

/**
 * An escape hatch, not a dictionary. If a message contains any of these as a
 * whole word it is treated as real language and skips every heuristic below.
 * Covers the most common English function words plus the vocabulary this
 * particular agent gets asked about.
 */
const SAFE_WORDS = new Set([
  // function words / greetings
  'a', 'about', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'could',
  'do', 'does', 'for', 'from', 'get', 'give', 'has', 'have', 'hello', 'help', 'hey', 'hi',
  'how', 'i', 'if', 'in', 'is', 'it', 'me', 'my', 'need', 'no', 'not', 'of', 'ok', 'okay', 'on',
  'or', 'our', 'so', 'tell', 'thanks', 'that', 'the', 'them', 'then', 'there', 'they', 'this',
  'to', 'us', 'use', 'want', 'was', 'we', 'what', 'when', 'where', 'which', 'who', 'why',
  'will', 'with', 'work', 'works', 'would', 'yes', 'you', 'your',
  // domain vocabulary
  'agency', 'agent', 'ai', 'api', 'appointment', 'appointments', 'automate', 'automation',
  'book', 'booking', 'bookings', 'business', 'calendar', 'call', 'calls', 'chat', 'clinic',
  'clinics', 'contact', 'cost', 'crm', 'customer', 'customers', 'demo', 'email', 'fourix',
  'inquiries', 'inquiry', 'instagram', 'integration', 'lead', 'leads', 'message', 'messages',
  'messenger', 'missed', 'price', 'prices', 'pricing', 'reminder', 'reminders', 'reply',
  'salon', 'salons', 'setup', 'sms', 'sso', 'support', 'telegram', 'trial', 'whatsapp',
])

/** The three letter rows of a QWERTY keyboard, used by the mashing rules. */
const QWERTY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

/** letter -> [row, column], so adjacency is a column comparison within a row. */
const KEY_POSITION = new Map<string, [number, number]>()
QWERTY_ROWS.forEach((row, rowIndex) => {
  ;[...row].forEach((letter, columnIndex) => KEY_POSITION.set(letter, [rowIndex, columnIndex]))
})

/** Longest run of characters each horizontally adjacent to the previous one. */
function longestKeyboardRun(text: string) {
  let longest = 1
  let run = 1
  const lower = text.toLowerCase()
  for (let i = 1; i < lower.length; i += 1) {
    const previous = KEY_POSITION.get(lower[i - 1])
    const current = KEY_POSITION.get(lower[i])
    if (previous && current && previous[0] === current[0] && Math.abs(previous[1] - current[1]) === 1) {
      run += 1
      if (run > longest) longest = run
    } else {
      run = 1
    }
  }
  return longest
}

/** Collapses runs of 3+ identical letters, so "hiiiii" can still match "hi". */
function collapseRepeats(word: string) {
  return word.replace(/(.)\1{2,}/gu, '$1')
}

/**
 * True when the message is almost certainly not a real question.
 *
 * Intentionally NOT rejected: short real questions ("hi", "pricing?", "demo?"),
 * anything with numbers or punctuation, any non-Latin script, and anything
 * containing a recognisable English word.
 */
export function isJunk(raw: string): boolean {
  const text = raw.trim()

  // 1. empty / whitespace-only / a single character
  if (text.length < 2) return true

  // 5. absurd length
  if (text.length > JUNK_MAX_LENGTH) return true

  // Escape hatch first: one known word is enough to call it language. Checked
  // against both the literal word and its de-stuttered form.
  const words = text.toLowerCase().match(/[a-z']+/g) ?? []
  const knownWord = (word: string) => {
    if (SAFE_WORDS.has(word)) return true
    // The de-stuttered form only counts if something is left of it. Without
    // the length guard "aaaaa" collapses to "a", matches the article, and
    // pure keyboard-mashing slips through the filter entirely.
    const collapsed = collapseRepeats(word)
    return collapsed.length >= 2 && SAFE_WORDS.has(collapsed)
  }
  if (words.some(knownWord)) return false

  // 3. the same character five or more times in a row
  if (/(.)\1{4,}/u.test(text)) return true

  /*
   * The two rules below reason about vowels and consonants, which are Latin
   * concepts. Applying them to Urdu, Arabic, Chinese, Hindi etc. would reject
   * every such message — the exact false positive this filter must avoid — so
   * any message containing a non-Latin letter skips them entirely.
   */
  const hasNonLatinLetter = /[\p{L}]/u.test(text) && /[^\p{ASCII}]/u.test(text)
  const latin = (text.toLowerCase().match(/[a-z]/g) ?? []).join('')
  if (hasNonLatinLetter || latin.length === 0) return false

  /* 6. five or more characters that are neighbours on one keyboard row.
        Five, not four: at four this also rejects "answered", "unanswered",
        "were", "fewer" and "property" — measured against ~2,500 real words
        including this site's entire copy. At five the only string flagged in
        that corpus was a consonant-class literal from this file's own source. */
  if (longestKeyboardRun(text) >= 5) return true

  /* 7. the whole message is one short unit repeated: "abab", "asdfasdf". */
  if (/^([a-z]{2,4})\1+$/.test(text.toLowerCase())) return true

  /* 8. long, but drawn from a tiny alphabet all sitting on one keyboard row —
        "afsdfasdfa" is 10 characters of just a/s/d/f. Rules 6 and 7 both miss
        it: its longest adjacent run is only 4, and it is not a clean repeat.
        Zero false positives against the same ~2,500-word corpus. */
  const distinct = new Set(latin)
  if (latin.length >= 8 && distinct.size <= 4) {
    const rows = new Set([...distinct].map((letter) => KEY_POSITION.get(letter)?.[0]))
    if (rows.size === 1 && !rows.has(undefined)) return true
  }

  // 2. no vowels at all, and too long to be an acronym. `y` counts as a vowel
  //    so "rhythm"-shaped words are safe.
  if (latin.length > 6 && !/[aeiouy]/.test(latin)) return true

  // 4. a run of six or more consonants — keyboard mashing, not English
  if (/[bcdfghjklmnpqrstvwxz]{6,}/.test(text.toLowerCase())) return true

  return false
}
