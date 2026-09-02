'use client'

import { ArrowUpRight, Eye, EyeOff, Send, Square, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { calendlyUrl } from './site-chrome'

type Message = { role: 'user' | 'assistant'; content: string }
const greeting = "Hey, I'm the Fourix Agent. I help service businesses turn missed calls and quiet inboxes into booked customers. What are you trying to improve?"
const legacyNudgeMessages = [
  'Feeling stuck? Talk here.',
  'Need a quick idea?',
  "Quiet inbox? Let's fix.",
  'I’m here when you’re ready to make things easier.',
  'Fourix Agent checking in.',
  'One question. Big momentum.',
  'Need a hand? I’m just a message away.',
]

const nudgeMessages = [
  'Fourix Agent reporting, sir.',
  'Feeling stuck? Talk here.',
  'Need a quick idea?',
  "Quiet inbox? Let's fix.",
  'Fourix Agent checking in.',
  'Ready when you are.',
  'Need a hand?',
] as const

const nudgeDirections = ['left', 'top'] as const

export default function FourixAgent() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: greeting }])
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState('')
  const [transparentPanel, setTransparentPanel] = useState(false)
  const [nudgeIndex, setNudgeIndex] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const nudgeDirection = nudgeIndex === null ? null : nudgeDirections[nudgeIndex % nudgeDirections.length]

  useEffect(() => {
    if (open) inputRef.current?.focus()
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [open, messages, typing])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  useEffect(() => () => abortControllerRef.current?.abort(), [])

  function stopResponse() {
    abortControllerRef.current?.abort()
  }

  useEffect(() => {
    if (open) {
      setNudgeIndex(null)
      return
    }

    let hideTimer: number | undefined
    let nextTimer: number | undefined

    const showNudge = (index: number) => {
      setNudgeIndex(index)
      hideTimer = window.setTimeout(() => {
        setNudgeIndex(null)
        nextTimer = window.setTimeout(() => showNudge((index + 1) % nudgeMessages.length), 2600)
      }, 5000)
    }

    const initialTimer = window.setTimeout(() => showNudge(0), 3500)
    return () => {
      window.clearTimeout(initialTimer)
      if (hideTimer) window.clearTimeout(hideTimer)
      if (nextTimer) window.clearTimeout(nextTimer)
    }
  }, [open])

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault()
    const content = message.trim()
    if (!content || typing || content.length > 1200) return
    setMessage('')
    setError('')
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setTyping(true)
    const controller = new AbortController()
    abortControllerRef.current = controller
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: content, history: messages.slice(-8) }), signal: controller.signal })
      const data = await response.json()
      if (!response.ok || typeof data.reply !== 'string') {
        throw new Error(typeof data.error === 'string' ? data.error : 'chat failed')
      }
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch (cause) {
      if (cause instanceof Error && cause.name === 'AbortError') return
      setError(cause instanceof Error && cause.message !== 'chat failed' ? cause.message : 'The agent is taking a quick reset. You can try again, book a call below, or visit the FAQ for answers to common questions.')
    } finally {
      if (abortControllerRef.current === controller) abortControllerRef.current = null
      setTyping(false)
    }
  }

  return (
    <div className="fourix-agent" data-open={open}>
      {open ? (
          <section id="fourix-agent-dialog" className={`fourix-agent__panel${transparentPanel ? ' fourix-agent__panel--transparent' : ''}`} role="dialog" aria-modal="false" aria-labelledby="fourix-agent-title">
          <header className="fourix-agent__header">
            <div className="fourix-agent__identity">
              <Image src="/Iccon.png" alt="" width={48} height={48} className="fourix-agent__mark" />
              <div><strong id="fourix-agent-title">Fourix Agent</strong><span>AI assistant</span></div>
            </div>
            <div className="fourix-agent__header-actions">
              <button type="button" className="fourix-agent__close" onClick={() => setTransparentPanel((value) => !value)} aria-label={transparentPanel ? 'Use solid chat panel' : 'Make chat panel transparent'} title={transparentPanel ? 'Use solid chat panel' : 'Make chat panel transparent'}>{transparentPanel ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              <button type="button" className="fourix-agent__close" onClick={() => setOpen(false)} aria-label="Close Fourix Agent"><X size={18} /></button>
            </div>
          </header>
          <div className="fourix-agent__body" aria-live="polite">
            <div className="fourix-agent__status">ONLINE <span /></div>
            {messages.map((item, index) => <div className={`fourix-agent__bubble fourix-agent__bubble--${item.role}`} key={`${item.role}-${index}`}>{item.content}</div>)}
            {typing ? <div className="fourix-agent__typing" aria-label="Fourix Agent is typing"><i /><i /><i /></div> : null}
            {error ? <div className="fourix-agent__error">{error}</div> : null}
            <div ref={endRef} />
          </div>
          <a className="fourix-agent__calendly" href={calendlyUrl} target="_blank" rel="noreferrer">Book a meeting <ArrowUpRight size={15} /></a>
          <form className="fourix-agent__composer" onSubmit={sendMessage}>
            <textarea ref={inputRef} value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage() } }} placeholder="Ask about Fourix..." rows={1} maxLength={1200} aria-label="Message Fourix Agent" />
            <button type={typing ? 'button' : 'submit'} onClick={typing ? stopResponse : undefined} disabled={!typing && !message.trim()} aria-label={typing ? 'Stop response' : 'Send message'} title={typing ? 'Stop response' : 'Send message'}>{typing ? <Square size={14} fill="currentColor" /> : <Send size={17} />}</button>
          </form>
          <p className="fourix-agent__note">Fourix Agent can make mistakes. No sensitive info, please.</p>
        </section>
      ) : null}
      {!open && nudgeIndex !== null && nudgeDirection ? <div id="fourix-agent-nudge" className={`fourix-agent__nudge fourix-agent__nudge--${nudgeDirection}`} role="status" aria-live="polite"><svg className="fourix-agent__thought-cloud" viewBox="0 0 180 100" preserveAspectRatio="none" aria-hidden="true"><path d="M28 28C25 17 36 8 48 12C55 1 70 2 77 12C87 2 103 5 106 16C119 10 132 17 131 29C146 28 154 39 149 49C159 59 151 73 139 73C136 87 119 92 108 82C98 94 80 91 76 80C63 87 48 81 48 69C34 74 21 65 25 54C12 48 15 33 28 28Z" /></svg><span className="fourix-agent__thought-text">{nudgeMessages[nudgeIndex]}</span></div> : null}
      <button type="button" className="fourix-agent__bubble-button" data-nudge-active={!open && nudgeIndex !== null} data-nudge-direction={nudgeDirection ?? 'idle'} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="fourix-agent-dialog" aria-describedby={!open && nudgeIndex !== null ? 'fourix-agent-nudge' : undefined} aria-label={open ? 'Close Fourix Agent' : 'Open Fourix Agent'}>
        {open ? <X size={24} /> : <span className="fourix-agent__icon-stage" aria-hidden="true">
          <Image src="/Iccon.png" alt="" width={56} height={56} className="fourix-agent__brand-icon" loading="eager" />
          <Image src={nudgeDirection === 'top' ? '/robot_blink_hand_up.gif' : '/robot_blink_hand_left.gif'} alt="" width={64} height={64} className={`fourix-agent__nudge-icon fourix-agent__nudge-icon--${nudgeDirection ?? 'idle'}`} />
          <span className="fourix-agent__pulse" />
        </span>}
      </button>
    </div>
  )
}
