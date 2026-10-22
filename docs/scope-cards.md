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

| Feature                                                                                          | Value                                                                                        | Effort | Complexity | Success signal                                                                 | In/Out |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------------------------ | ------ |
| Upcoming visits as the counselor's home, sorted by visit time                                    | The check reaches the shelter before the visit, which is the hypothesis                      | M      | Medium     | Counselor knows who is coming in and how ready they are without opening anyone | In     |
| "Missing:" flags per visit (src/data/missing.ts)                                                 | Shows what the adopter still needs before the visit, so nothing is a surprise at the counter | S      | Low        | Counselor names a missing item they would ask about                            | In     |
| Request a check: form plus one-click button per pending visit, personal link                     | Makes the free check the shelter's step one with no extra work                               | S      | Medium     | Counselor sends a request without help                                         | In     |
| Shelter-branded start screen with the four adoption steps, greeting by name from a request       | Makes the check feel like the shelter's step one, not an extra app                           | S      | Low        | Adopter starts the check without asking why they have to                       | In     |
| Pet-specific readiness check (8 questions, one per screen)                                       | Checks this household against this pet's needs (hours alone, extra costs)                    | M      | Medium     | Adopter finishes in about 5 minutes                                            | In     |
| Rule-based verdict with "not yet" and a checklist (src/data/verdict.ts)                          | Honest answer the counselor can explain; the rules are visible                               | S      | Low        | Counselor can say why an adopter got their result                              | In     |
| First-year cost for the pet with a required emergency cushion                                    | Puts the number one fear on the table before the visit                                       | S      | Low        | Adopter or counselor points at the cushion line                                | In     |
| Applicant readiness summary with missing items and "Talk about these at the counter"             | Everything the counselor needs for the visit on one screen                                   | M      | Medium     | Counselor uses a talking point in a role play                                  | In     |
| Printable one-page summary                                                                       | Something to keep in the adoption file                                                       | S      | Low        | Counselor says they would print or file it                                     | In     |
| Mark adopted and schedule a week-two check-in                                                    | Closes the loop after the pet goes home                                                      | S      | Low        | Counselor marks an adoption without help                                       | In     |
| Adopter week-two check-in (6 questions, by link)                                                 | Catches trouble before a return, while it can still be fixed                                 | M      | Medium     | Adopter answers the return question honestly                                   | In     |
| Check-in list with "Call this week" flags and a plan versus week two table (src/data/checkin.ts) | Tells Carla who to call first and why                                                        | M      | Medium     | Counselor says the flag list would change who they call                        | In     |
| Plans tab: Free ($0) next to "Analytics and multi-location" with Subscribe Now                   | The test: will a shelter pay for analytics across adoptions when the check is free           | S      | Low        | At least some counselors click Subscribe Now                                   | In     |
| "What would make our service worth it?" after Subscribe Now, recorded locally                    | Tells us what the paid plan would need to include                                            | S      | Low        | Counselor gives a specific answer, not "nothing"                               | In     |
| All adopters list with search and filter (adapted from Sala's Figma)                             | Finds any adopter, past or upcoming                                                          | S      | Low        | Counselor opens the right adopter without help                                 | In     |
| Counselor notes (local only)                                                                     | Lets staff record the conversation; never changes a result                                   | S      | Low        | Counselor writes a note after the talk                                         | In     |
| Hidden "ddd" demo seed                                                                           | Rehearsal and backup if the live flow breaks                                                 | S      | Low        | Demo recovers in one step                                                      | In     |
| A real analytics dashboard                                                                       | We test the willingness to pay before building it; the plan lists what it would show         | L      | High       | n/a                                                                            | Out    |
| Real payment for Subscribe Now                                                                   | No backend; the click and the answer are the signal                                          | M      | High       | n/a                                                                            | Out    |
| Real email or text for request and check-in links                                                | Needs a backend; the prototype copies the link and opens it directly                         | M      | High       | n/a                                                                            | Out    |
| Counselor accounts and multiple locations                                                        | No backend or auth; multi-location is what the paid plan offers                              | L      | High       | n/a                                                                            | Out    |
| Pointing adopters to vetted local pros from the check-in                                         | Part of the product, but here help requests only reach the counselor                         | M      | Medium     | n/a                                                                            | Out    |
| Sala's clarification requests, pet listings, public profile, transition plans                    | Useful shelter tools, but they do not test this hypothesis                                   | L      | Medium     | n/a                                                                            | Out    |
| Automated approve or deny decision                                                               | Against our rules: the verdict supports a conversation, the shelter and adopter decide       | M      | Medium     | n/a                                                                            | Out    |
