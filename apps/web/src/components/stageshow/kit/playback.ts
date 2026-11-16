import { createContext } from 'react'

/** Playback a host page controls from outside the scene, for a pause
 * button (WCAG 2.2.2). Paused, a stage shows its still, as under reduced
 * motion; unpaused it plays from the start. Scenes that move on timers of
 * their own read it too. */
export const Playback = createContext<{ paused: boolean }>({ paused: false })
