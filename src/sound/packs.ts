import { noise, tone } from './engine'

export type Cue = 'on' | 'open' | 'step' | 'close' | 'hover' | 'confirm'

export type SoundPack = {
  id: string
  name: string
  pitch: string
  flashDelay: number
  cues: Record<Cue, () => void>
}

const shutter = (at = 0, level = 1) => {
  tone({ at, freq: 140, to: 55, dur: 0.05, gain: 0.35 * level, wave: 'triangle' })
  noise({ at, dur: 0.028, gain: 0.8 * level, freq: 3200, q: 0.8 })
  noise({ at: at + 0.068, dur: 0.042, gain: 0.6 * level, freq: 1800, q: 0.9 })
}

const kick = (at = 0, level = 1) => {
  tone({ at, freq: 160, to: 42, dur: 0.45, gain: 0.95 * level, attack: 0.003 })
  noise({ at, dur: 0.012, gain: 0.25 * level, filter: 'highpass', freq: 3000 })
}

const hat = (at = 0, level = 1, dur = 0.03) =>
  noise({ at, dur, gain: 0.22 * level, filter: 'highpass', freq: 8000, q: 0.7 })

const clap = (at = 0) => {
  for (const d of [0, 0.011, 0.022]) noise({ at: at + d, dur: 0.012, gain: 0.35, freq: 1200, q: 1.2 })
  noise({ at: at + 0.03, dur: 0.14, gain: 0.3, freq: 1300, q: 0.9 })
}

const beep = (at: number, freq: number, dur = 0.07, gain = 0.12) =>
  tone({ at, freq, dur, gain, wave: 'square', attack: 0.003 })

export const packs: SoundPack[] = [
  {
    id: 'shutter',
    name: 'Shutter',
    pitch: 'Mechanical DSLR: flash charge whine, mirror slap, film-advance ratchet.',
    flashDelay: 620,
    cues: {
      on: () => {
        tone({ freq: 700, to: 5600, dur: 0.6, gain: 0.05 })
        noise({ at: 0.62, dur: 0.07, gain: 0.5, filter: 'highpass', freq: 1500 })
        shutter(0.62)
      },
      open: () => shutter(),
      step: () => {
        for (let i = 0; i < 5; i++) noise({ at: i * 0.017, dur: 0.006, gain: 0.25, filter: 'highpass', freq: 4500 })
        shutter(0.11, 0.45)
      },
      close: () => shutter(0, 0.4),
      hover: () => noise({ dur: 0.004, gain: 0.1, filter: 'highpass', freq: 6000 }),
      confirm: () => [0, 0.09, 0.18].forEach((at) => shutter(at, 0.8)),
    },
  },
  {
    id: 'camcorder',
    name: 'Camcorder',
    pitch: 'Digital REC beeps, tape-deck clunk, menu blips. Matches the viewfinder hero.',
    flashDelay: 260,
    cues: {
      on: () => {
        beep(0, 2000)
        beep(0.12, 2000)
      },
      open: () => {
        noise({ dur: 0.07, gain: 0.55, filter: 'lowpass', freq: 380 })
        tone({ at: 0.02, freq: 70, to: 95, dur: 0.25, gain: 0.08, wave: 'sawtooth' })
        beep(0.16, 2400, 0.09)
      },
      step: () => beep(0, 1500, 0.035, 0.08),
      close: () => {
        beep(0, 2000, 0.06)
        beep(0.09, 1400, 0.08)
      },
      hover: () => tone({ freq: 3200, dur: 0.014, gain: 0.03 }),
      confirm: () => [1200, 1600, 2000].forEach((f, i) => beep(i * 0.08, f, 0.06)),
    },
  },
  {
    id: 'booth',
    name: '808 Booth',
    pitch: 'Hip-hop kit: 808 kick, hats, clap. Sounds like the studio the artists come from.',
    flashDelay: 0,
    cues: {
      on: () => {
        kick()
        hat(0.25)
        hat(0.375, 0.6)
      },
      open: () => {
        kick(0, 0.8)
        tone({ at: 0.001, freq: 1700, dur: 0.02, gain: 0.12, wave: 'triangle' })
        noise({ at: 0.001, dur: 0.03, gain: 0.3, freq: 2500, q: 1.5 })
      },
      step: () => hat(),
      close: () => hat(0, 0.6, 0.18),
      hover: () => hat(0, 0.3, 0.012),
      confirm: () => {
        kick()
        clap(0.18)
      },
    },
  },
]
