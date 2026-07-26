'use client';

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Camera,
  CheckCircle2,
  CircleUserRound,
  Globe,
  Layers3,
  Link,
  MapPin,
  Mail,
  Menu,
  MonitorSmartphone,
  Moon,
  Phone,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Sun,
  Workflow,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';

const services = [
  {
    title: 'Web Development',
    description:
      'Conversion-first websites and high-performance landing pages engineered to turn traffic into qualified opportunities.',
    icon: Globe,
  },
  {
    title: 'App Development',
    description:
      'Cross-platform product experiences that feel fast, polished, and built to scale with your business ambitions.',
    icon: MonitorSmartphone,
  },
  {
    title: 'AI Automations',
    description:
      'Operational AI systems that remove manual work, accelerate workflows, and unlock measurable efficiency gains.',
    icon: Bot,
  },
  {
    title: 'Consultation',
    description:
      'Expert technical consultation to help you choose the right stack, optimize your architecture, and scale your digital products.',
    icon: Workflow,
  },
  {
    title: 'Software Testing',
    description:
      'Comprehensive quality assurance services including automated and manual testing to ensure your software is bug-free and performant.',
    icon: ShieldCheck,
  },
  {
    title: 'UI/UX Design',
    description:
      'User-centric design solutions that create intuitive, engaging, and beautiful digital experiences for your users.',
    icon: Sparkles,
  },
] as const;

const projects = [
  {
    title: 'Employee Attendence System',
    type: 'AI & Web',
    description: 'Face recognition based attendance system',
    screenshots: [
      '/Projects/Employee Attendence System/1.png',
      '/Projects/Employee Attendence System/2.png',
      '/Projects/Employee Attendence System/3.png',
      '/Projects/Employee Attendence System/4.png',
      '/Projects/Employee Attendence System/5.png',
      '/Projects/Employee Attendence System/6.png',
      '/Projects/Employee Attendence System/7.png',
      '/Projects/Employee Attendence System/8.png',
    ],
  },
  {
    title: 'LUXE',
    type: 'Web',
    description: 'Next-gen E-commerce platform',
    screenshots: [
      '/Projects/NanoCommerce/1.png',
      '/Projects/NanoCommerce/2.png',
      '/Projects/NanoCommerce/3.png',
    ],
  },
  {
    title: 'AI Resume Builder',
    type: 'AI & Web',
    description: 'AI-powered resume generation and optimization platform',
    screenshots: [
      '/Projects/AI Resume Builder/1.png',
      '/Projects/AI Resume Builder/2.png',
      '/Projects/AI Resume Builder/3.png',
      '/Projects/AI Resume Builder/4.png',
      '/Projects/AI Resume Builder/5.png',
      '/Projects/AI Resume Builder/11.png',
    ],
  },
] as const;

const technologies = [
  { name: 'React', logo: 'https://cdn.simpleicons.org/react' },
  { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs' },
  { name: 'Next.js', logo: 'https://cdn.simpleicons.org/nextdotjs' },
  { name: 'Express', logo: 'https://cdn.simpleicons.org/express' },
  { name: 'LangChain', logo: 'https://cdn.simpleicons.org/langchain' },
  { name: 'n8n', logo: 'https://cdn.simpleicons.org/n8n' },
  { name: 'Flutter', logo: 'https://cdn.simpleicons.org/flutter' },
  { name: 'MySQL', logo: 'https://cdn.simpleicons.org/mysql' },
  { name: 'FastAPI', logo: 'https://cdn.simpleicons.org/fastapi' },
  { name: 'Flask', logo: 'https://cdn.simpleicons.org/flask' },
  { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github' },
  { name: 'Git', logo: 'https://cdn.simpleicons.org/git' },
  { name: 'LLMs', icon: Bot },
] as const;

const heroHeadlines = [
  ['Build the next', 'premium digital brand'],
  ['Launch a sharper', 'digital presence.'],
  ['Design smarter', 'high-growth brands.'],
  ['Scale with modern', 'web and AI systems.'],
] as const;

const differentiators = [
  {
    title: 'Design-led execution',
    text: 'We translate product ambition into premium digital experiences that feel unmistakably modern.',
    icon: Sparkles,
  },
  {
    title: 'AI-native delivery',
    text: 'From discovery to rollout, our process blends sharp strategy with automation-first thinking.',
    icon: Bot,
  },
  {
    title: 'Fast, measurable impact',
    text: 'Every build is structured to improve conversion, clarity, and operational speed without bloat.',
    icon: Rocket,
  },
  {
    title: 'Reliable execution',
    text: 'Clear milestones, thoughtful communication, and a workflow built for delivery confidence.',
    icon: ShieldCheck,
  },
] as const;

const process = [
  {
    title: 'Discovery',
    description: 'We map your positioning, audience, and opportunity to define the right growth path.',
  },
  {
    title: 'Design',
    description: 'We turn strategy into a premium visual system and a frictionless user experience.',
  },
  {
    title: 'Development',
    description: 'We build the product experience with speed, precision, and production-grade reliability.',
  },
  {
    title: 'Launch',
    description: 'We ship with confidence and refine every detail that shapes the first impression.',
  },
  {
    title: 'Automation & Growth',
    description: 'We layer AI and workflow improvements to keep momentum high after launch.',
  },
] as const;

const calendlyUrl = 'https://calendly.com/contact-fourix/30min';
const footerSocials = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/1EdSgaohqx/',
    bg: 'bg-[#1877F2]',
    logo: 'https://cdn.simpleicons.org/facebook/ffffff',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    bg: 'bg-[#0A66C2]',
    logo: null,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/fourix.ai?igsh=MzY5eTF2ZDk0OHg4',
    bg: 'bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]',
    logo: 'https://cdn.simpleicons.org/instagram/ffffff',
  },
  {
    name: 'Gmail',
    href: 'mailto:contact.fourix@gmail.com',
    bg: 'bg-[#EA4335]',
    logo: 'https://cdn.simpleicons.org/gmail/ffffff',
  },
] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay,
      ease: 'easeOut',
    },
  }),
};

function createQrMatrix(seed: string) {
  const size = 21;
  const cells = Array.from({ length: size }, () => Array.from({ length: size }, () => false));

  const drawFinder = (startRow: number, startCol: number) => {
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const isEdge = row === 0 || row === 6 || col === 0 || col === 6;
        const isCenter = row >= 2 && row <= 4 && col >= 2 && col <= 4;
        cells[startRow + row][startCol + col] = isEdge || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 2147483647;
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const inFinderZone =
        (row < 7 && col < 7) ||
        (row < 7 && col >= size - 7) ||
        (row >= size - 7 && col < 7);

      if (inFinderZone) {
        continue;
      }

      hash = (hash * 48271) % 2147483647;
      cells[row][col] = hash % 3 === 0;
    }
  }

  return cells;
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [heroHeadlineIndex, setHeroHeadlineIndex] = useState(0);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const activeProject = projects[activeProjectIndex];
  const totalProjectSlides = activeProject.screenshots.length + 1;
  const qrMatrix = createQrMatrix(activeProject.title);
  const activeHeroHeadline = heroHeadlines[heroHeadlineIndex];

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('fourix-theme');
    const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
    window.localStorage.setItem('fourix-theme', theme);
  }, [theme]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (activeSlideIndex < totalProjectSlides - 1) {
        setActiveSlideIndex((current) => current + 1);
        return;
      }

      setActiveProjectIndex((current) => (current + 1) % projects.length);
      setActiveSlideIndex(0);
    }, shouldReduceMotion ? 4500 : 3000);

    return () => window.clearTimeout(timeout);
  }, [activeSlideIndex, shouldReduceMotion, totalProjectSlides]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setHeroHeadlineIndex((current) => (current + 1) % heroHeadlines.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!isMobileModalOpen && !isMobileNavOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileModalOpen, isMobileNavOpen]);

  const handleProjectSelect = (index: number) => {
    setActiveProjectIndex(index);
    setActiveSlideIndex(0);
  };

  const handlePortfolioOpen = () => {
    setIsMobileNavOpen(false);

    window.setTimeout(() => {
      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div
      className={['min-h-screen overflow-x-hidden text-foreground', theme === 'light' ? 'theme-light' : 'theme-dark'].join(
        ' ',
      )}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="theme-ambient-primary absolute left-[-10%] top-[-8%] h-80 w-80 rounded-full blur-3xl" />
        <div className="theme-ambient-secondary absolute right-[-8%] top-[12%] h-96 w-96 rounded-full blur-3xl" />
        <div className="theme-ambient-tertiary absolute bottom-[-8%] left-[18%] h-80 w-80 rounded-full blur-3xl" />
        <div className="theme-ambient-overlay absolute inset-0" />
      </div>

      <header className="panel-dark sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl">
        <div className="mx-auto max-w-[80rem] px-5 py-4 md:px-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-3">
              <a href="#home" className="flex min-w-0 items-center gap-3">
                <Image
                  src="/2.png"
                  alt="Fourix logo"
                  width={52}
                  height={52}
                  className="h-10 w-10 shrink-0 rounded-2xl border border-border/70 object-cover sm:h-12 sm:w-12"
                  loading="eager"
                  priority
                />
                <span className="fourix-wordmark" aria-label="Fourix">
                  <Image src="/fourix-wordmark.png" alt="" width={660} height={230} className="fourix-wordmark__image" priority />
                </span>
              </a>

              <div className="flex items-center gap-2 sm:gap-3 md:hidden">
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="theme-toggle inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm font-semibold transition hover:scale-[1.02] sm:h-11 sm:px-4"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="hidden sm:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  <span className="sm:hidden">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>

                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="nav-cta inline-flex h-10 items-center justify-center rounded-[999px] px-3 text-sm font-semibold transition hover:scale-[1.02] sm:h-11 sm:px-4"
                >
                  <span className="hidden sm:inline">Book a Meeting</span>
                  <span className="sm:hidden">Book</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen((current) => !current)}
                  className="theme-toggle inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition hover:scale-[1.02] sm:h-11 sm:w-11"
                  aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={isMobileNavOpen}
                >
                  {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
              <button type="button" onClick={handlePortfolioOpen} className="cursor-pointer transition hover:text-primary">
                Portfolio
              </button>
              <a href="#services" className="transition hover:text-primary">
                Services
              </a>
              <a href="#why-us" className="transition hover:text-primary">
                Why Us
              </a>
              <a href="#process" className="transition hover:text-primary">
                Process
              </a>
              <a href="#book" className="transition hover:text-primary">
                Contact
              </a>
            </nav>
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="theme-toggle inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition hover:scale-[1.02]"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="nav-cta inline-flex h-11 items-center justify-center rounded-[999px] px-4 text-sm font-semibold transition hover:scale-[1.02]"
              >
                Book a Meeting
              </a>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileNavOpen ? (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] md:hidden"
          >
            <button
              type="button"
              aria-label="Close navigation backdrop"
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
              onClick={() => setIsMobileNavOpen(false)}
            />

            <motion.aside
              initial={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? { x: 0 } : { x: '100%' }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.28, ease: 'easeOut' }}
              className="panel-dark absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col border-l border-border/70 px-6 py-6 shadow-[-20px_0_60px_rgba(0,0,0,0.28)]"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Menu</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">Navigate Fourix</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="theme-toggle inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition hover:scale-[1.02]"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-3 text-base text-foreground">
                <button
                  type="button"
                  onClick={handlePortfolioOpen}
                  className="inline-flex cursor-pointer items-center justify-between rounded-2xl border border-border/60 px-4 py-3 text-left transition hover:border-primary/40 hover:text-primary"
                >
                  <span>Portfolio</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href="#services"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="inline-flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3 transition hover:border-primary/40 hover:text-primary"
                >
                  <span>Services</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="#why-us"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="inline-flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3 transition hover:border-primary/40 hover:text-primary"
                >
                  <span>Why Us</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="#process"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="inline-flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3 transition hover:border-primary/40 hover:text-primary"
                >
                  <span>Process</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="#book"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="inline-flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3 transition hover:border-primary/40 hover:text-primary"
                >
                  <span>Contact</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </nav>

              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMobileNavOpen(false)}
                className="nav-cta mt-auto inline-flex h-11 items-center justify-center rounded-[999px] px-4 text-sm font-semibold transition hover:scale-[1.02]"
              >
                Book a Meeting
              </a>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main id="home" className="relative">
        <section className="mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-10 md:px-8 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={shouldReduceMotion ? false : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'visible'}
              variants={fadeUp}
              custom={0}
              className="max-w-2xl"
            >
              <div className="hero-pill mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
                <Sparkles className="h-3.5 w-3.5" />
                Premium AI & Digital Growth Studio
              </div>

              <h1 className="hero-title hero-title-typing max-w-3xl pr-3 text-4xl font-black leading-[1.08] tracking-tight md:pr-4 md:text-5xl lg:text-6xl">
                <span className="hero-title-typing__copy">
                  <span className="block">{activeHeroHeadline[0]}</span>
                  <span className="hero-title__accent block bg-clip-text text-transparent">{activeHeroHeadline[1]}</span>
                </span>
                <span
                  key={heroHeadlineIndex}
                  className="hero-title-typing__overlay"
                  aria-hidden="true"
                  style={
                    {
                      ['--hero-title-steps-1' as string]: `${Math.max(activeHeroHeadline[0].length, 10)}`,
                      ['--hero-title-steps-2' as string]: `${Math.max(activeHeroHeadline[1].length, 12)}`,
                    } as CSSProperties
                  }
                >
                  <span className="hero-title-typing__line hero-title-typing__line--first">{activeHeroHeadline[0]}</span>
                  <span className="hero-title-typing__line hero-title-typing__line--second hero-title__accent block bg-clip-text text-transparent">
                    {activeHeroHeadline[1]}
                  </span>
                </span>
              </h1>

              <p className="hero-copy mt-6 max-w-2xl text-lg leading-8 md:text-xl">
                We help ambitious companies launch faster, convert smarter, and automate better with modern web experiences,
                polished product apps, and AI systems designed for growth.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#services"
                  className="hero-button inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5"
                >
                  View Services
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="hero-chip-group mt-10 flex flex-wrap gap-4 text-sm">
                <div className="hero-chip rounded-full px-4 py-2">Fast deployments</div>
                <div className="hero-chip rounded-full px-4 py-2">AI-first workflows</div>
                <div className="hero-chip rounded-full px-4 py-2">Conversion-focused UX</div>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'visible'}
              variants={fadeUp}
              custom={0.12}
              className="relative"
            >
              <div className="absolute -left-4 top-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -right-4 bottom-4 h-28 w-28 rounded-full bg-accent/20 blur-2xl" />

              <div className="panel-light relative overflow-hidden rounded-[28px] border border-border/70 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="panel-light rounded-[22px] border border-border/60 p-6">
                  <div className="flex items-center justify-between border-b border-border/70 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Growth system</p>
                      <h2 className="mt-2 text-2xl font-bold">Built for modern growth</h2>
                      <p className="mt-2 text-sm text-[#111111]/65">Clean digital experiences with strategy, speed, and clarity.</p>
                    </div>
                    <div className="rounded-full bg-[#0C0C0C]/25 p-2 text-[#0C0C0C]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div className="rounded-[24px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,242,242,0.92))] p-6 min-h-[17rem] shadow-[0_16px_45px_rgba(0,0,0,0.14)] backdrop-blur-sm">
                      <div className="flex flex-col justify-center">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#111111]/58">Focus</p>
                          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#111111]">Simple. Modern. Effective.</p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-border/70 bg-white/55 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#111111]/55">Strategy</p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-white/55 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#111111]/55">Design</p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-white/55 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#111111]/55">Growth</p>
                        </div>
                      </div>

                      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-black/8">
                        <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-[#111111] via-[#7D7465] to-[#CBB99C]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section
          id="services"
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-7xl px-5 py-20 md:px-8"
        >
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Services</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">What we build</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={shouldReduceMotion ? undefined : { y: -8 }}
                  className="group relative overflow-hidden rounded-[24px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,242,242,0.92))] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.14)] backdrop-blur-sm transition"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.95),_transparent_48%)]" />
                  <div className="relative mb-5 inline-flex rounded-2xl bg-[#0C0C0C]/10 p-3 text-[#0C0C0C] transition group-hover:scale-110 group-hover:bg-[#0C0C0C]/18">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative text-2xl font-semibold text-[#111111]">{service.title}</h3>
                  <p className="relative mt-3 text-base leading-7 text-[#111111]/75">{service.description}</p>
                  <div className="relative mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#0C0C0C] to-[#868686]" />
                  <div className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Explore solution <ArrowUpRight className="h-4 w-4" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          id="portfolio"
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-7xl px-5 py-20 md:px-8"
        >
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Portfolio</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">Our Innovations</h2>
            <p className="portfolio-intro mt-4 text-base md:text-lg">
              Explore our projects through detailed visual showcases. See the innovation in action.
            </p>
          </div>

          <div className="relative mx-auto overflow-hidden rounded-[30px] border border-black/10 bg-[linear-gradient(135deg,#EDEDED_0%,#F5F5F5_55%,#FFFFFF_100%)] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.18)] md:p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.82),_transparent_60%)]" />
            <div className="relative rounded-[24px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,242,242,0.92))] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.14)] backdrop-blur-sm md:p-5">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-border/70 pb-4">
                <div className="inline-flex items-center rounded-full bg-[#0C0C0C]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#111111]">
                  Project Showcase
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileModalOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-white/70 text-[#111111] transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white dark:bg-black/20"
                  aria-label={`Open mobile view for ${activeProject.title}`}
                >
                  <ScanSearch className="h-4 w-4" />
                </button>
              </div>

              <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(244,244,244,0.94))] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <div className="relative aspect-[16/10] min-h-[320px] w-full md:min-h-[460px]">
                  <AnimatePresence mode="wait">
                    {activeSlideIndex === 0 ? (
                      <motion.div
                        key={`${activeProject.title}-title`}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: shouldReduceMotion ? 0.1 : 0.45, ease: 'easeOut' }}
                        className="absolute inset-0 flex items-center justify-center p-6 text-center md:p-8"
                      >
                        <div className="max-w-3xl">
                          <div
                            className="project-title-typing"
                            style={
                              {
                                ['--project-title-steps' as string]: `${Math.max(activeProject.title.length, 10)}`,
                              } as CSSProperties
                            }
                          >
                            <h3 className="project-title-display text-3xl font-black tracking-tight md:text-5xl">{activeProject.title}</h3>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`${activeProject.title}-${activeSlideIndex}`}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.015 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                        transition={{ duration: shouldReduceMotion ? 0.1 : 0.45, ease: 'easeOut' }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={activeProject.screenshots[activeSlideIndex - 1]}
                          alt={`${activeProject.title} screenshot ${activeSlideIndex}`}
                          fill
                          className="object-contain object-center"
                          sizes="(max-width: 768px) 100vw, 1200px"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(242,242,242,0.9))] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#111111]/60">{activeProject.type}</p>
                  <p className="mt-2 text-lg font-semibold text-[#111111] md:text-2xl">{activeProject.title}</p>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  <div className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-medium text-[#111111]/80">
                    {activeSlideIndex === 0 ? 'Intro' : `${activeSlideIndex} / ${activeProject.screenshots.length}`}
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2">
                    {Array.from({ length: totalProjectSlides }).map((_, index) => (
                      <button
                        key={`${activeProject.title}-progress-${index}`}
                        type="button"
                        onClick={() => setActiveSlideIndex(index)}
                        className={[
                          'h-2 rounded-full transition-all',
                          index === activeSlideIndex ? 'w-10 bg-[#111111]' : 'w-2.5 bg-[#111111]/30 hover:bg-[#111111]/50',
                        ].join(' ')}
                        aria-label={`Go to slide ${index + 1} for ${activeProject.title}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                onClick={() => handleProjectSelect(index)}
                className={[
                  'relative overflow-hidden rounded-[24px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,242,242,0.92))] p-5 text-left shadow-[0_16px_45px_rgba(0,0,0,0.14)] backdrop-blur-sm transition',
                  index === activeProjectIndex
                    ? 'border-primary/55 ring-2 ring-primary/20'
                    : 'border-border/70 hover:-translate-y-1 hover:border-primary/30',
                ].join(' ')}
                aria-pressed={index === activeProjectIndex}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.95),_transparent_48%)]" />
                <div className="relative flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#0C0C0C]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111]">
                    {project.type}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[#111111]/55" />
                </div>
                <h3 className="relative mt-4 text-xl font-semibold text-[#111111]">{project.title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-[#111111]/75">{project.description}</p>
                <div className="relative mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#0C0C0C] to-[#868686]" />
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-7xl px-5 py-20 md:px-8"
        >
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Technology Stack</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">Technologies We Use</h2>
            <p className="portfolio-intro mt-4 text-base md:text-lg">
              We use modern tools and platforms to build reliable, scalable software.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-black/10 bg-[linear-gradient(135deg,#EDEDED_0%,#F5F5F5_55%,#FFFFFF_100%)] px-4 py-5 shadow-[0_30px_90px_rgba(0,0,0,0.18)] md:px-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.82),_transparent_60%)]" />
            <div className="technology-marquee pointer-events-none absolute inset-y-0 left-0 w-20" />
            <div className="technology-marquee technology-marquee--right pointer-events-none absolute inset-y-0 right-0 w-20" />

            <div className="tech-marquee-track relative flex w-max min-w-full gap-4">
              {[...technologies, ...technologies].map((technology, index) => {
                return (
                  <div
                    key={`${technology.name}-${index}`}
                    className="relative overflow-hidden flex min-w-[180px] items-center gap-4 rounded-[22px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,242,242,0.92))] px-5 py-4 shadow-[0_16px_45px_rgba(0,0,0,0.14)] backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.95),_transparent_48%)]" />
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0C0C0C]/10 text-sm font-bold uppercase tracking-[0.16em] text-[#111111]">
                      {'logo' in technology ? (
                        <img
                          src={technology.logo}
                          alt={`${technology.name} logo`}
                          className="h-5 w-5 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <technology.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="relative">
                      <p className="text-lg font-semibold text-[#111111]">{technology.name}</p>
                      <p className="text-sm text-[#111111]/65">Production-ready tooling</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="why-us"
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-7xl px-5 py-20 md:px-8"
        >
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Why choose us</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">A sharper growth partner</h2>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-[linear-gradient(135deg,#EDEDED_0%,#F5F5F5_55%,#FFFFFF_100%)] px-5 py-6 shadow-[0_30px_90px_rgba(0,0,0,0.18)] md:px-6 md:py-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.82),_transparent_60%)]" />

            <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {differentiators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="relative overflow-hidden rounded-[24px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,242,242,0.92))] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.14)] backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.95),_transparent_48%)]" />
                    <div className="relative mb-4 inline-flex rounded-2xl bg-[#0C0C0C]/10 p-2 text-[#0C0C0C]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="relative text-lg font-semibold text-[#111111]">{item.title}</h3>
                    <p className="relative mt-3 text-sm leading-7 text-[#111111]/75">{item.text}</p>
                    <div className="relative mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#0C0C0C] to-[#868686]" />
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="process"
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-7xl px-5 py-20 md:px-8"
        >
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Workflow</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">How we move</h2>
            <p className="portfolio-intro mx-auto mt-4 max-w-2xl text-base md:text-lg">
              A premium product journey designed to move from strategy to polished execution with clarity and velocity.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-[linear-gradient(135deg,#EDEDED_0%,#F5F5F5_55%,#FFFFFF_100%)] px-5 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.2)] md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_transparent_60%)]" />
            <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-[#0C0C0C] via-[#868686] to-transparent md:block" />

            <div className="relative grid gap-5 md:grid-cols-2">
              {process.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.09 }}
                  whileHover={shouldReduceMotion ? undefined : { y: -8 }}
                  className={[
                    'relative overflow-hidden rounded-[24px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(240,240,240,0.9))] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.15)] backdrop-blur-sm',
                    index % 2 === 0 ? 'md:translate-y-4' : 'md:-translate-y-5 md:justify-self-end',
                  ].join(' ')}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.95),_transparent_48%)]" />
                  <div className="relative mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0C0C0C]/10 text-sm font-bold text-[#0C0C0C] ring-4 ring-white/70">
                      {index + 1}
                    </div>
                    <span className="rounded-full bg-[#0C0C0C]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111111]/80">
                      Stage {index + 1}
                    </span>
                  </div>

                  <h3 className="relative text-lg font-semibold text-[#111111]">{step.title}</h3>
                  <p className="relative mt-3 text-sm leading-7 text-[#111111]/75">{step.description}</p>
                  <div className="relative mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#0C0C0C] to-[#868686]" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="book"
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-7xl px-5 py-20 md:px-8"
        >
          <div className="panel-dark overflow-hidden rounded-[30px] border border-border/70 p-6 shadow-[0_30px_96px_rgba(0,0,0,0.25)] md:p-8">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Book a strategy call</p>
              <h2 className="mt-3 text-4xl font-bold md:text-5xl">Let's map your next move.</h2>
              <p className="cta-copy mt-3 text-lg">
                Pick a time that fits your schedule, meet with our team, and walk away with a clear action plan for your next
                product, AI, or growth move.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-accent"
                >
                  Book a Meeting
                  <CalendarDays className="h-4 w-4" />
                </a>
                <div className="cta-pill inline-flex items-center justify-center rounded-full px-4 py-3 text-sm">
                  Fast response · Clear next steps · No pressure
                </div>
              </div>
            </div>

            <div className="panel-light rounded-[24px] border border-border/70 p-5 backdrop-blur-xl">
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href="mailto:contact.fourix@gmail.com"
                  className="contact-card rounded-2xl border p-4 transition hover:border-primary/60 hover:text-primary"
                >
                  <div className="contact-label flex items-center gap-2 text-sm font-semibold">
                    <Mail className="h-4 w-4 text-primary" /> Email
                  </div>
                  <p className="contact-value mt-2 text-base">contact.fourix@gmail.com</p>
                </a>
                <a
                  href="https://maps.google.com/?q=Islamabad,Pakistan"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card rounded-2xl border p-4 transition hover:border-primary/60 hover:text-primary"
                >
                  <div className="contact-label flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-primary" /> Location
                  </div>
                  <p className="contact-value mt-2 text-base">Islamabad, Pakistan</p>
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <AnimatePresence>
        {isMobileModalOpen ? (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-5"
          >
            <button
              type="button"
              aria-label="Close modal backdrop"
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setIsMobileModalOpen(false)}
            />

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.28, ease: 'easeOut' }}
              className="panel-light relative z-10 w-full max-w-md rounded-[28px] border border-border/70 p-5 shadow-[0_32px_100px_rgba(0,0,0,0.3)] md:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">View on Mobile</p>
                  <h3 className="mt-2 text-2xl font-bold text-[#111111]">View on Mobile</h3>
                  <p className="mt-2 text-sm leading-6 text-[#111111]/75">
                    Open the active showcase for <span className="font-semibold text-[#111111]">{activeProject.title}</span> on
                    a mobile device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileModalOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-white/70 text-[#111111] transition hover:border-primary/40 hover:bg-white dark:bg-black/20"
                  aria-label="Close mobile modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mx-auto w-full max-w-[280px] rounded-[24px] border border-border/70 bg-white/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:bg-black/10">
                <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] gap-1 rounded-[18px] bg-[#111111] p-3">
                  {qrMatrix.flatMap((row, rowIndex) =>
                    row.map((cell, columnIndex) => (
                      <div
                        key={`${rowIndex}-${columnIndex}`}
                        className={cell ? 'aspect-square rounded-[2px] bg-white' : 'aspect-square rounded-[2px] bg-transparent'}
                      />
                    )),
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-[#111111]">{activeProject.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#111111]/55">{activeProject.type}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <footer className="theme-footer relative border-t">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/2.png"
                alt="Fourix logo"
                width={48}
                height={48}
                className="h-10 w-10 rounded-2xl border border-border/70 object-cover"
                loading="eager"
              />
              <span className="text-lg font-semibold tracking-tight text-foreground">Fourix</span>
            </div>
            <p className="footer-copy mt-4 max-w-md text-sm leading-7">
              Premium digital product design, web development, and AI-powered automation for fast-moving businesses.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {footerSocials.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  aria-label={item.name}
                  className="group inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <span
                    className={[
                      'inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]',
                      item.bg,
                    ].join(' ')}
                  >
                    {item.name === 'LinkedIn' ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
                        <path d="M20.447 20.452H16.893V14.87c0-1.331-.027-3.045-1.856-3.045-1.858 0-2.142 1.451-2.142 2.949v5.678H9.341V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
                      </svg>
                    ) : (
                      <img src={item.logo ?? ''} alt="" className="h-5 w-5 object-contain" loading="lazy" />
                    )}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Explore</p>
            <div className="footer-links mt-4 flex flex-col gap-3 text-sm">
              <a href="#services" className="inline-flex items-center gap-2 transition hover:text-primary">
                <Sparkles className="h-4 w-4" /> Services
              </a>
              <button type="button" onClick={handlePortfolioOpen} className="inline-flex items-center gap-2 text-left transition hover:text-primary">
                <ArrowUpRight className="h-4 w-4" /> Portfolio
              </button>
              <a href="#why-us" className="inline-flex items-center gap-2 transition hover:text-primary">
                <ShieldCheck className="h-4 w-4" /> Why Us
              </a>
              <a href="#book" className="inline-flex items-center gap-2 transition hover:text-primary">
                <Mail className="h-4 w-4" /> Contact
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Process</p>
            <div className="footer-links mt-4 flex flex-col gap-3 text-sm">
              <div className="inline-flex items-center gap-2">
                <Layers3 className="h-4 w-4" /> Discovery
              </div>
              <div className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Design
              </div>
              <div className="inline-flex items-center gap-2">
                <Workflow className="h-4 w-4" /> Development
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider border-t">
          <div className="footer-links mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-sm md:flex-row md:items-center md:justify-between md:px-8">
            <p>Copyright © 2024 Fourix AI Agency. All rights reserved.</p>
            <p className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Built for confident digital growth
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
