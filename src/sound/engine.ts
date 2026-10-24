let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null

function audio() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  return { ctx, master: master!, noiseBuffer: noiseBuffer! }
}

export function unlock() {
  const { ctx } = audio()
  if (ctx.state === 'suspended') void ctx.resume()
}

function envelope(gain: GainNode, t: number, peak: number, attack: number, dur: number) {
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(peak, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur)
}

type NoiseOpts = {
  at?: number
  dur: number
  gain: number
  filter?: BiquadFilterType
  freq?: number
  q?: number
  attack?: number
}

export function noise({ at = 0, dur, gain, filter = 'bandpass', freq = 2000, q = 1, attack = 0.001 }: NoiseOpts) {
  const { ctx, master, noiseBuffer } = audio()
  const t = ctx.currentTime + at
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  const biquad = ctx.createBiquadFilter()
  biquad.type = filter
  biquad.frequency.value = freq
  biquad.Q.value = q
  const amp = ctx.createGain()
  envelope(amp, t, gain, attack, dur)
  src.connect(biquad).connect(amp).connect(master)
  src.start(t, Math.random() * 0.5)
  src.stop(t + attack + dur + 0.02)
}

type ToneOpts = {
  at?: number
  freq: number
  to?: number
  dur: number
  gain: number
  wave?: OscillatorType
  attack?: number
}

export function tone({ at = 0, freq, to, dur, gain, wave = 'sine', attack = 0.002 }: ToneOpts) {
  const { ctx, master } = audio()
  const t = ctx.currentTime + at
  const osc = ctx.createOscillator()
  osc.type = wave
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + attack + dur)
  const amp = ctx.createGain()
  envelope(amp, t, gain, attack, dur)
  osc.connect(amp).connect(master)
  osc.start(t)
  osc.stop(t + attack + dur + 0.02)
}
