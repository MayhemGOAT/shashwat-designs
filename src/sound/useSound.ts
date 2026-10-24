import { useCallback, useRef, useState } from 'react'
import { unlock } from './engine'
import type { Cue, SoundPack } from './packs'

const HOVER_GAP_MS = 70

export function useSound(pack?: SoundPack) {
  const [on, setOn] = useState(false)
  const lastHover = useRef(0)

  const play = useCallback(
    (cue: Cue) => {
      if (!pack || !on) return
      if (cue === 'hover') {
        const t = performance.now()
        if (t - lastHover.current < HOVER_GAP_MS) return
        lastHover.current = t
      }
      pack.cues[cue]()
    },
    [pack, on],
  )

  const toggle = useCallback(() => {
    if (!pack) return false
    const next = !on
    setOn(next)
    if (next) {
      unlock()
      pack.cues.on()
    }
    return next
  }, [pack, on])

  return { available: Boolean(pack), on, toggle, play }
}
