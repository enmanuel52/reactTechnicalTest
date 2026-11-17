import { create } from 'zustand'

interface Toast {
  /** Changes on every show(), so repeating the same message restarts the timer. */
  id: number
  message: string
}

interface ToastState {
  toast: Toast | null
  show: (message: string) => void
  hide: () => void
}

let nextId = 0

export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  show: (message) => set({ toast: { id: ++nextId, message } }),
  hide: () => set({ toast: null }),
}))
