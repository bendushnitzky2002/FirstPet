// SAMPLE DATA. A made-up professional so the profile screen has something to
// show. Not a real business. The vetting steps are a draft for this prototype.

export const PROFILE = {
  name: 'Bright Paws Veterinary Clinic',
  kind: 'Veterinary clinic',
  area: 'Durham, NC',
  serves: 'Within 10 miles of 27701',
  services: [
    'New pet exams',
    'Vaccines and preventives',
    'Spay and neuter',
    'Puppy and kitten plans',
  ],
  firstVisit: 'New pet exam, $85 (sample price)',
}

export const VETTING_STEPS = [
  { label: 'License checked', detail: 'State license on file and current' },
  { label: 'Insurance on file', detail: 'Proof of liability coverage' },
  { label: 'Prices shared up front', detail: 'First-visit price shown to owners before they book' },
  { label: 'Agreed to our rules', detail: 'No paid ranking, and the verdict is never for sale' },
]

// What an owner sees when their care plan has a gap. Every vetted pro gets the
// same badge, and the list is sorted by distance only.
export const OWNER_VIEW = {
  gap: 'First vet visit and vaccines',
  pros: [
    { name: 'Bright Paws Veterinary Clinic', distance: '1.8 miles', you: true },
    { name: 'Sample clinic B', distance: '2.4 miles', you: false },
    { name: 'Sample clinic C', distance: '4.1 miles', you: false },
  ],
}
