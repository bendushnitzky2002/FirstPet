import { useSyncExternalStore } from 'react'
import { sampleApplicants, sampleRequests } from '../data/seed'
import type { Applicant, CheckRequest, Draft, UpgradeInterest } from '../types'

// All state lives in localStorage so the demo survives a refresh. One key
// holds the shelter's adopter list and the adopter's in-progress check.
const KEY = 'firstpet-c:v2'

export type State = {
  applicants: Applicant[]
  requests: CheckRequest[]
  upgrade: UpgradeInterest
  draft?: Draft
}

function fresh(applicants = sampleApplicants(), requests = sampleRequests()): State {
  return { applicants, requests, upgrade: { clicks: [], answers: [] } }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...fresh(), ...(JSON.parse(raw) as Partial<State>) }
  } catch {
    // Fall through to fresh sample data.
  }
  return fresh()
}

let state: State = load()
const listeners = new Set<() => void>()

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked: the demo still works in memory.
  }
  listeners.forEach((l) => l())
}

export function setState(update: (s: State) => State) {
  state = update(state)
  emit()
}

export function useStore(): State {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

export function updateApplicant(id: string, update: (a: Applicant) => Applicant) {
  setState((s) => ({
    ...s,
    applicants: s.applicants.map((a) => (a.id === id ? update(a) : a)),
  }))
}

// Reset the sample data. What the team recorded about Subscribe Now stays.
export function resetTo(applicants: Applicant[], requests: CheckRequest[]) {
  state = { ...fresh(applicants, requests), upgrade: state.upgrade }
  emit()
}

// Six letters and digits, skipping ones that are easy to misread.
export function newId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}
