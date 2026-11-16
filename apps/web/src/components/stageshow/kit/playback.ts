import { createContext } from 'react'

/** Playback a host page controls from outside the scene, for pause and
 * restart buttons (WCAG 2.2.2). Paused, a stage shows its still, as under
 * reduced motion; unpaused it plays from the start. `run` counts restarts.
 * Scenes that move on timers of their own read it too. */
export const Playback = createContext<{ paused: boolean; run: number }>({ paused: false, run: 0 })
