import { useEffect, useRef, useState } from 'react'
import { brand, contacts, quotes, services, works } from '../content'
import './Home.css'

function FilmReelMark({ burst, onSpin }: { burst: boolean; onSpin: () => void }) {
  return (
    <button type="button" className={`home-mascot${burst ? ' is-burst' : ''}`} aria-label="Spin the reel" onClick={onSpin}>
      <svg className="home-mascot__svg" viewBox="0 0 120 120" fill="none">
        <circle className="home-mascot__body" cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="6" />
        <circle className="home-mascot__hub" cx="60" cy="60" r="12" fill="currentColor" />
        <circle cx="60" cy="38" r="7" fill="#0a0f1a" />
        <circle cx="60" cy="82" r="7" fill="#0a0f1a" />
        <circle cx="38" cy="60" r="7" fill="#0a0f1a" />
        <circle cx="82" cy="60" r="7" fill="#0a0f1a" />
        <path
          className="home-mascot__strip"
          d="M94 48c18-6 26-2 30 10"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const [burst, setBurst] = useState(false)
  const [dock, setDock] = useState(false)
  const [accent, setAccent] = useState<'coral' | 'cyan'>('coral')
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const loop = [...quotes, ...quotes]
  const loopB = [...works, ...works]

  useReveal()

  useEffect(() => {
    const onScroll = () => setDock(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  const spinReel = () => {
    setBurst(true)
    window.setTimeout(() => setBurst(false), 900)
  }

  return (
    <div className={`home home--${accent}`}>
      <div className="home-stars" aria-hidden="true" />
      <div className="home-glow" aria-hidden="true" />

      <nav className="home-nav" data-reveal>
        <a className="home-nav__brand" href="#top">
          <img src={brand.logoSrc} alt={brand.name} />
        </a>
        <div className="home-nav__links">
          <a href="#offer">Craft</a>
          <a href="#work">Reel</a>
          <a href="#book">Book</a>
        </div>
      </nav>

      <header className="home-hero" id="top" ref={heroRef}>
        <img className="home-hero__bg" src={brand.heroStill} alt="" />
        <div className="home-hero__veil" />
        <div className="home-hero__beam" aria-hidden="true" />

        <div className="home-hero__copy">
          <FilmReelMark burst={burst} onSpin={spinReel} />
          <p className="home-eyebrow">{brand.legalName}</p>
          <h1 className="home-headline">
            <span className="home-headline__grad">{brand.headline}</span>
          </h1>
          <p className="home-lede">{brand.tagline}</p>
          <div className="home-cta">
            <a className="home-btn home-btn--solid" href={contacts.founder.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp Shashwat
            </a>
            <a className="home-btn home-btn--ghost" href="#work">
              Scroll the reel
            </a>
          </div>
          <p className="home-scroll" aria-hidden="true">
            Scroll
          </p>
        </div>
      </header>

      <main>
        <section className="home-strip" aria-hidden="true">
          <div className="home-strip__track">
            {loopB.map((w, i) => (
              <span key={`${w.title}-${i}`}>{w.title}</span>
            ))}
          </div>
        </section>

        <section className="home-section" id="offer" data-reveal>
          <p className="home-kicker">01 — Craft</p>
          <h2 className="home-title">What the night books</h2>
          <ul className="home-features">
            {services.map((s, i) => (
              <li key={s.title} className="home-feature" style={{ ['--i' as string]: i }}>
                <span className="home-feature__n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section home-section--flush" id="work" data-reveal>
          <div className="home-section__pad">
            <p className="home-kicker">02 — Reel</p>
            <h2 className="home-title">Selected cuts</h2>
          </div>
          <ul className="home-work">
            {works.map((w, i) => (
              <li key={w.title} style={{ ['--i' as string]: i }}>
                <a className="home-shot" href={contacts.founder.instagramHref} target="_blank" rel="noreferrer">
                  <img src={w.still} alt="" loading="lazy" />
                  <span className="home-shot__flash" aria-hidden="true" />
                  <span className="home-shot__meta">
                    <strong>{w.title}</strong>
                    <em>{w.credit}</em>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-marquee" data-reveal aria-label="Signals">
          <p className="home-kicker home-section__pad">03 — Signal</p>
          <h2 className="home-title home-section__pad">Out of the group chat</h2>
          <div className="home-marquee__viewport">
            <div className="home-marquee__track">
              {loop.map((q, i) => (
                <blockquote key={`${q.who}-${i}`} className="home-quote">
                  <p>“{q.text}”</p>
                  <cite>{q.who}</cite>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section" id="book" data-reveal>
          <p className="home-kicker">04 — Book</p>
          <h2 className="home-title">Hit the desk tonight</h2>
          <div className="home-book">
            <a className="home-book__card" href={contacts.founder.whatsappHref} target="_blank" rel="noreferrer">
              <span className="home-book__tag">Fastest</span>
              <h3>WhatsApp</h3>
              <p>Drop artist, city, and format — get a yes/no same day.</p>
            </a>
            <a className="home-book__card" href={contacts.founder.instagramHref} target="_blank" rel="noreferrer">
              <span className="home-book__tag">Visual</span>
              <h3>DM {contacts.founder.instagram}</h3>
              <p>Send references. Keep it visual.</p>
            </a>
            <a className="home-book__card" href={contacts.studio.whatsappHref} target="_blank" rel="noreferrer">
              <span className="home-book__tag">Productions</span>
              <h3>Studio line</h3>
              <p>MV / podcast / short film through the AppleToe desk.</p>
            </a>
          </div>

          <div className="home-contact">
            <div>
              <h3>{contacts.founder.name}</h3>
              <p className="home-role">{contacts.founder.role}</p>
              <a href={contacts.founder.phoneHref}>{contacts.founder.phone}</a>
              <a href={contacts.founder.emailHref}>{contacts.founder.email}</a>
            </div>
            <div>
              <h3>{contacts.studio.name}</h3>
              <p className="home-role">Productions</p>
              <a href={contacts.studio.phoneHref}>{contacts.studio.phone}</a>
              <a href={contacts.studio.emailHref}>{contacts.studio.email}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-foot">
        <img src={brand.logoSrc} alt="" />
        <span>{brand.legalName}</span>
      </footer>

      <div className={`home-dock${dock ? ' is-on' : ''}`}>
        <a className="home-btn home-btn--solid" href={contacts.founder.whatsappHref} target="_blank" rel="noreferrer">
          Book on WhatsApp
        </a>
        <a className="home-btn home-btn--ghost" href="#work">
          Reel
        </a>
      </div>

      <div className={`home-tweaks${tweaksOpen ? ' is-open' : ''}`}>
        <button type="button" className="home-tweaks__toggle" onClick={() => setTweaksOpen((v) => !v)}>
          Tweaks
        </button>
        {tweaksOpen && (
          <div className="home-tweaks__panel">
            <p>Accent</p>
            <div className="home-tweaks__row">
              <button type="button" className={accent === 'coral' ? 'is-active' : ''} onClick={() => setAccent('coral')}>
                Coral
              </button>
              <button type="button" className={accent === 'cyan' ? 'is-active' : ''} onClick={() => setAccent('cyan')}>
                Cyan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
