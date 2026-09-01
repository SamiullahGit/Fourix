'use client';

/**
 * Header and footer shared by the landing page and /faq, so the two routes
 * cannot drift apart. The markup here was lifted verbatim out of
 * app/page.tsx — nothing about it was restyled during the extraction.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CalendarDays, CircleUserRound, Menu, MessageSquare, Moon, Phone, Sun, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type RefObject } from 'react';

export const calendlyUrl = 'https://calendly.com/contact-fourix/30min';

export type NavLink = { href: string; label: string };

/** The anchors every route shows. The landing page appends its own gated ones. */
export const baseNavLinks: readonly NavLink[] = [
  { href: '#problem', label: 'The problem' },
  { href: '#what-we-do', label: 'What we do' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#book', label: 'Contact' },
];

export const footerSocials = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/1EdSgaohqx/',
    bg: 'bg-[#1877F2]',
    logo: 'https://cdn.simpleicons.org/facebook/ffffff',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/fourix-ai/',
    bg: 'bg-[#0A66C2]',
    // Local, not cdn.simpleicons.org: that CDN 404s for linkedin since the
    // brand was dropped from the set, which showed a broken-image icon.
    logo: '/logo-linkedin.svg',
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

/**
 * Hash links only resolve on the landing page, so off it they are rewritten
 * to `/#anchor` and navigate home first.
 */
function useHref() {
  const pathname = usePathname();
  return (href: string) => (href.startsWith('#') && pathname !== '/' ? `/${href}` : href);
}

/**
 * The nav is ORDERED per route, not just relabelled in a fixed slot:
 *   /      -> section anchors, then FAQ last
 *   /faq   -> Home FIRST, then the section anchors (Contact still last)
 * There is no FAQ entry on /faq — Home takes over that job, but it leads.
 * Both the desktop nav and the mobile drawer render this same list, so they
 * cannot fall out of step.
 */
function useOrderedNavLinks(navLinks: readonly NavLink[]): NavLink[] {
  const pathname = usePathname();
  return pathname === '/faq'
    ? [{ href: '/', label: 'Home' }, ...navLinks]
    : [...navLinks, { href: '/faq', label: 'FAQ' }];
}

export function SiteHeader({
  navLinks = baseNavLinks,
  heroRef,
}: {
  navLinks?: readonly NavLink[];
  /**
   * Landing page only. Without it the header is solid from the first paint,
   * which is right for any route that has no dark hero behind it.
   */
  heroRef?: RefObject<HTMLElement | null>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(!heroRef);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const resolve = useHref();
  const links = useOrderedNavLinks(navLinks);

  useEffect(() => {
    if (!heroRef) {
      setIsScrolled(true);
      return;
    }
    // Measure the real hero, not innerHeight: 100dvh, the video/poster swap
    // and mobile browser chrome all make those two disagree.
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? window.innerHeight;
      setIsScrolled(heroBottom <= 88);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroRef]);

  /* Adopt whatever THEME_SCRIPT (app/layout.tsx) already applied before
     paint, rather than re-deriving it. Nothing here WRITES data-theme on
     mount: the old effect wrote the 'dark' initial state on every mount,
     which overwrote the script's value and snapped a light-mode reader back
     to dark on every Home <-> FAQ navigation. */
  useEffect(() => {
    const applied = document.documentElement.getAttribute('data-theme');
    setTheme(applied === 'light' ? 'light' : 'dark');
  }, []);

  /* The toggle is the ONLY writer, and it writes the attribute and the stored
     choice together so the two can never disagree. */
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      window.localStorage.setItem('fourix-theme', next);
    } catch {
      // Site data blocked — the choice still applies for this page load.
    }
  };

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavOpen]);

  // Exactly the landing page's riseIn(0): y 44, duration 1, EASE_CINEMATIC.
  // Any other values would give the header a different entrance than it had.
  const riseIn = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 44 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, delay: 0, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <>
      <motion.header
        {...riseIn}
        className={[
          'site-header fixed inset-x-0 top-0 z-50',
          // Over the hero it is part of that always-dark stage; once the page
          // moves it becomes a themed surface and flips with the toggle.
          isScrolled ? 'site-header--solid' : 'site-header--over-hero',
        ].join(' ')}
      >
        <div className="mx-auto max-w-[72rem] px-5 py-4 md:px-7">
          <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
            <div className="flex items-center justify-between gap-3">
              <a href={resolve('#home')} className="flex min-w-0 items-center gap-3">
                <Image
                  src="/Iccon.png"
                  alt="Fourix logo"
                  width={64}
                  height={64}
                  className="h-11 w-11 shrink-0 rounded-2xl border border-white/15 object-cover sm:h-[3.25rem] sm:w-[3.25rem]"
                  loading="eager"
                  priority
                />
                <span className="fourix-wordmark fourix-wordmark--lg" aria-label="Fourix">
                  <Image src="/fourix-wordmark.png" alt="" width={660} height={230} className="fourix-wordmark__image" priority />
                </span>
              </a>

              <div className="flex items-center gap-2 sm:gap-2.5 md:hidden">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="theme-toggle h-9 w-9"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-pill h-9 px-4 text-[0.8rem]"
                >
                  Book
                </a>

                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen((current) => !current)}
                  className="theme-toggle h-9 w-9"
                  aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={isMobileNavOpen}
                >
                  {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <nav className="nav-links hidden items-center justify-center gap-1 text-sm md:flex">
              {links.map((link) => (
                <a key={link.href} href={resolve(link.href)} className="whitespace-nowrap">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center justify-end gap-3 md:flex">
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle h-10 w-10"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <a href={calendlyUrl} target="_blank" rel="noreferrer" className="cta-pill h-10 px-5 text-sm">
                Book a meeting
              </a>
            </div>
          </div>
        </div>
      </motion.header>

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
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col border-l px-6 py-6 shadow-[-20px_0_60px_rgba(0,0,0,0.28)]" style={{ background: 'var(--bg)' }}
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="section-eyebrow uppercase tracking-[0.2em]">Menu</p>
                  <p className="mt-2 text-lg font-medium">Navigate Fourix</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="theme-toggle h-10 w-10"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-3 text-base">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={resolve(link.href)}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="nav-drawer-link inline-flex items-center justify-between rounded-2xl border px-4 py-3"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ))}
              </nav>

              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMobileNavOpen(false)}
                className="cta-pill mt-auto h-11 px-4 text-sm"
              >
                Book a meeting
              </a>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function SiteFooter({ navLinks = baseNavLinks }: { navLinks?: readonly NavLink[] }) {
  const resolve = useHref();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer relative">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/Iccon.png"
              alt="Fourix logo"
              width={48}
              height={48}
              className="h-10 w-10 rounded-2xl border object-cover"
              loading="eager"
            />
            <span className="section-display text-lg font-medium">Fourix</span>
          </div>
          <p className="footer-copy mt-4 max-w-md text-sm leading-7">
            AI automation for service businesses. We recover missed calls and messages, cut no-shows, and follow up on
            every inquiry — on the tools you already use.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {footerSocials.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                aria-label={item.name}
                className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition hover:-translate-y-1"
              >
                <span
                  className={[
                    'inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]',
                    item.bg,
                  ].join(' ')}
                >
                  <img src={item.logo} alt="" className="h-5 w-5 object-contain" loading="lazy" />
                </span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-heading text-xs font-medium uppercase tracking-[0.2em]">Explore</p>
          <nav className="footer-links mt-4 flex flex-col gap-3 text-sm">
            {navLinks.map((link) => (
              <a key={link.href} href={resolve(link.href)} className="inline-flex items-center gap-2 transition">
                <ArrowUpRight className="h-4 w-4" /> {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="footer-heading text-xs font-medium uppercase tracking-[0.2em]">What we automate</p>
          <div className="footer-copy mt-4 flex flex-col gap-3 text-sm">
            <div className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Missed calls &amp; messages
            </div>
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Appointment reminders
            </div>
            <div className="inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Inquiry follow-up
            </div>
          </div>
        </div>
      </div>

      <div className="footer-divider border-t">
        <div className="footer-copy mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-sm md:flex-row md:items-center md:justify-between md:px-8">
          <p>Copyright © {currentYear} Fourix. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <CircleUserRound className="h-4 w-4" /> AI automation for service businesses
          </p>
        </div>
      </div>
    </footer>
  );
}
