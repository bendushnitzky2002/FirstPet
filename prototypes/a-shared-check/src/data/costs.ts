import type { Check, Pet } from '../types'
import { OVERNIGHT_OPTIONS } from './questions'

// SAMPLE DATA. These first-year numbers are placeholders we wrote for the
// prototype so the cost block has something plausible to show. They are not
// from a survey, a vet, or any published source, and the UI says so.

export type PetCosts = {
  routineVet: number // exams, vaccines, preventives for year one
  foodSupplies: number // food, litter or toys, bed, crate, leash
  sitterPerDay: number // a sitter or walker for one day or night
  cushion: number // emergency cushion we tell people to set aside
}

export type CostEntry = {
  place: string
  dog: PetCosts
  cat: PetCosts
}

export const DEFAULT_COSTS: CostEntry = {
  place: 'your area',
  dog: { routineVet: 700, foodSupplies: 1100, sitterPerDay: 60, cushion: 2000 },
  cat: { routineVet: 450, foodSupplies: 700, sitterPerDay: 35, cushion: 1500 },
}

export const COSTS_BY_ZIP: Record<string, CostEntry> = {
  '27701': {
    place: 'Durham, NC',
    dog: { routineVet: 680, foodSupplies: 1050, sitterPerDay: 55, cushion: 2000 },
    cat: { routineVet: 430, foodSupplies: 680, sitterPerDay: 32, cushion: 1500 },
  },
  '27514': {
    place: 'Chapel Hill, NC',
    dog: { routineVet: 720, foodSupplies: 1080, sitterPerDay: 58, cushion: 2000 },
    cat: { routineVet: 450, foodSupplies: 690, sitterPerDay: 34, cushion: 1500 },
  },
  '28202': {
    place: 'Charlotte, NC',
    dog: { routineVet: 690, foodSupplies: 1060, sitterPerDay: 55, cushion: 2000 },
    cat: { routineVet: 440, foodSupplies: 680, sitterPerDay: 33, cushion: 1500 },
  },
  '33139': {
    place: 'Miami Beach, FL',
    dog: { routineVet: 820, foodSupplies: 1200, sitterPerDay: 70, cushion: 2500 },
    cat: { routineVet: 520, foodSupplies: 760, sitterPerDay: 42, cushion: 1800 },
  },
  '32801': {
    place: 'Orlando, FL',
    dog: { routineVet: 700, foodSupplies: 1080, sitterPerDay: 58, cushion: 2000 },
    cat: { routineVet: 450, foodSupplies: 700, sitterPerDay: 35, cushion: 1500 },
  },
  '43215': {
    place: 'Columbus, OH',
    dog: { routineVet: 620, foodSupplies: 1000, sitterPerDay: 50, cushion: 1800 },
    cat: { routineVet: 400, foodSupplies: 650, sitterPerDay: 30, cushion: 1300 },
  },
  '44113': {
    place: 'Cleveland, OH',
    dog: { routineVet: 600, foodSupplies: 980, sitterPerDay: 48, cushion: 1800 },
    cat: { routineVet: 390, foodSupplies: 640, sitterPerDay: 30, cushion: 1300 },
  },
  '94110': {
    place: 'San Francisco, CA',
    dog: { routineVet: 980, foodSupplies: 1350, sitterPerDay: 85, cushion: 3000 },
    cat: { routineVet: 620, foodSupplies: 850, sitterPerDay: 50, cushion: 2200 },
  },
  '90026': {
    place: 'Los Angeles, CA',
    dog: { routineVet: 900, foodSupplies: 1300, sitterPerDay: 75, cushion: 2800 },
    cat: { routineVet: 580, foodSupplies: 820, sitterPerDay: 45, cushion: 2000 },
  },
  '78704': {
    place: 'Austin, TX',
    dog: { routineVet: 760, foodSupplies: 1120, sitterPerDay: 62, cushion: 2200 },
    cat: { routineVet: 480, foodSupplies: 720, sitterPerDay: 38, cushion: 1600 },
  },
  '77002': {
    place: 'Houston, TX',
    dog: { routineVet: 700, foodSupplies: 1080, sitterPerDay: 55, cushion: 2000 },
    cat: { routineVet: 450, foodSupplies: 700, sitterPerDay: 34, cushion: 1500 },
  },
}

export type FirstYear = {
  place: string
  zip: string
  isDefault: boolean
  basis: 'dog' | 'cat'
  pet: Pet
  routineVet: number
  foodSupplies: number
  sitterPerDay: number
  sitterNights: number
  sitter: number
  subtotal: number
  cushion: number
  total: number
}

// First-year cost for the household. "Not sure yet" uses dog numbers, the
// higher of the two. Sitter nights come from the higher overnights answer.
export function firstYear(check: Check): FirstYear {
  const zip = check.zip ?? ''
  const entry = COSTS_BY_ZIP[zip]
  const pet = check.pet ?? 'unsure'
  const basis = pet === 'cat' ? 'cat' : 'dog'
  const c = (entry ?? DEFAULT_COSTS)[basis]

  const perMonth = Math.max(
    0,
    ...[check.starter, check.partner?.done ? check.partner : undefined]
      .map((p) => p?.overnights)
      .filter((v) => v !== undefined)
      .map((v) => OVERNIGHT_OPTIONS.find((o) => o.value === v)!.perMonth),
  )
  const sitterNights = perMonth * 12
  const sitter = sitterNights * c.sitterPerDay
  const subtotal = c.routineVet + c.foodSupplies + sitter

  return {
    place: entry?.place ?? DEFAULT_COSTS.place,
    zip,
    isDefault: !entry,
    basis,
    pet,
    routineVet: c.routineVet,
    foodSupplies: c.foodSupplies,
    sitterPerDay: c.sitterPerDay,
    sitterNights,
    sitter,
    subtotal,
    cushion: c.cushion,
    total: subtotal + c.cushion,
  }
}

export const money = (n: number) => `$${n.toLocaleString('en-US')}`
