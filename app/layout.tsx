import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import FourixAgentLoader from '@/components/fourix-agent-loader'
import './globals.css'

// Variable Manrope, self-hosted at build time by next/font — no runtime
// request to Google and no font-swap layout shift.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'Fourix — AI automation for service businesses',
  description:
    'Fourix builds AI automation for service businesses: missed-call and after-hours booking recovery, automatic reminders that cut no-shows, and follow-up on every new inquiry.',
}

/**
 * Runs before first paint on every full page load — and every Home <-> FAQ
 * move is a full load, since those are plain anchors. Reads the stored
 * choice, falls back to the OS preference only when nothing is stored, and
 * writes data-theme onto <html>. Wrapped in try/catch so a browser with site
 * data blocked still renders (it just keeps the server's dark default).
 */
const THEME_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem('fourix-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}d.setAttribute('data-theme',t);}catch(e){}})();`

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f1ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    /*
     * data-theme is the single source of truth for every colour on the site.
     * The server always emits "dark"; THEME_SCRIPT below corrects it from the
     * stored choice before the browser paints anything, so a light-mode
     * reader never sees a dark frame. suppressHydrationWarning is required
     * because that script mutates the attribute before React hydrates.
     */
    <html lang="en" data-theme="dark" suppressHydrationWarning className={manrope.variable}>
      <body className="antialiased">
        {/*
         * First thing in the body, inline and synchronous: the browser runs it
         * while parsing, before any content is laid out. `next/script` with
         * beforeInteractive is the wrong tool here — it is for external src
         * scripts and explicitly does not block paint or hydration.
         */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {children}
        <FourixAgentLoader />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
