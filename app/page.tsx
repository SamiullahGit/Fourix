'use client';

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarCheck,
  CalendarDays,
  CircleUserRound,
  MapPin,
  Mail,
  Menu,
  MessageSquare,
  MessageSquareText,
  Moon,
  Phone,
  PhoneIncoming,
  Sun,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState, type ComponentType } from 'react';

import ChatThread, { type ChatMessage } from '@/components/chat-thread';
import { SiteFooter, SiteHeader, baseNavLinks, calendlyUrl } from '@/components/site-chrome';
import {
  EnvelopeIcon,
  FOURIX_MARK_PATH,
  InstagramIcon,
  MessengerIcon,
  TelegramIcon,
  WhatsAppIcon,
} from '@/components/flow-icons';

/* ------------------------------------------------------------------ *
 * CONTENT THAT STILL NEEDS REAL INPUT BEFORE LAUNCH
 *
 * The Proof and Team sections render ONLY when these arrays have
 * entries. Leaving them empty hides the section entirely, so no
 * placeholder copy can ship by accident.
 * ------------------------------------------------------------------ */

type Showcase = {
  /** Label it accurately — 'Live demo', 'Internal demo', 'Pilot build'. */
  label: string;
  title: string;
  /** The problem the business had, in one plain sentence. */
  problem: string;
  /** What we actually built. */
  built: string;
  /** Real tools used. */
  tools: readonly string[];
  /** Public link to the demo, or null if there is nothing to link yet. */
  href: string | null;
  hrefLabel: string;
};

// TODO(fourix): add the ONE real demo. Empty array = Proof section hidden.
const showcase: readonly Showcase[] = [];

type Founder = {
  name: string;
  role: string;
  /** One true line: role + background. No padding, no invention. */
  bio: string;
  /** Real photo, e.g. '/team/ali.jpg'. Put the file in public/team/. */
  photo: string;
};

// TODO(fourix): add the two founders. Empty array = Team section hidden.
const founders: readonly Founder[] = [];

/* ------------------------------------------------------------------ */

const heroHeadline = ['Stop losing customers', 'stuck waiting for', 'answers.'] as const;

const problems = [
  {
    title: 'Calls and messages nobody can answer',
    text: 'Someone who reaches voicemail or silence is free to try the next business.',
    icon: Phone,
  },
  {
    title: 'Appointments booked weeks ago get forgotten',
    text: 'The slot sits empty. The staff time is already paid for.',
    icon: CalendarDays,
  },
  {
    title: 'Inquiries go cold in any channel',
    text: 'Every hour without a reply is an hour they can book somewhere else.',
    icon: Mail,
  },
] as const;

/**
 * The three automations, each shown as a live conversation.
 * These threads are illustrative of how the automation replies — they are
 * coded mockups, not transcripts of real customers.
 */
const packageParts = [
  {
    title: 'Missed-call & after-hours recovery',
    text: 'Every unanswered call captured and turned into a booking.',
    messages: [
      {
        from: 'business',
        text: 'Hi — sorry we missed your call just now. I can help you book right here. What day works?',
        time: '19:42',
      },
      { from: 'customer', text: 'Do you have anything Thursday?', time: '19:43' },
      {
        from: 'business',
        text: 'Yes — 10:00 AM or 3:30 PM Thursday are open.',
        time: '19:43',
        accent: '10:00 AM or 3:30 PM',
      },
      { from: 'customer', text: '10 AM please.', time: '19:44' },
      { from: 'business', text: "Booked ✓ You'll get a reminder the day before.", time: '19:44' },
    ],
  },
  {
    title: 'No-show reminders',
    text: 'Automatic confirmations before every appointment. Fewer empty slots.',
    messages: [
      {
        from: 'business',
        text: 'Reminder: your appointment is tomorrow at 2:00 PM. Reply YES to confirm or R to reschedule.',
        time: '09:00',
        accent: 'tomorrow at 2:00 PM',
        icon: 'bell',
      },
      { from: 'customer', text: 'YES', time: '09:06' },
      { from: 'business', text: "You're confirmed ✓ See you tomorrow at 2.", time: '09:06' },
    ],
  },
  {
    title: 'Inquiry follow-up',
    text: 'New inquiries answered in seconds, then followed up.',
    messages: [
      { from: 'customer', text: 'Hi, do you offer teeth whitening? How much?', time: '13:18' },
      {
        from: 'business',
        text: 'Yes — whitening starts at $199. Want me to book you a consultation this week?',
        time: '13:18',
        accent: '$199',
      },
      { from: 'customer', text: 'Yes please', time: '13:19' },
      { from: 'business', text: "Done ✓ I've sent a booking link to your phone.", time: '13:19' },
    ],
  },
] as const satisfies readonly {
  title: string;
  text: string;
  messages: readonly ChatMessage[];
}[];

const process = [
  {
    title: 'Audit your workflow',
    description: 'We map how calls, bookings, and inquiries reach you today — and where they leak.',
  },
  {
    title: 'Build on your tools',
    description: 'Your calendar, CRM, and phone number. No migration, nothing new to learn.',
  },
  {
    title: 'Connect your channels',
    description: 'Phone, WhatsApp, SMS, email, and web forms, answered from one system.',
  },
  {
    title: 'Launch',
    description: 'A controlled rollout, watched and corrected before it handles volume alone.',
  },
  {
    title: 'Monitor & tune monthly',
    description: 'Every month we review what came in, what converted, and tighten it.',
  },
] as const;


/**
 * Hero backdrop. Compressed from the 2.4MB public/bg.jpg original down to
 * 2048px wide: 75KB WebP with a 211KB JPEG fallback. next.config sets
 * `images.unoptimized`, so Next does NOT re-encode these — the files in
 * /public are exactly what ships. Re-run the compression if bg.jpg changes.
 */
const heroBackdrop = {
  webp: '/hero-bg.webp',
  jpg: '/hero-bg.jpg',
  /** 20px-wide inline preview so the hero never flashes black. */
  blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA8LDA0MCg8NDA0REA8SFyYZFxUVFy8iJBwmODE7OjcxNjU9RVhLPUFUQjU2TWlOVFteY2RjPEpsdGxgc1hhY1//2wBDARARERcUFy0ZGS1fPzY/X19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1//wAARCAALABQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDi7KzkmlXYituJ27jwadEvlTPs+Yr3XkVRDMoyrEc9jU9m7tLksxxgdaEDJpBA7li/J96KZMx8w80UxH//2Q==',
} as const;

/**
 * Looping hero video. 1.96MB, 10.0s, 1280x720, faststart already enabled
 * (moov before mdat) so it starts streaming immediately.
 *
 * The poster is heroBackdrop.jpg — see the note in the hero markup: it was
 * NOT extracted from this video, so verify it matches the opening frame.
 * To generate a true poster once ffmpeg is available:
 *   ffmpeg -i public/Hvideo.mp4 -vf "select=eq(n\,0)" -q:v 3 public/hero-poster.jpg
 *
 * The file still carries an audio track. It plays muted, so this is only
 * wasted bytes; strip it if you re-encode:
 *   ffmpeg -i public/Hvideo.mp4 -c:v copy -an -movflags +faststart out.mp4
 */
const heroVideo: string | null = '/Hvideo.mp4';

/**
 * Non-focused problem column opacity.
 *
 * 0.32 is a deliberate call: it puts the inactive columns below the AA
 * text threshold in exchange for a focus shift you can actually see. They
 * are never hidden, each returns to full as it becomes active, and all
 * three end at full opacity once the section has been scrolled through.
 * Raise this toward 0.6 if the contrast trade stops being worth it.
 */
const PROBLEM_DIM = 0.32;

/** Resting opacity of an unreached stage — faintly there, never hidden. */
const PROCESS_DIM = 0.2;

// The reference easing: a long, settled decelerate.
const EASE_CINEMATIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: EASE_CINEMATIC,
    },
  }),
};

/* ---- How it connects --------------------------------------------------- *
 * The desktop diagram has a FIXED geometry, so the connector SVGs need no
 * measurement and no scaling: the frame is FLOW_H tall, the five channels
 * sit on five equal rows and the four results on four, which makes every
 * endpoint a constant the paths can be written against. Each connector SVG
 * renders at exactly its viewBox size, so strokes stay crisp and
 * pathLength animates against a stable length.
 * ------------------------------------------------------------------------ */
const FLOW_H = 480; // must match the lg:h-[30rem] on .flow-column
/* The connector columns are now 1fr — they soak up whatever the two pill
   columns and the hub leave over, which is what pushes the pills out to the
   edges. So the span is a NOMINAL viewBox width and the SVG stretches to
   fill its cell (preserveAspectRatio="none").
   Height stays pinned to FLOW_H, so scaleY is exactly 1 and the stroke keeps
   its true thickness; only X is scaled, which the S-curves absorb because
   their tangents are horizontal at both ends. */
const FLOW_SPAN = 240;
const FLOW_BLEED = 3; // overshoot at each end so lines meet the pill edges

const flowInputs = [
  { label: 'WhatsApp', Icon: WhatsAppIcon },
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'Messenger', Icon: MessengerIcon },
  { label: 'Telegram', Icon: TelegramIcon },
  { label: 'Email', Icon: EnvelopeIcon },
] as const;

/* Results carry their own colour so the right-hand column reads as
   distinct outcomes rather than four grey rows. The values live as tokens
   on .flow-stage because each one needs a darker variant in light mode to
   stay legible on cream. */
const flowOutputs = [
  { label: 'Bookings confirmed', Icon: CalendarCheck, tint: 'var(--flow-ico-book)' },
  { label: 'Missed calls recovered', Icon: PhoneIncoming, tint: 'var(--flow-ico-call)' },
  { label: 'Reminders sent', Icon: Bell, tint: 'var(--flow-ico-bell)' },
  { label: 'Leads followed up', Icon: MessageSquareText, tint: 'var(--flow-ico-msg)' },
] as const;

/** Row centres: five equal rows across FLOW_H, then four. */
const FLOW_MID = FLOW_H / 2;
const flowInY = flowInputs.map((_, i) => ((i + 0.5) * FLOW_H) / flowInputs.length);
const flowOutY = flowOutputs.map((_, i) => ((i + 0.5) * FLOW_H) / flowOutputs.length);

/* One shared timeline in seconds, so the five beats always resolve in the
   order the section is meant to read: channels in, lines inward, the hub
   lands, lines outward, results in. */
/* MOBILE / unpinned only. Desktop never reads this: above lg with a fine
   pointer the sequence is driven by scroll progress through FLOW_WINDOWS.

   Held to ~2.2s end to end. It used to run 3.55s, which a fast flick could
   outrun — the section was already scrolling past while only the first two
   channels had appeared, so the reader caught a half-empty diagram with just
   the static tracks showing. At 2.2s, triggered the moment any part of the
   section touches the viewport (so it starts while the diagram is still
   below the fold), a flick either lets it finish or carries the reader past
   a diagram that completes off-screen and persists. */
const flowAt = {
  input: (i: number) => i * 0.09,
  lineIn: (i: number) => 0.46 + i * 0.06,
  hub: 1.05,
  lineOut: (i: number) => 1.36 + i * 0.06,
  output: (i: number) => 1.66 + i * 0.06,
};

const flowPillIn = (delay: number, from: number): Variants => ({
  hidden: { opacity: 0, x: from },
  shown: { opacity: 1, x: 0, transition: { duration: 0.36, delay, ease: EASE_CINEMATIC } },
});

const flowDraw = (delay: number, duration = 0.45): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  shown: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration, delay, ease: EASE_CINEMATIC },
      opacity: { duration: 0.25, delay },
    },
  },
});

const flowHubIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  shown: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: flowAt.hub, ease: EASE_CINEMATIC } },
};

/* The arrival beat. This flares on SCALE rather than opacity: the global
   reduced-motion block forces `opacity: 1 !important` on everything, so an
   opacity keyframe would leave the halo stuck at its brightest. Scale is
   reset to none there instead, which lands on the settled look. */
const flowHubGlow: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  shown: {
    opacity: 1,
    scale: [0.8, 1.3, 1],
    transition: { duration: 0.9, delay: flowAt.hub, times: [0, 0.34, 1], ease: 'easeOut' },
  },
};

/* A slow, steady turn. Linear so the speed never eases, and 0 -> 360 so the
   loop point lands exactly where it started — no visible seam. `rest` is
   what an offscreen (or reduced-motion) mark shows. */
const markSpin: Variants = {
  rest: { rotate: 0 },
  spin: {
    rotate: 360,
    transition: { duration: 10, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
  },
};

/* When the section is pinned, scroll progress (0-1 across the hold) drives
   the sequence directly, instead of a timed run. That guarantees the whole
   thing is actually SEEN — a timed sequence can be scrolled past before it
   finishes — and it makes back-scrolling replay it for free.

   Windows are [start, end] in progress space, ordered so the five beats stay
   in sequence. The last one lands at 0.981 — deliberately almost the whole
   hold. They used to finish at 0.865, which left 13.5% of the pin (roughly
   150px of scrolling) where the diagram was already complete and scrolling
   changed nothing: the section read as frozen. Every window here is stretched
   so that scroll always advances something right up to the release. */
const FLOW_WINDOWS = {
  input: (i: number): [number, number] => [0.023 + i * 0.051, 0.136 + i * 0.051],
  lineIn: (i: number): [number, number] => [0.272 + i * 0.034, 0.453 + i * 0.034],
  hub: [0.499, 0.657] as [number, number],
  lineOut: (i: number): [number, number] => [0.634 + i * 0.034, 0.816 + i * 0.034],
  output: (i: number): [number, number] => [0.748 + i * 0.04, 0.861 + i * 0.04],
};

/** Shared innards, so the timed and scroll-driven pills cannot drift apart. */
function FlowPillBody({
  label,
  Icon,
  tint,
}: {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  tint?: string;
}) {
  return (
    <>
      <span className="flow-pill__icon" style={tint ? { color: tint } : undefined}>
        <Icon className="h-[1.4rem] w-[1.4rem]" />
      </span>
      {label}
    </>
  );
}

function FlowPillPinned({
  label,
  Icon,
  tint,
  progress,
  range,
  drift,
}: {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  tint?: string;
  progress: MotionValue<number>;
  range: [number, number];
  drift: number;
}) {
  const opacity = useTransform(progress, range, [0, 1], { clamp: true });
  const x = useTransform(progress, range, [drift, 0], { clamp: true });
  return (
    <motion.div style={{ opacity, x }} className="flow-pill">
      <FlowPillBody label={label} Icon={Icon} tint={tint} />
    </motion.div>
  );
}

function FlowWirePinned({
  d,
  progress,
  range,
}: {
  d: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const pathLength = useTransform(progress, range, [0, 1], { clamp: true });
  // Snap in over the first sliver of the window so a zero-length path is
  // never briefly visible as a dot at the pill edge.
  const opacity = useTransform(progress, [range[0], range[0] + 0.005], [0, 1], { clamp: true });
  return <motion.path className="flow-wires__live" d={d} style={{ pathLength, opacity }} />;
}

function FlowPill({
  label,
  Icon,
  variants,
  tint,
}: {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  variants: Variants;
  /** Results tint their line icon; channels carry their own brand fill. */
  tint?: string;
}) {
  return (
    <motion.div variants={variants} className="flow-pill">
      <FlowPillBody label={label} Icon={Icon} tint={tint} />
    </motion.div>
  );
}

/**
 * One connector cell. Above lg it draws the fan of curves between a column
 * and the hub; below lg the fan is replaced by a single vertical line, so
 * the horizontal layout is never crammed onto a narrow screen. Both are
 * decorative — every label lives in the columns themselves, once.
 */
function FlowWires({
  from,
  to,
  delay,
  progress,
  range,
}: {
  from: number[];
  to: number[];
  delay: (i: number) => number;
  /** Present only while the section is pinned. */
  progress?: MotionValue<number>;
  range?: (i: number) => [number, number];
}) {
  const curves = (from.length > 1 ? from : to).map((_, i) => {
    const y0 = from.length > 1 ? from[i] : from[0];
    const y1 = to.length > 1 ? to[i] : to[0];
    // Overshoot both ends by FLOW_BLEED so the stroke tucks under the pill
    // and the hub instead of stopping a subpixel short of them. The SVG is
    // overflow:visible so the overshoot actually paints.
    return {
      key: `${y0}-${y1}`,
      d: `M${-FLOW_BLEED} ${y0} C ${FLOW_SPAN / 2} ${y0}, ${FLOW_SPAN / 2} ${y1}, ${FLOW_SPAN + FLOW_BLEED} ${y1}`,
      i,
    };
  });

  return (
    <div className="flow-wires" aria-hidden="true">
      <svg
        className="flow-wires__fan"
        height={FLOW_H}
        viewBox={`0 0 ${FLOW_SPAN} ${FLOW_H}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Faint tracks are static, so the diagram reads as connected
            before the sequence runs and under reduced motion. */}
        {curves.map((c) => (
          <path key={`t-${c.key}`} className="flow-wires__track" d={c.d} />
        ))}
        {curves.map((c) =>
          progress && range ? (
            <FlowWirePinned key={c.key} d={c.d} progress={progress} range={range(c.i)} />
          ) : (
            <motion.path key={c.key} className="flow-wires__live" d={c.d} variants={flowDraw(delay(c.i))} />
          ),
        )}
      </svg>
      <svg className="flow-wires__drop" width="24" height="72" viewBox="0 0 24 72" fill="none">
        <path className="flow-wires__track" d="M12 -3 L12 75" />
        {progress && range ? (
          <FlowWirePinned d="M12 -3 L12 75" progress={progress} range={range(0)} />
        ) : (
          <motion.path className="flow-wires__live" d="M12 -3 L12 75" variants={flowDraw(delay(0), 0.6)} />
        )}
      </svg>
    </div>
  );
}

/* ---- Coverflow -------------------------------------------------------- *
 * One card of the 3D arc. Continuous properties (rotateY, x, z, scale,
 * opacity) ride motion values so they interpolate on the compositor.
 *
 * Blur and z-index are DELIBERATELY not motion values: they come from the
 * integer distance to the active card, so they change a handful of times
 * per scroll instead of every frame. Animating a blur radius per-frame
 * forces a repaint of the whole card and is what makes this pattern janky.
 * ---------------------------------------------------------------------- */
// Horizontal spread between neighbouring cards. Scales with the viewport
// so the arc fills the section instead of being stranded in the middle,
// clamped so it stays sane on very small and very wide screens.
const CARD_STEP_MIN = 340;
const CARD_STEP_MAX = 620;
const CARD_STEP_RATIO = 0.33;
const CARD_DEPTH_PX = 260; // how far back the side cards sit
const CARD_TILT_DEG = 38;

/**
 * Shortest signed distance from `raw` to zero on a ring of `count` slots.
 * With 3 cards this returns a value in [-1.5, 1.5), so ONE card is always
 * left, one centre, one right — the arc is flanked at every position
 * instead of the centre card sitting at the head of a line.
 */
function ringOffset(raw: number, count: number) {
  const half = count / 2;
  return (((raw + half) % count) + count) % count - half;
}

/**
 * One column of the problem section.
 *
 * The icon fades and scales in just after its column, with a brief amber
 * lift that settles to the resting colour. Fade+scale rather than a
 * pathLength draw: these lucide glyphs are multi-primitive (CalendarDays
 * is a rect plus six zero-length 'h.01' dots), so a stroke draw flickers
 * the dots and races the rect.
 */
function ProblemColumn({
  item,
  index,
  reduced,
  focus,
  active,
}: {
  item: (typeof problems)[number];
  index: number;
  reduced: boolean;
  /** Desktop scroll-focus mode. False on touch/narrow and reduced-motion. */
  focus: boolean;
  /** Index of the focused column, or -1 for "all equal". */
  active: number;
}) {
  const Icon = item.icon;
  // Only run the mobile loop while the section is on screen.
  const [inView, setInView] = useState(false);
  // Staggered L->M->R. Scale AND colour live in one CSS keyframe animation
  // (see .problem-icon): two separate timelines would drift apart over an
  // infinite loop, and CSS can read the per-theme --rail-accent directly.
  const iconDelay = index * 0.6;

  const isActive = active === index;
  // -1 means the focus band has not started or has finished, so nothing dims.
  const isDim = focus && active >= 0 && !isActive;

  const body = (
    <>
      <h3 className="section-display mt-8 text-xl font-normal leading-snug md:text-2xl">{item.title}</h3>
      <p className="section-muted mt-4 text-base leading-8">{item.text}</p>
    </>
  );

  /* ---- Desktop: scroll-driven focus ---- */
  if (focus) {
    return (
      <motion.article
        // translateY, never margin — the lift cannot move anything else.
        animate={{ opacity: isDim ? PROBLEM_DIM : 1, y: isActive ? -10 : 0 }}
        transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
        className={['problem-col--focus hairline-top pt-8', isActive ? 'problem-col--active' : ''].join(' ')}
      >
        <span
          className={['problem-icon problem-icon--focus', isActive ? 'problem-icon--active' : ''].join(' ')}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        {body}
      </motion.article>
    );
  }

  /* ---- Mobile / reduced motion: the original cascade, untouched ---- */
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.18, ease: EASE_CINEMATIC }}
      className="hairline-top pt-8"
    >
      <motion.span
        className={['problem-icon', inView && !reduced ? 'problem-icon--running' : ''].join(' ')}
        // Only the stagger is set here; the loop itself is the CSS keyframe.
        style={reduced ? undefined : { animationDelay: `${iconDelay.toFixed(2)}s` }}
        // framer-motion handles the fade-in only — it must not write an
        // inline transform, or it would fight the keyframe animation.
        initial={reduced ? false : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: index * 0.18, ease: EASE_CINEMATIC }}
        onViewportEnter={() => setInView(true)}
        onViewportLeave={() => setInView(false)}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </motion.span>
      {body}
    </motion.article>
  );
}

/**
 * One stage of the delivery list.
 *
 * Rendered dim from the start (never hidden, so the text is always in the
 * DOM and readable by assistive tech) and brightened to full as the
 * scroll-driven rail fill passes its position. Driving opacity off the
 * SAME progress value as the line is what keeps them in step.
 */
function ProcessRow({
  step,
  index,
  count,
  progress,
  lit,
  reduced,
}: {
  step: (typeof process)[number];
  index: number;
  count: number;
  progress: MotionValue<number>;
  lit: boolean;
  reduced: boolean;
}) {
  const at = index / count;
  const opacity = useTransform(progress, [at - 0.02, at + 0.06], [PROCESS_DIM, 1]);

  return (
    <motion.li
      style={reduced ? undefined : { opacity }}
      className="hairline-top grid gap-x-10 gap-y-3 py-9 md:grid-cols-[5rem_15rem_1fr] md:items-baseline md:py-11"
    >
      <span
        className={['rule-index text-sm font-medium tracking-[0.2em]', lit ? 'rule-index--lit' : ''].join(' ')}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="section-display text-xl font-normal leading-snug md:text-2xl">{step.title}</h3>
      <p className="section-muted text-base leading-8">{step.description}</p>
    </motion.li>
  );
}

function CoverflowCard({
  part,
  index,
  position,
  distance,
  count,
  step,
}: {
  part: (typeof packageParts)[number];
  index: number;
  position: MotionValue<number>;
  /** Ring distance from the centred card. 0 = centre. */
  distance: number;
  count: number;
  /** Viewport-derived horizontal spread. */
  step: number;
}) {
  const offset = useTransform(position, (p) => ringOffset(index - p, count));

  // Left neighbour: negative X, POSITIVE rotateY (facing inward from the
  // left). Right neighbour mirrors it exactly. Centre sits at 0/0.
  const x = useTransform(offset, (o) => o * step);
  const rotateY = useTransform(offset, (o) => Math.max(-60, Math.min(60, -o * CARD_TILT_DEG)));
  const z = useTransform(offset, (o) => -Math.abs(o) * CARD_DEPTH_PX);
  const scale = useTransform(offset, (o) => Math.max(0.62, 1 - Math.abs(o) * 0.18));
  // Fades out at the back of the ring so the wrap-around is never seen.
  const opacity = useTransform(offset, (o) => {
    const a = Math.abs(o);
    if (a > 1.35) return 0;
    if (a > 1) return ((1.35 - a) / 0.35) * 0.58;
    return 1 - a * 0.42;
  });

  const isCentre = distance === 0;

  return (
    <motion.div
      className={['coverflow__card', isCentre ? '' : 'coverflow__card--aside'].join(' ')}
      style={{ x, z, rotateY, scale, opacity, zIndex: 10 - Math.round(distance) }}
    >
      <ChatThread
        messages={part.messages}
        label={`Example conversation: ${part.title}`}
        // Exactly one thread animates: the centred one.
        paused={!isCentre}
      />
    </motion.div>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();


  /* The shared base plus this page's gated anchors. Contact stays last so
     the header's FAQ/Home slot lands after it. */
  const navLinks = [
    ...baseNavLinks.filter((link) => link.href !== '#book'),
    ...(showcase.length > 0 ? [{ href: '#proof', label: 'Proof' }] : []),
    ...(founders.length > 0 ? [{ href: '#team', label: 'Team' }] : []),
    { href: '#book', label: 'Contact' },
  ];

  /** Hero load-in stagger: brand/nav/pill, then headline, subhead, CTAs. */
  const riseIn = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 44 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE_CINEMATIC },
        };

  /**
   * Gentle one-shot reveal: small rise + fade, fires once when the element
   * enters view. Transform/opacity only, so it can never shift layout.
   */
  const revealIn = (delay: number, amount = 0.5) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 40 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount },
          transition: { duration: 0.8, delay, ease: EASE_CINEMATIC },
        };

  /* ---- Process rail ---------------------------------------------------- *
   * The hairline beside the 01-05 list fills downward as the section
   * passes through the viewport, and each stage number lights as the fill
   * reaches it. Only the fill's scaleY animates, so nothing reflows.
   * ---------------------------------------------------------------------- */
  const processRef = useRef<HTMLOListElement>(null);
  const [litStage, setLitStage] = useState(shouldReduceMotion ? process.length - 1 : -1);
  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    // Starts filling as the list rises past 80% of the viewport, completes
    // as its end clears 60% — so the draw tracks a natural reading pace.
    offset: ['start 80%', 'end 60%'],
  });
  /* The rail is ONE-WAY. Reading processProgress straight would un-draw the
     line the moment the reader nudged back up, which is the one thing a
     progress rail must never do. railReveal only ever climbs, so every pixel
     of downward scroll advances it and nothing takes it back. */
  const railReveal = useMotionValue(shouldReduceMotion ? 1 : 0);
  useMotionValueEvent(processProgress, 'change', (value) => {
    if (value > railReveal.get()) railReveal.set(value);
  });

  /* ...and it is erased ONLY when the reader is above the section entirely —
     its top edge has dropped below the fold — so the next approach re-draws
     fresh. At or below the section it stays complete, however far back up
     inside it they scroll. */
  useEffect(() => {
    if (shouldReduceMotion) return;
    const onScroll = () => {
      const el = processRef.current;
      if (!el || railReveal.get() === 0) return;
      if (el.getBoundingClientRect().top > window.innerHeight) {
        railReveal.set(0);
        setLitStage(-1);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [railReveal, shouldReduceMotion]);

  const railFill = useTransform(railReveal, [0, 1], [0, 1]);

  useMotionValueEvent(railReveal, 'change', (value) => {
    if (shouldReduceMotion) return;
    const next = Math.min(process.length - 1, Math.floor(value * process.length));
    setLitStage((current) => (current === next ? current : next));
  });

  /* ---- Coverflow ------------------------------------------------------- *
   * Desktop pins the section and rotates a 3D arc of the three phones.
   * The spacer is exactly 100vh (the pinned view) + the rotation travel,
   * so the pin releases the instant the last card lands — no empty gap.
   * Touch and reduced-motion keep the native swipe-snap carousel.
   * ---------------------------------------------------------------------- */
  const railSectionRef = useRef<HTMLDivElement>(null);
  const [canPin, setCanPin] = useState(false);
  const [railTravel, setRailTravel] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [cardStep, setCardStep] = useState(CARD_STEP_MAX);
  const cardCount = packageParts.length;
  const [isMobile, setIsMobile] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);
  const mobileRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pinnable = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setAllowMotion(!noMotion.matches);
      setCanPin(pinnable.matches && !noMotion.matches);
    };
    sync();
    pinnable.addEventListener('change', sync);
    noMotion.addEventListener('change', sync);
    return () => {
      pinnable.removeEventListener('change', sync);
      noMotion.removeEventListener('change', sync);
    };
  }, []);

  // The compact carousel is deliberately below md only. Keep the existing
  // desktop/touch fallback intact at md and above.
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Native scroll-snap does the movement. This only reflects the centred
  // snap item in the label, dots, and which chat loop is allowed to play.
  useEffect(() => {
    const rail = mobileRailRef.current;
    if (!isMobile || !rail) return;

    let frame = 0;
    const updateActiveCard = () => {
      frame = 0;
      const cards = Array.from(rail.children) as HTMLElement[];
      const railCentre = rail.scrollLeft + rail.clientWidth / 2;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const cardCentre = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCentre - railCentre);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });
      setActiveCard((current) => (current === nearest ? current : nearest));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveCard);
    };

    updateActiveCard();
    rail.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveCard);
    return () => {
      rail.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveCard);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isMobile]);

  // Mobile carousel scroll-lock: convert vertical scroll to horizontal movement
  // until all cards are shown, then release scroll lock.
  useEffect(() => {
    const rail = mobileRailRef.current;
    if (!isMobile || !rail) return;

    const SCROLL_MULTIPLIER = 1.5; // Higher = more responsive carousel movement

    const handleWheel = (e: WheelEvent) => {
      // Only intercept vertical scroll (deltaY), ignore horizontal
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const maxScroll = rail.scrollWidth - rail.clientWidth;
      const currentScroll = rail.scrollLeft;
      
      // Check if carousel is fully scrolled (at the end)
      const isAtEnd = currentScroll >= maxScroll - 5; // 5px tolerance

      // Only prevent default scroll if we're not at the end
      if (!isAtEnd) {
        e.preventDefault();
        
        // Convert vertical scroll to horizontal movement
        // Use scrollBy for smoother behavior with scroll-snap
        const scrollDelta = e.deltaY * SCROLL_MULTIPLIER;
        rail.scrollBy({
          left: scrollDelta,
          behavior: 'auto' // Use auto for immediate response to wheel events
        });
      }
    };

    rail.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      rail.removeEventListener('wheel', handleWheel);
    };
  }, [isMobile]);

  /* The mobile carousel pins the same way the desktop coverflow does:
     hold the section, advance the rail one phone per slice of the hold,
     then release. Reduced motion keeps the free-swipe carousel. */
  const mobilePinned = isMobile && allowMotion;
  const sectionPinned = canPin || mobilePinned;

  /* Move the rail with a transform, not scrollLeft. Several mobile engines
     clamp or ignore scrollLeft on an overflow:hidden element, which leaves
     the rail drifting without ever completing — a transform is exact and
     runs on the compositor. */
  const [mobileStep, setMobileStep] = useState(0);
  useEffect(() => {
    if (!mobilePinned) {
      setMobileStep(0);
      return;
    }
    const rail = mobileRailRef.current;
    if (!rail) return;
    const measure = () => setMobileStep(rail.clientWidth + 16); // slide + 1rem gap
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [mobilePinned]);

  const goToMobileCard = (index: number) => {
    const rail = mobileRailRef.current;
    const card = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !card) return;
    rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' });
  };

  // One viewport-ish of scroll per card transition, and the horizontal
  // spread that keeps the arc filling the section at any width.
  useEffect(() => {
    if (!canPin && !mobilePinned) {
      setRailTravel(0);
      return;
    }
    const measure = () => {
      // A phone needs less runway than a mouse wheel: 0.85vh per card is
      // 4-7 swipes and reads as endless.
      const perCard = mobilePinned ? 0.6 : 0.85;
      setRailTravel((cardCount - 1) * Math.round(window.innerHeight * perCard));
      setCardStep(
        Math.round(Math.max(CARD_STEP_MIN, Math.min(window.innerWidth * CARD_STEP_RATIO, CARD_STEP_MAX))),
      );
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [canPin, mobilePinned, cardCount]);

  /* ---- How it connects: desktop pin ------------------------------------ *
   * Same shape as the coverflow pin, and the same spacer arithmetic:
   *   spacer  = 100vh + travel
   *   sticky child = h-screen
   *   scroll consumed while pinned = spacer - 100vh = travel, exactly.
   * So the pin releases on the frame the sequence completes and the next
   * section starts immediately — no void at either end.
   *
   * `canPin` is reused rather than re-derived: it is already
   * (min-width: 1024px) and (pointer: fine) and NOT reduced-motion, which
   * is exactly the gate this needs. Touch, narrow, and reduced-motion all
   * keep the unpinned replay-on-enter behaviour.
   * ---------------------------------------------------------------------- */
  const flowPinRef = useRef<HTMLDivElement>(null);
  const [flowTravel, setFlowTravel] = useState(0);
  useEffect(() => {
    if (!canPin) {
      setFlowTravel(0);
      return;
    }
    // 1.1 viewports of runway: long enough to read the five beats without
    // feeling like the page has stopped responding.
    const measure = () => setFlowTravel(Math.round(window.innerHeight * 1.1));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [canPin]);

  const { scrollYProgress: flowProgress } = useScroll({
    target: flowPinRef,
    offset: ['start start', 'end end'],
  });

  /* The section counts as "in view" while ANY part of it is on screen. The
     previous gate was `whileInView` with amount: 0.25, which flipped BACK to
     `hidden` the moment less than a quarter of the diagram was visible — so
     scrolling down tore the boxes back out while the user was still looking
     at them, leaving only the static (CSS-drawn, never animated) tracks on
     screen. That was the "bare lines" state. */
  const flowInView = useInView(flowPinRef, { amount: 0 });

  /* One-way reveal. Children read a LATCHED copy of scroll progress that only
     ever climbs, so nothing that has appeared can be un-drawn by scrolling —
     not by scrolling back up inside the pin, and not by jitter in the
     measured progress. */
  const flowReveal = useMotionValue(0);
  useMotionValueEvent(flowProgress, 'change', (value) => {
    if (value > flowReveal.get()) flowReveal.set(value);
  });

  /* Latched "has been reached", for the unpinned (mobile / reduced-motion)
     path. Once true it stays true until the reset below. */
  const [flowShown, setFlowShown] = useState(false);
  useEffect(() => {
    if (flowInView) setFlowShown(true);
  }, [flowInView]);

  /* Reset ONLY when the reader is above the section — its top edge has
     dropped below the fold — exactly the test the process rail uses.
     This used to reset on `!flowInView`, which fires when the section leaves
     the viewport in EITHER direction. Scrolling DOWN past it therefore zeroed
     the reveal, so coming back UP re-entered a section with every box hidden
     and only the static tracks painted: the bare-lines state. The section is
     off screen whenever this fires, so the reset is never visible. */
  useEffect(() => {
    if (shouldReduceMotion) return;
    const onScroll = () => {
      const el = flowPinRef.current;
      if (!el) return;
      if (el.getBoundingClientRect().top > window.innerHeight) {
        if (flowReveal.get() !== 0) flowReveal.set(0);
        setFlowShown((current) => (current ? false : current));
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [flowReveal, shouldReduceMotion]);

  const flowHubOpacity = useTransform(flowReveal, FLOW_WINDOWS.hub, [0, 1], { clamp: true });
  const flowHubScale = useTransform(flowReveal, FLOW_WINDOWS.hub, [0.92, 1], { clamp: true });
  const flowGlowOpacity = useTransform(
    flowReveal,
    [FLOW_WINDOWS.hub[0], FLOW_WINDOWS.hub[0] + 0.04],
    [0, 1],
    { clamp: true },
  );
  const flowGlowScale = useTransform(
    flowReveal,
    [FLOW_WINDOWS.hub[0], FLOW_WINDOWS.hub[1], FLOW_WINDOWS.hub[1] + 0.08],
    [0.8, 1.3, 1],
    { clamp: true },
  );

  const { scrollYProgress: railProgress } = useScroll({
    target: railSectionRef,
    offset: ['start start', 'end end'],
  });

  // Which card is centred, as a float. The flat ends give the first and
  // last cards a moment to be read before the arc starts/stops moving.
  const cardPosition = useTransform(railProgress, [0, 0.08, 0.92, 1], [0, 0, cardCount - 1, cardCount - 1]);

  /* The mobile rail rides the same curve as cardPosition, so the phone that
     is centred always matches the caption and the lit dot. The flat 8% at
     each end gives the first and last phone a beat before the pin releases. */
  const mobileRailX = useTransform(
    cardPosition,
    (position) => -position * mobileStep,
  );

  // Discrete: drives blur, z-index and which thread animates. Skipped when
  // the arc is not rendered so mobile scrolling does not re-render for
  // state nothing is reading.
  useMotionValueEvent(cardPosition, 'change', (value) => {
    if (!canPin && !mobilePinned) return;
    const next = Math.max(0, Math.min(cardCount - 1, Math.round(value)));
    setActiveCard((current) => (current === next ? current : next));
  });


  /* ---- Hero backdrop: video where it makes sense, else the still ------- *
   * Desktop retains its existing wide-screen choice. Below md, browsers get
   * a muted inline autoplay attempt above an always-rendered poster layer;
   * reduced-motion keeps that mobile layer still.
   * ---------------------------------------------------------------------- */
  const [isWideScreen, setIsWideScreen] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsWideScreen(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  const playVideo = Boolean(heroVideo) && isWideScreen && !shouldReduceMotion;

  /* ---- Problem section: pinned scroll-focus ---------------------------- *
   * The WHOLE section (header + boxes) sits inside the sticky frame, so the
   * header stays frozen on screen with the boxes for the entire hold. The
   * previous attempt pinned only the boxes row, which let the header scroll
   * away and left ~415px of emptiness where it had been.
   *
   * Frame = 100vh with the block vertically centred (~556px of content, so
   * 72-262px of even breathing room, never a void). Spacer = 100vh + travel,
   * so the scroll consumed is exactly `travel` and the pin releases the
   * instant the third box finishes — no gap before the next section.
   *
   * Progress drives the active index ONLY. Nothing translates on X.
   * ---------------------------------------------------------------------- */
  const problemPinRef = useRef<HTMLDivElement>(null);
  const [activeProblem, setActiveProblem] = useState(-1);
  const [problemTravel, setProblemTravel] = useState(0);
  const problemFocus = isWideScreen && !shouldReduceMotion;

  useEffect(() => {
    if (!problemFocus) {
      setProblemTravel(0);
      return;
    }
    // One extra viewport of hold: ~300px per box, a deliberate pause
    // rather than a trap, and it scrolls back up out of the pin cleanly.
    const measure = () => setProblemTravel(Math.round(window.innerHeight));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [problemFocus]);

  const { scrollYProgress: problemProgress } = useScroll({
    target: problemPinRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(problemProgress, 'change', (value) => {
    if (!problemFocus) return;
    // 8% lead-in and lead-out where all three sit equal, three even
    // stages of 28% in between.
    let next = -1;
    if (value >= 0.08 && value < 0.92) {
      next = Math.min(problems.length - 1, Math.floor((value - 0.08) / 0.28));
    }
    setActiveProblem((current) => (current === next ? current : next));
  });

  // Dropping out of desktop mode must clear any dimming it left behind.
  useEffect(() => {
    if (!problemFocus) setActiveProblem(-1);
  }, [problemFocus]);



  /* ---- Hero parallax: the backdrop drifts and dims as it scrolls away --- */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], ['0%', '8%']);
  const heroImageOpacity = useTransform(heroProgress, [0, 1], [1, 0.35]);


  /* Defined once so the pinned and unpinned hubs cannot drift apart. Plain
     JSX, no hooks, so it is safe to build here. */
  const flowMark = (
    <motion.span
      className="flow-hub__mark"
      aria-hidden="true"
      variants={markSpin}
      {...(shouldReduceMotion
        ? {}
        : {
            initial: 'rest',
            whileInView: 'spin',
            viewport: { once: false, amount: 0.4 },
          })}
    >
      <svg viewBox="0 0 256 256">
        <path className="flow-mark__fill" fillRule="evenodd" d={FOURIX_MARK_PATH} />
      </svg>
    </motion.span>
  );

  return (
    // overflow-x: clip, NOT hidden. `hidden` makes this a scroll container,
    // which silently breaks `position: sticky` in every descendant — that is
    // what stopped the pinned rail from pinning. `clip` contains overflow
    // without creating a scroll container.
    <div className="min-h-screen [overflow-x:clip]">
      <a href="#home" className="skip-link">
        Skip to content
      </a>

      <SiteHeader navLinks={navLinks} heroRef={heroRef} />

      <main id="home" className="relative">
        {/* ------------------------------------------------- HERO ---- */}
        <section
          ref={heroRef}
          className="hero-stage stage-dark relative flex min-h-[100dvh] flex-col justify-center px-5 pb-28 pt-32 md:px-8 md:pb-32 md:pt-36"
        >
          {/* Full-bleed backdrop, then the directional scrim and bottom fade
              that keep type legible and melt it into the stage. */}
          <div className="hero-backdrop" aria-hidden="true">
            <motion.div
              className="hero-backdrop__layer"
              style={shouldReduceMotion ? undefined : { y: heroImageY, opacity: heroImageOpacity }}
            >
              {isMobile ? (
                <>
                  {/* The image paints immediately; the mobile video is only
                      an enhancement layered on top, never the sole hero. */}
                  <picture className="hero-backdrop__poster">
                    <source srcSet={heroBackdrop.webp} type="image/webp" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroBackdrop.jpg}
                      alt=""
                      width={2048}
                      height={1143}
                      className="hero-backdrop__media"
                      style={{ backgroundImage: `url(${heroBackdrop.blur})` }}
                      fetchPriority="high"
                      decoding="async"
                      draggable={false}
                    />
                  </picture>
                  {heroVideo && !shouldReduceMotion ? (
                    <video
                      className="hero-backdrop__media hero-backdrop__video"
                      poster={heroBackdrop.jpg}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <source src={heroVideo} type="video/mp4" />
                    </video>
                  ) : null}
                </>
              ) : playVideo ? (
                <video
                  className="hero-backdrop__media"
                  poster={heroBackdrop.jpg}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                  style={{ backgroundImage: `url(${heroBackdrop.blur})` }}
                >
                  <source src={heroVideo ?? ''} type="video/mp4" />
                </video>
              ) : (
                <picture>
                  <source srcSet={heroBackdrop.webp} type="image/webp" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroBackdrop.jpg}
                    alt=""
                    width={2048}
                    height={1143}
                    className="hero-backdrop__media"
                    style={{ backgroundImage: `url(${heroBackdrop.blur})` }}
                    fetchPriority="high"
                    decoding="async"
                    draggable={false}
                  />
                </picture>
              )}
            </motion.div>
            <div className="hero-backdrop__scrim hero-backdrop__scrim--center" />
            <div className="hero-backdrop__fade" />
          </div>

          <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
            <div className="flex max-w-2xl flex-col items-center text-center">
              <motion.p
                {...riseIn(0)}
                className="hero-eyebrow mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.24em]"
              >
                <Phone className="h-3.5 w-3.5" />
                AI automation for service businesses
              </motion.p>

              <motion.h1
                {...riseIn(0.15)}
                className="hero-title text-[2.35rem] font-normal leading-[1.06] sm:text-5xl md:text-[3.6rem] lg:text-[4.15rem]"
              >
                {heroHeadline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </motion.h1>

              <motion.p {...riseIn(0.3)} className="hero-copy mx-auto mt-7 max-w-xl text-base leading-8 md:text-lg md:leading-9">
                Missed calls and messages, no-show reminders, and inquiry follow-up — automated across every channel.
              </motion.p>

              <motion.div
                {...riseIn(0.45)}
                className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-7"
              >
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-pill px-7 py-3.5 text-sm"
                >
                  Book a meeting
                </a>
                <a
                  href="#how-it-works"
                  className="cta-ghost text-sm"
                >
                  See how it works
                  <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            </div>
          </div>

          <div className="hero-scroll-cue" aria-hidden="true">
            <span className="hero-scroll-cue__line" />
            <span className="hero-scroll-cue__text">Scroll to explore</span>
            <span className="hero-scroll-cue__line" />
          </div>
        </section>

        {/* ---------------------------------------------- PROBLEM ---- */}
        {/* The ref'd wrapper ALWAYS mounts — useScroll binds on the first
            render, when problemFocus is still false. Only the frame inside
            it switches between pinned and normal flow. */}
        <section id="problem">
          <div
            ref={problemPinRef}
            className={problemFocus ? 'relative' : undefined}
            style={problemFocus ? { height: `calc(100vh + ${problemTravel}px)` } : undefined}
          >
            <div
              className={
                problemFocus
                  ? // Header AND boxes both live in the sticky frame, so the
                    // header stays frozen on screen for the whole hold.
                    // pt-[5.5rem] clears the fixed site header.
                    'sticky top-0 flex h-screen flex-col justify-center pt-[5.5rem]'
                  : undefined
              }
            >
              <div
                className={
                  problemFocus
                    ? 'mx-auto w-full max-w-7xl px-5 md:px-8'
                    : 'mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40'
                }
              >
                <motion.p
                  {...revealIn(0)}
                  className="section-eyebrow uppercase tracking-[0.22em]"
                >
                  The problem
                </motion.p>
                <motion.h2
                  {...revealIn(0.09)}
                  className="section-display mt-5 max-w-2xl text-4xl font-normal leading-[1.1] md:text-6xl"
                >
                  Customers leave quietly.
                </motion.h2>
                <motion.p
                  {...revealIn(0.18)}
                  className="section-muted mt-6 max-w-xl text-base leading-8 md:text-lg"
                >
                  Nobody complains when a call or message goes unanswered. They just book elsewhere.
                </motion.p>

                {/* No transform on this row at any point — scroll progress
                    only picks which box is active. */}
                <div className="mt-10 grid gap-x-12 gap-y-14 md:mt-14 md:grid-cols-3">
                  {problems.map((item, index) => (
                    <ProblemColumn
                      key={item.title}
                      item={item}
                      index={index}
                      reduced={Boolean(shouldReduceMotion)}
                      focus={problemFocus}
                      active={activeProblem}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------ WHAT WE DO ---- *
         * Desktop: a pinned 3D coverflow — centre card flat, sharp and
         * animating; side cards tilted, scaled back, blurred and paused.
         * Touch / reduced-motion: the native swipe-snap carousel.
         * ---------------------------------------------------------- */}
        <section id="what-we-do">
          <div className="mx-auto max-w-7xl px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-40">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
            >
              <p className="section-eyebrow uppercase tracking-[0.22em]">What we do</p>
              <h2 className="section-display mt-6 max-w-2xl text-4xl font-normal leading-[1.08] md:text-6xl">
                One system that answers for you.
              </h2>
            </motion.div>
          </div>

          {/* The ref'd spacer ALWAYS mounts, even before canPin flips.
              useScroll binds its listener on first render — if the target
              ref is null then, framer-motion never re-attaches and progress
              stays stuck at 0 (which froze the arc and pushed both side
              cards to the right). Only the contents switch on canPin. */}
          <div
            ref={railSectionRef}
            className="relative"
            style={sectionPinned ? { height: `calc(100vh + ${railTravel}px)` } : undefined}
          >
            {canPin ? (
              // pt-[5.5rem] clears the fixed site header, which otherwise
              // overlays the caption at every viewport under ~1000px.
              <div className="sticky top-0 flex h-screen flex-col items-center justify-center pt-[5.5rem]">
                {/* Caption tracks whichever card is centred. */}
                <div className="mb-6 h-24 w-full max-w-2xl px-6 text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCard}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: EASE_CINEMATIC }}
                    >
                      <h3 className="section-display text-2xl font-medium leading-snug md:text-3xl">
                        {packageParts[activeCard].title}
                      </h3>
                      <p className="section-muted mt-3 text-sm leading-7 md:text-base">
                        {packageParts[activeCard].text}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="coverflow">
                  <div className="coverflow__track">
                    {packageParts.map((part, index) => (
                      <CoverflowCard
                        key={part.title}
                        part={part}
                        index={index}
                        count={cardCount}
                        step={cardStep}
                        position={cardPosition}
                        distance={Math.abs(ringOffset(index - activeCard, cardCount))}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2" aria-hidden="true">
                  {packageParts.map((part, index) => (
                    <span
                      key={part.title}
                      className={['coverflow__dot', index === activeCard ? 'coverflow__dot--on' : ''].join(' ')}
                    />
                  ))}
                </div>
              </div>
            ) : isMobile ? (
              <div
                className={
                  mobilePinned
                    ? 'sticky top-0 flex h-screen flex-col justify-center pt-[4.5rem]'
                    : undefined
                }
              >
              <div className={['mobile-chat-carousel', mobilePinned ? 'mobile-chat-carousel--pinned' : ''].join(' ')}>
                <div className="mobile-chat-carousel__copy" aria-live="polite">
                  <h3 className="section-display text-xl font-medium leading-snug">{packageParts[activeCard].title}</h3>
                  <p className="section-muted mt-3 text-sm leading-7">{packageParts[activeCard].text}</p>
                </div>
                <motion.div
                  ref={mobileRailRef}
                  className="mobile-chat-carousel__rail"
                  style={mobilePinned ? { x: mobileRailX } : undefined}
                  aria-label="Automation conversation examples"
                >
                  {packageParts.map((part, index) => (
                    <article
                      key={part.title}
                      className="mobile-chat-carousel__slide"
                      aria-label={`${index + 1} of ${cardCount}: ${part.title}`}
                    >
                      <ChatThread
                        messages={part.messages}
                        label={`Example conversation: ${part.title}`}
                        paused={index !== activeCard}
                      />
                    </article>
                  ))}
                </motion.div>
                <div className="mobile-chat-carousel__dots" aria-label="Choose an automation example">
                  {packageParts.map((part, index) => (
                    <button
                      key={part.title}
                      type="button"
                      className={['mobile-chat-carousel__dot', index === activeCard ? 'mobile-chat-carousel__dot--on' : ''].join(' ')}
                      aria-label={`Show ${part.title}`}
                      aria-current={index === activeCard ? 'true' : undefined}
                      onClick={() => goToMobileCard(index)}
                    />
                  ))}
                </div>
              </div>
              </div>
            ) : (
              <>
                <div className="chat-rail-swipe items-end px-5 pb-6 md:px-8">
                  {packageParts.map((part) => (
                    <article key={part.title} className="flex w-fit shrink-0 flex-col items-start">
                      <div className="max-w-[min(19rem,78vw)]">
                        <h3 className="section-display text-xl font-medium leading-snug md:text-2xl">{part.title}</h3>
                        <p className="section-muted mt-3 text-sm leading-7">{part.text}</p>
                      </div>
                      <div className="mt-8">
                        <ChatThread messages={part.messages} label={`Example conversation: ${part.title}`} />
                      </div>
                    </article>
                  ))}
                </div>
                <p className="section-muted mx-auto max-w-7xl px-5 pt-4 text-xs md:px-8" aria-hidden="true">
                  Swipe to see all three →
                </p>
              </>
            )}
          </div>

          <div className="mx-auto max-w-7xl px-5 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
            <p className="hairline-top section-muted max-w-lg pt-14 text-base leading-8 md:text-lg">
              Together, one outcome — your business stops losing customers to slow or missed responses.
            </p>
          </div>
        </section>

        {/* ------------------------------------- HOW IT CONNECTS ---- *
          * An intentional always-dark band between "What we do" (the three
          * automations) and "How it works" (the delivery stages): this is
          * the "so how does it actually plug in" beat. Five channels fan
          * into the agent, four results fan out.
          *
          * Above lg it is the three-column flow. Below lg the same nodes
          * restack vertically and the fans swap for a single drawn line —
          * the labels are rendered ONCE and reflow, only the decorative
          * connectors are per-breakpoint.
          * ---------------------------------------------------------- */}
        <section id="how-it-connects" className="flow-stage">
          {/* The ref'd spacer ALWAYS mounts, pinned or not. useScroll binds
              its listener on the first render — if the target ref were only
              inside the canPin branch it would bind to null, never re-attach,
              and progress would sit frozen at 0. Only the height and the
              frame's classes switch. */}
          <div
            ref={flowPinRef}
            className="relative"
            style={canPin ? { height: `calc(100vh + ${flowTravel}px)` } : undefined}
          >
            {/* Headline AND diagram sit inside the sticky frame together, so
                what gets held is the whole framing — nothing important
                scrolls out from under the hold. pt-[5.5rem] clears the 85px
                fixed header. */}
            <div className={canPin ? 'sticky top-0 flex h-screen flex-col justify-center pt-[5.5rem]' : undefined}>
              <div
                className={
                  canPin
                    ? 'mx-auto w-full max-w-7xl px-5 md:px-8'
                    : 'mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28'
                }
              >
                <motion.p {...revealIn(0)} className="section-eyebrow uppercase tracking-[0.22em]">
                  How it connects
                </motion.p>
                <motion.h2
                  {...revealIn(0.09)}
                  className="section-display mt-5 max-w-2xl text-4xl font-normal leading-[1.1] md:text-6xl"
                >
                  Every channel, answered by one system.
                </motion.h2>

                <motion.div
                  className="mt-10 md:mt-14 lg:grid lg:grid-cols-[auto_minmax(5rem,1fr)_auto_minmax(5rem,1fr)_auto] lg:items-center"
                  {...(canPin || shouldReduceMotion
                    ? {}
                    : {
                        initial: 'hidden',
                        /* flowShown is latched: it turns on when the section
                           is reached and off ONLY above it, so scrolling down
                           past and back up never re-hides anything. */
                        animate: flowShown ? 'shown' : 'hidden',
                      })}
                >
                  <div className="flow-column flow-column--in">
                    {flowInputs.map((item, index) =>
                      canPin ? (
                        <FlowPillPinned
                          key={item.label}
                          label={item.label}
                          Icon={item.Icon}
                          progress={flowReveal}
                          range={FLOW_WINDOWS.input(index)}
                          drift={-18}
                        />
                      ) : (
                        <FlowPill
                          key={item.label}
                          label={item.label}
                          Icon={item.Icon}
                          variants={flowPillIn(flowAt.input(index), -18)}
                        />
                      ),
                    )}
                  </div>

                  <FlowWires
                    from={flowInY}
                    to={[FLOW_MID]}
                    delay={flowAt.lineIn}
                    progress={canPin ? flowReveal : undefined}
                    range={canPin ? FLOW_WINDOWS.lineIn : undefined}
                  />

                  {canPin ? (
                    <motion.div style={{ opacity: flowHubOpacity, scale: flowHubScale }} className="flow-hub">
                      <motion.span
                        style={{ opacity: flowGlowOpacity, scale: flowGlowScale }}
                        className="flow-hub__glow"
                        aria-hidden="true"
                      />
                      {flowMark}
                      <p className="flow-hub__name">Fourix Agent</p>
                    </motion.div>
                  ) : (
                    <motion.div variants={flowHubIn} className="flow-hub">
                      <motion.span variants={flowHubGlow} className="flow-hub__glow" aria-hidden="true" />
                      {flowMark}
                      <p className="flow-hub__name">Fourix Agent</p>
                    </motion.div>
                  )}

                  <FlowWires
                    from={[FLOW_MID]}
                    to={flowOutY}
                    delay={flowAt.lineOut}
                    progress={canPin ? flowReveal : undefined}
                    range={canPin ? FLOW_WINDOWS.lineOut : undefined}
                  />

                  <div className="flow-column flow-column--out">
                    {flowOutputs.map((item, index) =>
                      canPin ? (
                        <FlowPillPinned
                          key={item.label}
                          label={item.label}
                          Icon={item.Icon}
                          tint={item.tint}
                          progress={flowReveal}
                          range={FLOW_WINDOWS.output(index)}
                          drift={18}
                        />
                      ) : (
                        <FlowPill
                          key={item.label}
                          label={item.label}
                          Icon={item.Icon}
                          tint={item.tint}
                          variants={flowPillIn(flowAt.output(index), 18)}
                        />
                      ),
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------- HOW IT WORKS ---- */}
        {/* Plain section: the wrapper must never sit at opacity 0, or the
            stages would be invisible rather than dim before they are
            reached. The rows manage their own dim-to-bright. */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <motion.p {...revealIn(0)} className="section-eyebrow uppercase tracking-[0.22em]">
            Delivery
          </motion.p>
          <motion.h2
            {...revealIn(0.09)}
            className="section-display mt-5 max-w-2xl text-4xl font-normal leading-[1.1] md:text-6xl"
          >
            How it works
          </motion.h2>
          <motion.p {...revealIn(0.18)} className="section-muted mt-6 max-w-xl text-base leading-8 md:text-lg">
            Five stages to a system that runs on its own — then tuned every month.
          </motion.p>

          {/* The rail sits in a gutter to the left of the list; the list is
              indented to make room. Column widths are unchanged. */}
          <div className="relative mt-20 pl-7 md:mt-28 md:pl-10">
            <div className="process-rail" aria-hidden="true">
              <motion.div
                className="process-rail__fill"
                style={shouldReduceMotion ? { scaleY: 1 } : { scaleY: railFill }}
              />
            </div>

            <ol ref={processRef}>
              {process.map((step, index) => (
                <ProcessRow
                  key={step.title}
                  step={step}
                  index={index}
                  count={process.length}
                  progress={railReveal}
                  lit={index <= litStage}
                  reduced={Boolean(shouldReduceMotion)}
                />
              ))}
            </ol>
          </div>

          <p className="quiet-note hairline-top mt-4 pt-8 text-sm">Built on modern, reliable tooling.</p>
        </section>

        {/* ------------------------------------------------ PROOF ---- */}
        {showcase.length > 0 ? (
          <motion.section
            id="proof"
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            custom={0}
            className="mx-auto max-w-7xl px-5 py-20 md:px-8"
          >
            <div className="mb-10 max-w-3xl">
              <p className="section-eyebrow uppercase tracking-[0.22em]">Proof</p>
              <h2 className="mt-3 text-4xl font-bold md:text-5xl">See it running.</h2>
            </div>

            <div className="grid gap-5">
              {showcase.map((item) => (
                <article
                  key={item.title}
                  className="surface-panel relative overflow-hidden rounded-[32px] px-6 py-10 md:px-10 md:py-12"
                >
                  <span className="chip inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em]">
                    {item.label}
                  </span>
                  <h3 className="section-display mt-5 text-2xl font-normal md:text-3xl">{item.title}</h3>

                  <dl className="mt-8 grid gap-8 md:grid-cols-3">
                    <div>
                      <dt className="section-eyebrow uppercase tracking-[0.2em]">The problem</dt>
                      <dd className="section-muted mt-3 text-base leading-8">{item.problem}</dd>
                    </div>
                    <div>
                      <dt className="section-eyebrow uppercase tracking-[0.2em]">What we built</dt>
                      <dd className="section-muted mt-3 text-base leading-8">{item.built}</dd>
                    </div>
                    <div>
                      <dt className="section-eyebrow uppercase tracking-[0.2em]">Tools used</dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {item.tools.map((tool) => (
                          <span key={tool} className="chip rounded-full px-3 py-1 text-sm">
                            {tool}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>

                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="cta-pill mt-9 px-5 py-3 text-sm"
                    >
                      {item.hrefLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </motion.section>
        ) : null}

        {/* ------------------------------------------------- TEAM ---- */}
        {founders.length > 0 ? (
          <motion.section
            id="team"
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            custom={0}
            className="mx-auto max-w-7xl px-5 py-20 md:px-8"
          >
            <div className="mb-10 max-w-3xl">
              <p className="section-eyebrow uppercase tracking-[0.22em]">About</p>
              <h2 className="mt-3 text-4xl font-bold md:text-5xl">Who you will be working with.</h2>
              <p className="section-muted mt-6 max-w-xl text-base leading-8 md:text-lg">
                Fourix is a two-person team based in Islamabad. You deal with us directly, from the first call to the monthly
                review.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {founders.map((founder, index) => (
                <motion.article
                  key={founder.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="surface-card flex items-center gap-6 overflow-hidden rounded-[24px] p-7"
                >
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    width={112}
                    height={112}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-28 sm:w-28"
                  />
                  <div className="min-w-0">
                    <h3 className="section-display text-xl font-medium">{founder.name}</h3>
                    <p className="section-eyebrow mt-1.5 uppercase tracking-[0.16em]">{founder.role}</p>
                    <p className="section-muted mt-3.5 text-base leading-8">{founder.bio}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        ) : null}

        {/* ---------------------------------------------- CONTACT ---- *
         * Same rhythm as the problem and how-it-works sections: content
         * straight onto the page background, left-aligned eyebrow, the
         * shared headline scale, hairline rules instead of cards.
         * ---------------------------------------------------------- */}
        <section id="book" className="mx-auto max-w-7xl px-5 pb-28 pt-14 md:px-8 md:pb-40 md:pt-20">
          <motion.p {...revealIn(0)} className="section-eyebrow uppercase tracking-[0.22em]">
            Book a meeting
          </motion.p>
          <motion.h2
            {...revealIn(0.09)}
            className="section-display mt-5 max-w-2xl text-4xl font-normal leading-[1.1] md:text-6xl"
          >
            Let&rsquo;s find where you are losing customers.
          </motion.h2>
          <motion.p {...revealIn(0.18)} className="section-muted mt-6 max-w-xl text-base leading-8 md:text-lg">
            Thirty minutes. Scope and cost are covered on the call — they depend on what you already run, so we
            don&rsquo;t publish a price.
          </motion.p>

          <motion.div
            {...revealIn(0.27)}
            className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7"
          >
            <a href={calendlyUrl} target="_blank" rel="noreferrer" className="cta-pill px-7 py-3.5 text-sm">
              Book a meeting
              <CalendarDays className="h-4 w-4" />
            </a>
            <p className="section-muted text-sm">30 minutes · Straight answers · No pressure</p>
          </motion.div>

          {/* Grid matches the problem section's columns, so email and
              location line up with the columns above them. */}
          <div className="mt-20 grid gap-x-12 gap-y-14 md:mt-28 md:grid-cols-3">
            <motion.a
              {...revealIn(0, 0.3)}
              href="mailto:contact.fourix@gmail.com"
              className="hairline-top pt-8"
            >
              <span className="contact-label flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em]">
                <Mail className="h-4 w-4" /> Email
              </span>
              <span className="section-display mt-4 block text-lg font-normal underline-offset-4 hover:underline md:text-xl">
                contact.fourix@gmail.com
              </span>
            </motion.a>

            <motion.a
              {...revealIn(0.1, 0.3)}
              href="https://maps.google.com/?q=Islamabad,Pakistan"
              target="_blank"
              rel="noreferrer"
              className="hairline-top pt-8"
            >
              <span className="contact-label flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em]">
                <MapPin className="h-4 w-4" /> Location
              </span>
              <span className="section-display mt-4 block text-lg font-normal underline-offset-4 hover:underline md:text-xl">
                Islamabad, Pakistan
              </span>
            </motion.a>
          </div>
        </section>

      </main>

      <SiteFooter navLinks={navLinks} />
    </div>
  );
}
