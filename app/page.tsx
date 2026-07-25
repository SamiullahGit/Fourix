'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Globe,
  Layers3,
  Link,
  Mail,
  MonitorSmartphone,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

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
];

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
];

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
];

const calendlyUrl = 'https://calendly.com/fourix/strategy-call';

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

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen overflow-x-hidden text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-80 w-80 rounded-full bg-[#868686]/30 blur-3xl" />
        <div className="absolute right-[-8%] top-[12%] h-96 w-96 rounded-full bg-[#4D4D4D]/35 blur-3xl" />
        <div className="absolute bottom-[-8%] left-[18%] h-80 w-80 rounded-full bg-[#0C0C0C]/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_45%)]" />
      </div>

      <header className="panel-dark sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#home" className="flex items-center gap-3">
            <Image
              src="/2.png"
              alt="Fourix logo"
              width={48}
              height={48}
              className="h-10 w-10 rounded-2xl border border-border/70 object-cover"
              loading="eager"
              priority
            />
            <span className="text-lg font-semibold tracking-tight text-foreground">Fourix</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#services" className="transition hover:text-primary">Services</a>
            <a href="#why-us" className="transition hover:text-primary">Why Us</a>
            <a href="#process" className="transition hover:text-primary">Process</a>
            <a href="#book" className="transition hover:text-primary">Contact</a>
          </nav>

          <a
            href={calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="panel-dark rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02]"
          >
            Book a Meeting
          </a>
        </div>
      </header>

      <main id="home" className="relative">
        <section className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-5 pt-10 md:px-8 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={shouldReduceMotion ? false : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'visible'}
              variants={fadeUp}
              custom={0}
              className="max-w-2xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Premium AI & Digital Growth Studio
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-none tracking-tight text-white md:text-6xl lg:text-7xl">
                Build the next
                <span className="block bg-gradient-to-r from-white via-[#D5D5D5] to-white bg-clip-text text-transparent">
                  premium digital brand.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
                We help ambitious companies launch faster, convert smarter, and automate better with modern web experiences, polished product apps, and AI systems designed for growth.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15"
                >
                  View Services
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 text-sm text-white/80">
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Fast deployments</div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2">AI-first workflows</div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Conversion-focused UX</div>
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
                      <h2 className="mt-2 text-2xl font-bold">Launch in motion</h2>
                    </div>
                    <div className="rounded-full bg-[#0C0C0C]/25 p-2 text-[#0C0C0C]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-secondary/50 p-4">
                      <p className="text-xs text-[#111111]/70">Traffic quality</p>
                      <p className="mt-2 text-3xl font-bold">+94%</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-secondary/50 p-4">
                      <p className="text-xs text-[#111111]/70">Automation lift</p>
                      <p className="mt-2 text-3xl font-bold">3.2x</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-secondary/50 p-4 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#111111]/70">Delivery momentum</p>
                        <span className="rounded-full bg-[#0C0C0C]/15 px-2.5 py-1 text-xs font-semibold text-[#0C0C0C]">On track</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-primary to-accent" />
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
          className="mx-auto max-w-6xl px-5 py-20 md:px-8"
        >
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Services</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">What we build</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
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
                  className="panel-light group rounded-[24px] border border-black/10 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-[#0C0C0C]/15 p-3 text-[#0C0C0C] transition group-hover:scale-110 group-hover:bg-[#0C0C0C]/25">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#111111]/75">{service.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Explore solution <ArrowUpRight className="h-4 w-4" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          id="why-us"
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-6xl px-5 py-20 md:px-8"
        >
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Why choose us</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">A sharper growth partner</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="panel-light rounded-[24px] border border-border/70 p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-[#0C0C0C]/15 p-2 text-[#0C0C0C]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#111111]/75">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          id="process"
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-6xl px-5 py-20 md:px-8"
        >
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Workflow</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">How we move</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#111111]/75 md:text-lg">
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
          className="mx-auto max-w-6xl px-5 py-20 md:px-8"
        >
          <div className="panel-dark overflow-hidden rounded-[30px] border border-border/70 p-6 shadow-[0_30px_96px_rgba(0,0,0,0.25)] md:p-8">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Book a strategy call</p>
              <h2 className="mt-3 text-4xl font-bold md:text-5xl">Let's map your next move.</h2>
              <p className="mt-3 text-lg text-white/80">
                Pick a time that fits your schedule, meet with our team, and walk away with a clear action plan for your next product, AI, or growth move.
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
                <div className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/80">
                  Fast response · Clear next steps · No pressure
                </div>
              </div>
            </div>

            <div className="panel-light rounded-[24px] border border-border/70 p-5 backdrop-blur-xl">
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href="mailto:hello@fourix.ai"
                  className="rounded-2xl border border-border/70 bg-secondary/50 p-3 transition hover:border-primary/60 hover:text-primary"
                >
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0C0C0C]">
                    <Mail className="h-4 w-4 text-primary" /> Email
                  </div>
                  <p className="mt-2 text-sm text-[#111111]/75">hello@fourix.ai</p>
                </a>
                <a
                  href="tel:+15551234567"
                  className="rounded-2xl border border-border/70 bg-secondary/50 p-3 transition hover:border-primary/60 hover:text-primary"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Phone className="h-4 w-4 text-primary" /> Phone
                  </div>
                  <p className="mt-2 text-sm text-[#111111]/75">+1 (555) 123-4567</p>
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="relative border-t border-white/10 bg-[linear-gradient(135deg,#050505_0%,#0B0B0B_55%,#141414_100%)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-8">
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
            <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
              Premium digital product design, web development, and AI-powered automation for fast-moving businesses.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Connect</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <a href="https://fourix.ai" className="inline-flex items-center gap-2 transition hover:text-primary">
                <Globe className="h-4 w-4" /> Website
              </a>
              <a href="https://linkedin.com" className="inline-flex items-center gap-2 transition hover:text-primary">
                <Link className="h-4 w-4" /> LinkedIn
              </a>
              <a href="#services" className="inline-flex items-center gap-2 transition hover:text-primary">
                <Sparkles className="h-4 w-4" /> Services
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Process</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <div className="inline-flex items-center gap-2"><Layers3 className="h-4 w-4" /> Discovery</div>
              <div className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Design</div>
              <div className="inline-flex items-center gap-2"><Workflow className="h-4 w-4" /> Development</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-4 text-sm text-white/70 md:flex-row md:items-center md:justify-between md:px-8">
            <p>Copyright © 2024 Fourix AI Agency. All rights reserved.</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Built for confident digital growth</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
