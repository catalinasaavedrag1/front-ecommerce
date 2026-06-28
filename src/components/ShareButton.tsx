import { useState } from 'react'
import Icon from './Icon'

interface Props {
  title: string
  text?: string
  className?: string
  /** Mensaje opcional para WhatsApp (si no, usa text + url). */
  whatsappText?: string
}

/** Compartir vía Web Share API nativa, con fallback a copiar enlace / WhatsApp. */
export default function ShareButton({ title, text, className, whatsappText }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text, url }) } catch { /* cancelado */ }
    } else {
      setOpen((v) => !v)
    }
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* ignore */ }
  }
  const wa = `https://wa.me/?text=${encodeURIComponent(`${whatsappText ?? text ?? title} ${url}`)}`
  const mail = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text ?? ''} ${url}`)}`

  return (
    <div className="share">
      <button className={`sharebtn ${className ?? ''}`} onClick={nativeShare} aria-label="Compartir producto" aria-haspopup="menu">
        <Icon name="share" />
      </button>
      {open && (
        <>
          <div className="share__backdrop" onClick={() => setOpen(false)} />
          <div className="share__menu" role="menu">
            <a className="share__opt" href={wa} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}><Icon name="whatsapp" /> WhatsApp</a>
            <a className="share__opt" href={mail} onClick={() => setOpen(false)}><Icon name="mail" /> Correo</a>
            <button className="share__opt" onClick={copy}><Icon name={copied ? 'check' : 'doc'} /> {copied ? 'Enlace copiado' : 'Copiar enlace'}</button>
          </div>
        </>
      )}
    </div>
  )
}
