/**
 * Unit tests for the chat pre-flight junk filter.
 *
 * No test framework was installed — Node 24 runs TypeScript natively and ships
 * node:test, so this runs with:
 *
 *   node --test app/api/chat/junk.test.mjs
 *
 * Written as .mjs on purpose. Node's type stripping needs the explicit `.ts`
 * extension on the import, but tsc rejects that without
 * `allowImportingTsExtensions`, which would fail `next build` now that
 * ignoreBuildErrors is off. tsconfig only typechecks **\/*.ts and **\/*.tsx, so
 * a .mjs test keeps the build green without editing tsconfig.
 */

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { JUNK_MAX_LENGTH, isJunk } from './junk.ts'

const label = (input) => JSON.stringify(input.length > 40 ? `${input.slice(0, 37)}...` : input)

describe('isJunk — rejects', () => {
  const rejected = [
    ['', 'empty string'],
    ['   ', 'whitespace only'],
    ['\n\t ', 'whitespace only (newline/tab)'],
    ['a', 'single character'],
    ['?', 'single punctuation character'],
    ['bfjbjkfdngbkd', 'no vowels, longer than 6'],
    ['zxcvbnmlkjhg', 'no vowels, longer than 6'],
    ['aaaaaaa', 'same character 7 times'],
    ['aaaaa', 'same character exactly 5 times'],
    ['zzzzzzzzzz', 'same character repeated'],
    ['asdfghjkla', 'vowels present but an 8-consonant run'],
    ['ea sdfghjklm', 'vowels present but a 7-consonant run'],
    ['x'.repeat(JUNK_MAX_LENGTH + 1), 'over the length cap'],
    // rule 6 — 5+ horizontally adjacent keys on one QWERTY row
    ['asdfgh', 'six adjacent home-row keys'],
    ['qwerty', 'six adjacent top-row keys'],
    ['poiuytr', 'adjacent top-row keys, right to left'],
    // rule 7 — the whole message is one short unit repeated
    ['abab', 'a 2-char unit twice'],
    ['asdfasdf', 'a 4-char unit twice'],
    ['qwerqwer', 'a 4-char unit twice'],
    ['lkjhlkjh', 'a 4-char unit twice'],
    ['xyzxyzxyz', 'a 3-char unit three times'],
    // rule 8 — long, tiny alphabet, single keyboard row
    ['afsdfasdfa', 'ten chars of only a/s/d/f: run is 4 and it is not a clean repeat'],
    ['sdfsdafsdaf', 'home-row mash with vowels and no clean repeat'],
  ]

  for (const [input, why] of rejected) {
    it(`${why}: ${label(input)}`, () => {
      assert.equal(isJunk(input), true)
    })
  }
})

describe('isJunk — passes through to the API', () => {
  const passed = [
    ['hi', 'two-letter greeting'],
    ['hiiiii', 'stretched greeting still resolves to a known word'],
    ['what does Fourix do?', 'ordinary question'],
    ['pricing?', 'one-word question'],
    ['demo?', 'one-word question'],
    ['do you support SSO', 'contains an acronym'],
    ['کیا آپ خدمات فراہم کرتے ہیں؟', 'Urdu — no Latin vowels, must not be judged as Latin'],
    ['قیمت کیا ہے؟', 'Urdu — short'],
    ['你们支持中文吗', 'Chinese'],
    ['Сколько это стоит?', 'Russian'],
    ['24/7?', 'digits and punctuation only'],
    ['$500', 'currency'],
    ['CRM + SMS', 'acronyms with punctuation'],
    ['rhythm', 'no a/e/i/o/u but y counts as a vowel'],
    ['ok', 'two-letter word'],
    ['were', 'real word — rejected if the keyboard-run threshold were 4'],
    ['answered', 'core site vocabulary — rejected at threshold 4'],
    ['unanswered', 'core site vocabulary — rejected at threshold 4'],
    ['property', 'real word — rejected at threshold 4'],
    ['fewer', 'real word — rejected at threshold 4'],
    ['output', 'top-row heavy but not adjacent'],
    ['reporter', 'top-row heavy but not adjacent'],
    // A realistic long message, not a 1200-char run of one letter — that would
    // (correctly) trip the repeated-character rule instead of the length cap.
    [`${'pricing for clinics '.repeat(59)}ok`.slice(0, JUNK_MAX_LENGTH), 'exactly at the length cap'],
  ]

  for (const [input, why] of passed) {
    it(`${why}: ${label(input)}`, () => {
      assert.equal(isJunk(input), false)
    })
  }
})

describe('isJunk — purity', () => {
  it('does not mutate its input and is deterministic', () => {
    const input = '  what does Fourix do?  '
    const before = input
    assert.equal(isJunk(input), isJunk(input))
    assert.equal(input, before)
  })
})
