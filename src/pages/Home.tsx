import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { artists, brand, contacts, credit, reels, services, works } from '../content'
import { packs, type SoundPack } from '../sound/packs'
import { useSound } from '../sound/useSound'
import './Home.css'

const pad = (n: number) => String(n).padStart(2, '0')

function ReelMark({ className }: { className?: string }) {
  return <img className={className} src={brand.markSrc} alt="" width={320} height={177} />
}

function Timecode() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = performance.now()
    const id = window.setInterval(() => {
      const f = Math.floor((performance.now() - start) / (1000 / 24))
      const s = Math.floor(f / 24)
      if (ref.current) {
        ref.current.textContent = `00:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`
      }
    }, 1000 / 24)
    return () => window.clearInterval(id)
  }, [])

  return <span ref={ref}>00:00:00:00</span>
}

function Lightbox({
  index,
  onClose,
  onStep,
}: {
  index: number | null
  onClose: () => void
  onStep: (dir: 1 | -1) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const work = index === null ? null : works[index]
  const dismiss = () => ref.current?.close()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (index !== null && !dialog.open) {
      dialog.showModal()
      dialog.querySelector<HTMLButtonElement>('[data-close]')?.focus()
    }
    if (index === null && dialog.open) dialog.close()
  }, [index])

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={work ? `${work.title}, ${credit(work)}` : 'Video player'}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && dismiss()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onStep(1)
        if (e.key === 'ArrowLeft') onStep(-1)
      }}
    >
      {work && index !== null && (
        <figure className="lightbox__figure">
          <div className="lightbox__screen">
            <iframe
              key={work.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${work.youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title={`${work.title} by ${credit(work)}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
          <figcaption className="lightbox__meta">
            <span className="lightbox__count">
              Frame {pad(index + 1)} / {pad(works.length)}
            </span>
            <strong>{work.title}</strong>
            <span>
              {credit(work)}
              {work.label && ` · ${work.label}`}
            </span>
            <a href={`https://www.youtube.com/watch?v=${work.youtubeId}`} target="_blank" rel="noreferrer">
              Watch on YouTube ↗
            </a>
          </figcaption>
          <div className="lightbox__nav">
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous frame">
              ←
            </button>
            <button type="button" onClick={() => onStep(1)} aria-label="Next frame">
              →
            </button>
            <button type="button" onClick={dismiss} aria-label="Close viewer" data-close>
              ✕
            </button>
          </div>
        </figure>
      )}
    </dialog>
  )
}

function SoundToggle({ on, onToggle, className = '' }: { on: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={`sound${on ? ' is-on' : ''} ${className}`}
      aria-pressed={on}
      onClick={onToggle}
    >
      <span className="sound__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      Sound {on ? 'on' : 'off'}
    </button>
  )
}

function SoundDemoBar({ current, on, onToggle }: { current: SoundPack; on: boolean; onToggle: () => void }) {
  return (
    <aside className="demo" aria-label="Sound demo">
      <div className="demo__head">
        <span className="demo__label">Sound demo</span>
        <SoundToggle on={on} onToggle={onToggle} className="demo__toggle" />
      </div>
      <nav className="demo__links" aria-label="Sound variants">
        {packs.map((p, i) => (
          <Link key={p.id} to={`/sound/${p.id}`} aria-current={p.id === current.id ? 'page' : undefined}>
            {pad(i + 1)} {p.name}
          </Link>
        ))}
        <Link to="/">Silent</Link>
      </nav>
      <p className="demo__pitch">{current.pitch}</p>
    </aside>
  )
}

export default function Home({ pack }: { pack?: SoundPack }) {
  const bookRef = useRef<HTMLElement>(null)
  const [solidNav, setSolidNav] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [bookInView, setBookInView] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [flashKey, setFlashKey] = useState(0)
  const sound = useSound(pack)
  const strip = [...works, ...works]

  const toggleSound = () => {
    if (sound.toggle() && pack) window.setTimeout(() => setFlashKey((k) => k + 1), pack.flashDelay)
  }
  const hover = (e: PointerEvent) => e.pointerType === 'mouse' && sound.play('hover')
  const confirm = () => sound.play('confirm')

  useEffect(() => {
    const onScroll = () => {
      setSolidNav(window.scrollY > 24)
      setPastHero(window.scrollY > window.innerHeight * 0.8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = bookRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setBookInView(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const step = (dir: 1 | -1) => {
    sound.play('step')
    setOpen((i) => (i === null ? i : (i + dir + works.length) % works.length))
  }
  const closeViewer = () => {
    sound.play('close')
    setOpen(null)
  }

  return (
    <div className="page">
      <a className="skip" href="#work">
        Skip to work
      </a>

      <nav className={`nav${solidNav ? ' is-solid' : ''}`} aria-label="Primary">
        <a className="nav__brand" href="#top" aria-label={`${brand.legalName}, back to top`}>
          <ReelMark className="nav__reel" />
          <span>{brand.name}</span>
        </a>
        <div className="nav__links">
          {sound.available && <SoundToggle on={sound.on} onToggle={toggleSound} />}
          <a href="#work">Work</a>
          <a href="#reels">Reels</a>
          <a href="#services">Services</a>
          <a className="nav__book" href="#book">
            Book
          </a>
        </div>
      </nav>

      <header className="hero" id="top">
        <img className="hero__img" src={brand.heroStill} alt="" fetchPriority="high" />
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__flash" key={flashKey} aria-hidden="true" />

        <div className="hero__finder" aria-hidden="true">
          <span className="hero__corner hero__corner--tl" />
          <span className="hero__corner hero__corner--tr" />
          <span className="hero__corner hero__corner--bl" />
          <span className="hero__corner hero__corner--br" />
          <span className="hero__rec">
            <i /> REC <Timecode />
          </span>
          <span className="hero__exposure">ISO 3200 · 1/50 · ƒ1.8 · 4K 24P</span>
          <span className="hero__cross" />
        </div>

        <div className="hero__body">
          <div>
            <p className="hero__headline">{brand.headline}</p>
            <p className="hero__lede">{brand.lede}</p>
          </div>
          <div className="hero__cta">
            <a
              className="btn btn--flash"
              href={contacts.founder.whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={confirm}
            >
              Book on WhatsApp
            </a>
            <a className="btn btn--line" href="#work">
              See the work
            </a>
          </div>
        </div>

        <h1 className="hero__mark" aria-label={brand.legalName}>
          {brand.name.toUpperCase().split('').map((ch, i) => (
            <span key={i} style={{ ['--i' as string]: i }} aria-hidden="true">
              {ch}
            </span>
          ))}
        </h1>
      </header>

      <div className="strip" aria-hidden="true">
        <div className="strip__track">
          {strip.map((w, i) => (
            <span key={`${w.title}-${i}`}>
              <b>{pad((i % works.length) + 1)}A</b> {w.title}
            </span>
          ))}
        </div>
      </div>

      <main>
        <section className="section" id="work" aria-labelledby="work-title">
          <div className="section__head">
            <h2 className="section__title" id="work-title">
              Selected cuts
            </h2>
            <p className="section__note">
              Music videos for {artists.slice(0, -1).join(', ')} and {artists.at(-1)}. Tap a frame to watch it here.
            </p>
          </div>

          <div className="sheet">
            <ul className="sheet__grid">
              {works.map((w, i) => (
                <li key={w.title}>
                  <button
                    type="button"
                    className="frame"
                    onClick={() => {
                      sound.play('open')
                      setOpen(i)
                    }}
                    onPointerEnter={hover}
                    aria-label={`Play ${w.title} by ${credit(w)}`}
                  >
                    <span className="frame__edge" aria-hidden="true">
                      <span>APPLETOE 3200</span>
                      <span>▸ {pad(i + 1)}A</span>
                    </span>
                    <span className="frame__img">
                      <img src={w.still} alt="" loading="lazy" style={{ objectPosition: w.focus }} />
                      <span className="frame__play" aria-hidden="true">
                        ▶ Play
                      </span>
                      <svg className="frame__pick" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <path
                          pathLength={1}
                          d="M6 4C30 2 72 3 96 5c1 28-1 62 0 91-26 1-62 0-91-1C3 70 4 34 3 7l9-4"
                        />
                      </svg>
                    </span>
                    <span className="frame__title">{w.title}</span>
                    <span className="frame__credit">
                      {credit(w)}
                      {w.label && <em> · {w.label}</em>}
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <a className="frame frame--blank" href="#book" onPointerEnter={hover}>
                  <span className="frame__edge" aria-hidden="true">
                    <span>APPLETOE 3200</span>
                    <span>▸ {pad(works.length + 1)}A</span>
                  </span>
                  <span className="frame__img frame__img--blank">
                    <span>Unexposed</span>
                  </span>
                  <span className="frame__title">Your track</span>
                  <span className="frame__credit">Book the next frame →</span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="section" id="reels" aria-labelledby="reels-title">
          <div className="section__head">
            <h2 className="section__title" id="reels-title">
              Made for the feed
            </h2>
            <p className="section__note">
              Vertical cuts for brands and creators, from Free Fire India to Taraano Ka Zikr. They play right here.
            </p>
          </div>

          <ul className="reels">
            {reels.map((r, i) => (
              <li key={r.id} className="reel">
                <span className="reel__edge">
                  <span>Reel {pad(i + 1)}</span>
                  <a href={r.href} target="_blank" rel="noreferrer">
                    {r.account} ↗
                  </a>
                </span>
                <div className="reel__screen">
                  <iframe src={r.embed} title={`Instagram reel for ${r.client}`} loading="lazy" scrolling="no" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" id="services" aria-labelledby="services-title">
          <div className="section__head">
            <h2 className="section__title" id="services-title">
              {brand.motto}
            </h2>
            <p className="section__note">Five formats, one desk. Pick one and it opens a WhatsApp thread with the details filled in.</p>
          </div>

          <ul className="rows">
            {services.map((s) => (
              <li key={s.title}>
                <a
                  className="svc"
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  onPointerEnter={hover}
                  onClick={confirm}
                >
                  <span className="svc__title">{s.title}</span>
                  <span className="svc__body">{s.body}</span>
                  <span className="svc__formats">{s.formats}</span>
                  <span className="svc__go" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="section section--book" id="book" ref={bookRef} aria-labelledby="book-title">
          <div className="section__head">
            <h2 className="section__title" id="book-title">
              Hit the desk tonight
            </h2>
            <p className="section__note">Drop artist, city, and format. Yes or no, same day.</p>
          </div>

          <ul className="rows">
            <li>
              <a className="desk" onPointerEnter={hover} onClick={confirm} href={contacts.founder.whatsappHref} target="_blank" rel="noreferrer">
                <span className="desk__label">WhatsApp Shashwat</span>
                <span className="desk__hint">Fastest · shoots and reels</span>
                <span className="desk__go" aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a className="desk" onPointerEnter={hover} onClick={confirm} href={contacts.founder.instagramHref} target="_blank" rel="noreferrer">
                <span className="desk__label">DM {contacts.founder.instagram}</span>
                <span className="desk__hint">Send references · keep it visual</span>
                <span className="desk__go" aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a className="desk" onPointerEnter={hover} onClick={confirm} href={contacts.studio.instagramHref} target="_blank" rel="noreferrer">
                <span className="desk__label">Studio line</span>
                <span className="desk__hint">Music videos · podcasts · short films</span>
                <span className="desk__go" aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>

          <div className="cards">
            {[contacts.founder, contacts.studio].map((c) => (
              <address key={c.name} className="card">
                <strong>{c.name}</strong>
                <span className="card__role">{c.role}</span>
                <a href={c.phoneHref}>{c.phone}</a>
                <a href={c.emailHref}>{c.email}</a>
                <a href={c.instagramHref} target="_blank" rel="noreferrer">
                  {c.instagram}
                </a>
              </address>
            ))}
          </div>
        </section>
      </main>

      <footer className="foot">
        <img className="foot__mark" src={brand.markLineSrc} alt="" width={806} height={435} loading="lazy" />
        <div className="foot__row">
          <span>{brand.legalName}</span>
          <span>{brand.motto}</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>

      <div className={`dock${pastHero && !bookInView ? ' is-on' : ''}`} inert={!pastHero || bookInView}>
        <a className="btn btn--flash" href={contacts.founder.whatsappHref} target="_blank" rel="noreferrer" onClick={confirm}>
          Book on WhatsApp
        </a>
      </div>

      <Lightbox index={open} onClose={closeViewer} onStep={step} />

      {pack && <SoundDemoBar current={pack} on={sound.on} onToggle={toggleSound} />}
    </div>
  )
}
