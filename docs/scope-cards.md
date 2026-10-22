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

| Feature                                        | Value                                                                            | Effort | Complexity | Success signal                                                   | In/Out                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | ------ | ---------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| Network profile as owners see it               | Shows the pro what they get: a vetted badge, their services, a first-visit price | S      | Low        | Pro says the profile is something they would want owners to see  | In                                                                   |
| No ranking, no paid placement box              | Makes the hard rule visible to the payer before any price                        | S      | Low        | Pro does not ask to pay for a higher spot, or accepts the answer | In                                                                   |
| Pending introductions with consented summaries | The core value: prepared households, with only what they chose to share          | M      | Medium     | Pro reads a summary and accepts without asking for more          | In                                                                   |
| Varied sharing (5 of 5 down to 1 of 5)         | Shows what pros need before saying yes                                           | S      | Low        | Pro passes on low-share households or names what is missing      | In                                                                   |
| Pass with a reason and "what would you need"   | Captures why a pro says no                                                       | S      | Low        | Pro picks a reason and types what they want to see               | In                                                                   |
| Membership page, solo and clinic tiers         | Tests whether an annual membership is acceptable                                 | S      | Low        | Pro clicks Join the network                                      | In                                                                   |
| Join records the click and asks one question   | Measures intent without payment, and collects what would make it worth it        | S      | Low        | Pro writes a concrete answer                                     | In                                                                   |
| "Would you rather pay per introduction?" link  | Records the preference that would prove the hypothesis wrong                     | S      | Low        | Share of per-introduction clicks against Join clicks             | In                                                                   |
| Hidden session log and demo seed               | Lets us read results after a session, and rehearse                               | S      | Low        | We can count clicks and answers after each test                  | In                                                                   |
| Real payments or contracts                     | Would measure real willingness to pay                                            | L      | High       | Pro pays                                                         | Out: no backend; a recorded click is enough to test intent           |
| Messaging with households after accept         | Would complete the introduction                                                  | L      | High       | Pro sends a first message                                        | Out: not needed to test whether they accept and join                 |
| Per-introduction pricing page                  | A full alternative offer                                                         | M      | Low        | Pro picks it                                                     | Out: the link records the preference without building a second offer |
| Editing the profile                            | Lets the pro change their services and price                                     | M      | Medium     | Pro edits a field                                                | Out: a sample profile is enough to react to                          |

## Prototype C: Shelter Hand-off

| Feature                               | Value                                                          | Effort | Complexity | Success signal                                | In/Out |
| ------------------------------------- | -------------------------------------------------------------- | ------ | ---------- | --------------------------------------------- | ------ |
| _Example: One-page readiness summary_ | _Gives the counselor something to talk through at the counter_ | _S_    | _Low_      | _Counselor says they would print or share it_ | _In_   |
|                                       |                                                                |        |            |                                               |        |
