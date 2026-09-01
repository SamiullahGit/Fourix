'use client';

/**
 * /faq — its own route, not a section injected into the landing scroll, so
 * it is shareable and the homepage is untouched. Header and footer are the
 * same components the landing page renders, so the chrome is identical by
 * construction rather than by two copies being kept in sync.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';

import { SiteFooter, SiteHeader, calendlyUrl } from '@/components/site-chrome';

const EASE_CINEMATIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

const faqs = [
  {
    q: 'What exactly does Fourix do?',
    a: 'We automate how your business responds to calls and messages — recovering missed and after-hours contacts, sending appointment reminders to cut no-shows, and following up on inquiries — across every channel you use.',
  },
  {
    q: 'Which channels do you support?',
    a: 'Phone, WhatsApp, SMS, email, Instagram, Messenger, Telegram, and web forms — all answered from one system.',
  },
  {
    q: 'Do I need to change my current tools?',
    a: 'No. We build on your existing calendar, CRM, and phone number. No migration, and nothing new for your team to learn.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most setups go live within a few weeks: we audit your workflow, build the automation, connect your channels, and roll it out with monitoring before it handles volume on its own.',
  },
  {
    q: 'What does it cost?',
    a: 'Pricing depends on what you already run and the scope of automation. We cover scope and cost on a 30-minute call — no obligation.',
  },
  {
    q: 'Is Fourix only for clinics?',
    a: 'No. We work with any appointment- or inquiry-based service business — clinics, salons, agencies, and more.',
  },
  {
    q: 'What happens after launch?',
    a: 'We monitor and tune monthly — reviewing what came in, what converted, and tightening the system over time.',
  },
] as const;

function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
  reduced,
}: {
  item: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reduced: boolean;
}) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className={['faq-item', isOpen ? 'faq-item--open' : ''].join(' ')}>
      <h3>
        <button
          type="button"
          id={buttonId}
          className="faq-item__trigger"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="faq-item__question">{item.q}</span>
          {/* A plus that rotates into a minus: one element, one transform,
              so there is nothing to swap in and no layout shift. */}
          <span className="faq-item__mark" aria-hidden="true">
            <Plus className="h-full w-full" />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.32, ease: EASE_CINEMATIC }}
            className="faq-item__panel"
          >
            <p className="faq-item__answer">{item.a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const reveal = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE_CINEMATIC },
        };

  return (
    <div className="min-h-screen [overflow-x:clip]">
      <a href="#faq" className="skip-link">
        Skip to content
      </a>

      <SiteHeader />

      {/* pt clears the fixed header, which is 85px tall. */}
      <main id="faq" className="relative">
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
          <motion.p {...reveal(0)} className="section-eyebrow uppercase tracking-[0.22em]">
            FAQ
          </motion.p>
          <motion.h1
            {...reveal(0.09)}
            className="section-display mt-5 max-w-2xl text-4xl font-normal leading-[1.08] md:text-6xl"
          >
            Questions, answered.
          </motion.h1>
          <motion.p {...reveal(0.18)} className="section-muted mt-6 max-w-xl text-base leading-8 md:text-lg">
            What service businesses ask before they start with us.
          </motion.p>

          <motion.div {...reveal(0.27)} className="faq-list mt-14 md:mt-20">
            {faqs.map((item, index) => (
              <FaqItem
                key={item.q}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
                reduced={Boolean(shouldReduceMotion)}
              />
            ))}
          </motion.div>

          <motion.div {...reveal(0.36)} className="faq-cta mt-14 md:mt-16">
            <p className="section-display text-xl font-normal leading-snug md:text-2xl">Still have questions?</p>
            <p className="section-muted mt-3 max-w-md text-base leading-8">
              A 30-minute call covers scope, channels, and cost — no obligation.
            </p>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="cta-pill mt-6 inline-flex h-11 px-5 text-sm"
            >
              Book a meeting <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
