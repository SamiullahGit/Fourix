'use client';

import { useEffect, useRef, useState } from 'react';

export type ChatMessage = {
  from: 'business' | 'customer';
  text: string;
  /** Display-only clock label. */
  time: string;
  /**
   * A substring of `text` to emphasise in amber — a date, time or price.
   * Keep it to the key phrase, never a whole line.
   */
  accent?: string;
  /** Small amber glyph at the bubble's left. Use sparingly. */
  icon?: 'bell';
};

type Props = {
  messages: readonly ChatMessage[];
  /** Accessible name for the thread, e.g. the automation it demonstrates. */
  label: string;
  /**
   * Freeze the thread showing its full conversation and stop the loop.
   * Used for off-centre cards in the coverflow so exactly one thread
   * animates at a time.
   */
  paused?: boolean;
};

const TYPING_MS = 1000; // 0.8–1.2s pause before a business reply
const CUSTOMER_GAP_MS = 700;
const READ_MS = 900;
const LOOP_PAUSE_MS = 3600;

/** Splits a message so the accent phrase can be coloured without markup in data. */
function renderText(message: ChatMessage) {
  if (!message.accent || !message.text.includes(message.accent)) {
    return message.text;
  }
  const [before, ...rest] = message.text.split(message.accent);
  return (
    <>
      {before}
      <span className="chat-accent">{message.accent}</span>
      {rest.join(message.accent)}
    </>
  );
}

function BellGlyph() {
  return (
    <span className="chat-bubble__glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    </span>
  );
}

function ReadReceipt() {
  return (
    <svg className="chat-receipt" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6.6 4.2 9.8 10.4 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.4 6.6 10.6 9.8 16.8 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A looping, self-animating chat thread dressed as a phone screen.
 *
 * The full conversation is always present in the DOM for screen readers and
 * for anyone with reduced motion; the animation only controls which bubbles
 * are visible to sighted users. The phone chrome (status bar, header, input
 * bar) is static and inert — the input row is aria-hidden and unfocusable.
 */
export default function ChatThread({ messages, label, paused = false }: Props) {
  // Starts fully rendered so SSR, no-JS and reduced-motion all show the
  // complete conversation.
  const [visible, setVisible] = useState(messages.length);
  const [typing, setTyping] = useState(false);
  const [animate, setAnimate] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAnimate(!query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!animate || paused) {
      // Rest showing the whole conversation rather than a blank card.
      setVisible(messages.length);
      setTyping(false);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    const run = async () => {
      while (!cancelled) {
        setVisible(0);
        setTyping(false);
        await wait(600);

        for (let i = 0; i < messages.length && !cancelled; i += 1) {
          if (messages[i].from === 'business') {
            setTyping(true);
            await wait(TYPING_MS);
            if (cancelled) return;
            setTyping(false);
          } else {
            await wait(CUSTOMER_GAP_MS);
          }
          if (cancelled) return;
          setVisible(i + 1);
          await wait(READ_MS);
        }

        await wait(LOOP_PAUSE_MS);
      }
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [animate, paused, messages]);

  // Keep the newest bubble in view inside the thread's own scroll box.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [visible, typing]);

  return (
    <div className="phone">
      <div className="phone__screen">
        {/* ---- Status bar (static) ---- */}
        <div className="phone__status" aria-hidden="true">
          <span className="phone__clock">9:41</span>
          <span className="phone__glyphs">
            <svg viewBox="0 0 18 12" fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
              <rect x="10" y="3" width="3" height="9" rx="1" />
              <rect x="15" y="0.5" width="3" height="11.5" rx="1" opacity="0.4" />
            </svg>
            <svg viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 4.2a10 10 0 0 1 14 0" />
              <path d="M3.6 6.9a6.3 6.3 0 0 1 8.8 0" />
              <path d="M6.2 9.5a2.6 2.6 0 0 1 3.6 0" />
            </svg>
            <svg viewBox="0 0 26 12" fill="none">
              <rect x="0.6" y="0.6" width="21" height="10.8" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
              <rect x="2.2" y="2.2" width="16" height="7.6" rx="1.8" fill="currentColor" />
              <path d="M23.4 4.2v3.6a2 2 0 0 0 0-3.6Z" fill="currentColor" opacity="0.6" />
            </svg>
          </span>
        </div>

        {/* ---- Conversation header (static) ---- */}
        <div className="phone__header">
          <svg className="phone__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="min-w-0 flex-1">
            <span className="phone__title">Fourix Assistant</span>
            <span className="phone__subtitle">Automated assistant</span>
          </span>
          <svg className="phone__menu" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="5" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="12" cy="19" r="1.6" />
          </svg>
        </div>

        {/* ---- Messages ---- */}
        <div ref={scrollRef} className="phone__thread" role="log" aria-label={label}>
          <span className="chat-daypill" aria-hidden="true">
            Today
          </span>

          {messages.map((message, index) => {
            const shown = index < visible;
            const business = message.from === 'business';
            return (
              <div
                key={`${message.from}-${index}`}
                className={[
                  'chat-bubble',
                  business ? 'chat-bubble--business' : 'chat-bubble--customer',
                  // Visually hidden only — still read by assistive tech.
                  shown ? '' : 'invisible h-0 overflow-hidden !p-0 opacity-0',
                ].join(' ')}
              >
                {shown ? (
                  <>
                    {message.icon === 'bell' ? <BellGlyph /> : null}
                    <span className="chat-bubble__body">
                      {renderText(message)}
                      <span className="chat-meta">
                        {message.time}
                        {!business ? <ReadReceipt /> : null}
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="sr-only">{message.text}</span>
                )}
              </div>
            );
          })}

          {typing ? (
            <div className="chat-typing" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          ) : null}
        </div>

        {/* ---- Input bar: visual only, never focusable ---- */}
        <div className="phone__input" aria-hidden="true">
          <span className="phone__plus">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="phone__field">Type a message…</span>
          <span className="phone__mic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0M12 17v4" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
