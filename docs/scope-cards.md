# Feature scope cards

One card per prototype. Every feature we consider gets a row, including the ones we cut.

- **Value:** what it does for the persona and how directly it tests the hypothesis.
- **Effort:** S, M, or L.
- **Complexity:** Low, Medium, or High (moving parts, state, edge cases).
- **Success signal:** what we would see in a test session that tells us it worked.
- **In/Out:** whether it ships in this prototype.

The example rows are illustrations only. Replace them with real rows.

## Prototype A: Shared Check

| Feature                                      | Value                                                                             | Effort | Complexity | Success signal                                                           | In/Out                                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Start alone, no account                      | One person (the researcher) can begin without waiting for the other or signing up | S      | Low        | Tester starts and finishes their seven questions without asking for help | In                                                                                                       |
| Seven household questions, one per screen    | Captures time, money, and worries in about the time it takes to make coffee       | M      | Low        | Tester finishes all seven without backing out                            | In                                                                                                       |
| Invite by code and link                      | Lets the starter bring in the skeptic later, which is the core of the hypothesis  | S      | Low        | Tester copies the link and says who they would send it to                | In                                                                                                       |
| Partner path, four questions                 | The skeptic only answers money and schedule, so joining is cheap                  | S      | Medium     | Partner opens the link and answers without help                          | In                                                                                                       |
| Side by side comparison                      | Shows where the two people agree and where to talk, before any verdict            | M      | Medium     | Couple points at a "Talk about this" row and starts discussing it        | In                                                                                                       |
| Nudge line on each difference                | Turns a mismatch into a concrete question ("Who's home at lunch?")                | S      | Low        | Tester reads a nudge aloud or answers it                                 | In                                                                                                       |
| First-year cost by ZIP with required cushion | Gives the skeptic a local number before the verdict                               | S      | Low        | Skeptic repeats the total or the cushion back                            | In                                                                                                       |
| Rule-based verdict with checklist            | A clear answer that can be "not yet," with the specific things to change          | M      | Medium     | Tester can say why they got their verdict                                | In                                                                                                       |
| Preview without the partner                  | Lets the starter see value now, labeled as one person's answers                   | S      | Low        | Starter previews, then goes back to send the invite                      | In                                                                                                       |
| One-page printable summary                   | Something to keep or put on the fridge after the check                            | S      | Low        | Tester prints or saves it                                                | In                                                                                                       |
| Demo seed shortcut (press d three times)     | Rehearsal and a backup if the live flow breaks                                    | S      | Low        | Presenter reaches the comparison in one step                             | In                                                                                                       |
| Cross-device sync for the invite link        | The partner could answer on their own phone                                       | L      | High       | Partner answers on a different device                                    | Out: needs a backend, and the rules say no backend. In the prototype the link works in the same browser. |
| Accounts or email invites                    | Would let a couple come back later from anywhere                                  | M      | Medium     | Couple returns days later                                                | Out: people abandon tools that ask for an account before giving value                                    |
| Care schedule builder                        | Turns "who covers Tuesdays" into a plan with names                                | L      | Medium     | Couple fills in the week                                                 | Out: not needed to test whether both people finish                                                       |
| Pro matching for gaps                        | Points to a walker or sitter for the long days                                    | M      | Medium     | Tester taps a pro                                                        | Out: belongs to other prototypes, not this hypothesis                                                    |
| Pet type recommendation                      | Suggests dog or cat from answers                                                  | M      | Medium     | Tester changes their pick                                                | Out: out of scope for this hypothesis                                                                    |

## Prototype B: The Number

| Feature                                               | Value                                                   | Effort | Complexity | Success signal                                  | In/Out |
| ----------------------------------------------------- | ------------------------------------------------------- | ------ | ---------- | ----------------------------------------------- | ------ |
| _Example: First-year cost by ZIP on the first screen_ | _Gives the skeptic a local number before any questions_ | _S_    | _Low_      | _Tester states the number back and keeps going_ | _In_   |
|                                                       |                                                         |        |            |                                                 |        |

## Prototype C: Shelter Hand-off

| Feature                               | Value                                                          | Effort | Complexity | Success signal                                | In/Out |
| ------------------------------------- | -------------------------------------------------------------- | ------ | ---------- | --------------------------------------------- | ------ |
| _Example: One-page readiness summary_ | _Gives the counselor something to talk through at the counter_ | _S_    | _Low_      | _Counselor says they would print or share it_ | _In_   |
|                                       |                                                                |        |            |                                               |        |
