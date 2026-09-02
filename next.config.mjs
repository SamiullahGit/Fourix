/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Was true. The request-validation logic in app/api/chat/route.ts is
    // TypeScript, so a type error there could have shipped silently.
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Nothing on the site uses these APIs; denying them costs nothing.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          /* No Strict-Transport-Security here on purpose: Vercel already
             sends `max-age=63072000; includeSubDomains; preload` on the live
             response (verified). Re-declaring it risks overriding that with
             something weaker. */
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' https://calendly.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com;",
          },
        ],
      },
    ]
  },
}

export default nextConfig
