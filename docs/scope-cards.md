# Feature scope cards

One card per prototype. Every feature we consider gets a row, including the ones we cut.

- **Value:** what it does for the persona and how directly it tests the hypothesis.
- **Effort:** S, M, or L.
- **Complexity:** Low, Medium, or High (moving parts, state, edge cases).
- **Success signal:** what we would see in a test session that tells us it worked.
- **In/Out:** whether it ships in this prototype.

The example rows are illustrations only. Replace them with real rows.

## Prototype A: Shared Check

| Feature                           | Value                                                | Effort | Complexity | Success signal                                    | In/Out |
| --------------------------------- | ---------------------------------------------------- | ------ | ---------- | ------------------------------------------------- | ------ |
| _Example: Invite partner by link_ | _Lets one person start alone and bring in the other_ | _S_    | _Low_      | _Partner opens the link and answers without help_ | _In_   |
|                                   |                                                      |        |            |                                                   |        |

## Prototype B: The Number

| Feature                                               | Value                                                   | Effort | Complexity | Success signal                                  | In/Out |
| ----------------------------------------------------- | ------------------------------------------------------- | ------ | ---------- | ----------------------------------------------- | ------ |
| _Example: First-year cost by ZIP on the first screen_ | _Gives the skeptic a local number before any questions_ | _S_    | _Low_      | _Tester states the number back and keeps going_ | _In_   |
|                                                       |                                                         |        |            |                                                 |        |

## Prototype C: Shelter Hand-off

| Feature                                                                                    | Value                                                                                           | Effort | Complexity | Success signal                                           | In/Out |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------ | ---------- | -------------------------------------------------------- | ------ |
| Feature                                                                                    | Value                                                                                           | Effort | Complexity | Success signal                                           | In/Out |
| ---                                                                                        | ---                                                                                             | ---    | ---        | ---                                                      | ---    |
| Shelter-branded start screen with the four adoption steps                                  | Makes the check feel like the shelter's step one, not an extra app; the hypothesis made visible | S      | Low        | Adopter starts the check without asking why they have to | In     |
| Pet-specific readiness check (8 questions, one per screen)                                 | Checks this household against this pet's needs (hours alone, extra costs)                       | M      | Medium     | Adopter finishes in about 5 minutes                      | In     |
| Rule-based verdict with "not yet" and a checklist (src/data/verdict.ts)                    | Honest answer the counselor can explain; the rules are visible                                  | S      | Low        | Counselor can say why an adopter got their result        | In     |
| First-year cost for the pet with a required emergency cushion                              | Puts the number one fear on the table before the counter                                        | S      | Low        | Adopter or counselor points at the cushion line          | In     |
| Counselor adopter list with verdict, stage, search, and filter (adapted from Sala's Figma) | Carla sees who is coming in and how ready they are                                              | M      | Medium     | Counselor opens the right adopter without help           | In     |
| Counter link card ("Ask every adopter to start here")                                      | Shows how the shelter asks for the check as step one                                            | S      | Low        | Counselor says where they would put the link             | In     |
| Applicant readiness summary with "Talk about these at the counter"                         | Turns answers into talking points for the conversation                                          | M      | Medium     | Counselor uses a talking point in a role play            | In     |
| Printable one-page summary                                                                 | Something to keep in the adoption file                                                          | S      | Low        | Counselor says they would print or file it               | In     |
| Mark adopted and schedule a week-two check-in                                              | Closes the loop after the pet goes home                                                         | S      | Low        | Counselor marks an adoption without help                 | In     |
| Adopter week-two check-in (6 questions, by link)                                           | Catches trouble before a return, while it can still be fixed                                    | M      | Medium     | Adopter answers the return question honestly             | In     |
| Plan versus week two comparison and "Call this week" flags (src/data/checkin.ts)           | Tells Carla who to call first and why                                                           | M      | Medium     | Counselor says the flag list would change who they call  | In     |
| Counselor notes (local only)                                                               | Lets staff record the conversation; never changes a result                                      | S      | Low        | Counselor writes a note after the talk                   | In     |
| Hidden "ddd" demo seed                                                                     | Rehearsal and backup if the live flow breaks                                                    | S      | Low        | Demo recovers in one step                                | In     |
| Real email or text for the check-in link                                                   | Needed in production, but adds a backend; the prototype opens the link directly                 | M      | High       | n/a                                                      | Out    |
| Counselor accounts and multiple shelters                                                   | No backend or auth in this prototype; one sample shelter is enough to test the idea             | L      | High       | n/a                                                      | Out    |
| Pointing adopters to vetted local pros from the check-in                                   | Part of the product, but tested elsewhere; here help requests only reach the counselor          | M      | Medium     | n/a                                                      | Out    |
| Sala's clarification requests, pet listings, public profile, transition plans              | Useful shelter tools, but they do not test the readiness check or the week-two check-in         | L      | Medium     | n/a                                                      | Out    |
| Automated approve or deny decision                                                         | Against our rules: the verdict supports a conversation, the shelter and adopter decide          | M      | Medium     | n/a                                                      | Out    |
