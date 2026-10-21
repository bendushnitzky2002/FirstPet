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

| Feature                                                                  | Value                                                                                | Effort | Complexity | Success signal                                          | In/Out                                                                          |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------ | ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| First-year number from a ZIP, before any question                        | Gives the skeptic a local number up front, which is the whole hypothesis             | S      | Low        | Tester states the number back and keeps going           | In                                                                              |
| Emergency cushion as its own Required line                               | Puts the surprise vet bill, the top fear, inside the number instead of in fine print | S      | Low        | Tester points at the cushion or asks about it           | In                                                                              |
| Gut check right after the number                                         | Records where the skeptic starts (works, not sure, no) before anything else          | S      | Low        | Tester picks one without hesitating                     | In                                                                              |
| Four live levers on one screen (hours, nights away, saved, monthly room) | Lets the number become theirs; each lever shows its dollar effect                    | M      | Medium     | Tester moves a lever on purpose to see the number drop  | In                                                                              |
| Midday walker and sitter lines that appear as the schedule changes       | Turns time questions into dollars, so schedule and money are one conversation        | S      | Low        | Tester reacts to the walker line appearing              | In                                                                              |
| Rule-based verdict with dollar changes                                   | Says ready, ready once, or not yet, and lists exactly what moves the answer          | M      | Medium     | Tester can say what they would change and by how much   | In                                                                              |
| "Where are you now?" after the verdict                                   | Shows whether "no" moved to "ready once these change", the signal we test for        | S      | Low        | A tester who started at no picks ready once             | In                                                                              |
| One-page summary to bring to the first vet visit                         | Gives Vicky's future clients a prepared first conversation                           | S      | Low        | Tester says they would print it or show it to their vet | In                                                                              |
| "Where do these numbers come from?" note                                 | Honest about sample data and the no paid ranking rule                                | S      | Low        | Tester opens it and is not put off                      | In                                                                              |
| Demo seed shortcut (press d three times)                                 | Rehearsal and a backup if the live flow breaks                                       | S      | Low        | Presenter reaches a filled check in one step            | In                                                                              |
| Partner invite or side by side                                           | Would let the skeptic join a partner's check                                         | M      | Medium     | Partner answers                                         | Out: that is Prototype A's hypothesis                                           |
| Real local prices from network vets                                      | Would make the number truly local                                                    | L      | High       | Numbers match local quotes                              | Out: needs real partners and data; sample data is labeled                       |
| Care schedule builder with names                                         | Turns the walker line into a plan                                                    | L      | Medium     | Household fills in a week                               | Out: not needed to test whether the number moves the skeptic                    |
| Pro matching for gaps (walker, sitter)                                   | Points to a local pro for a costly line                                              | M      | Medium     | Tester taps a pro                                       | Out: tests a different question; we only mention the network in the source note |
| Accounts or saved history                                                | Come back to the number later                                                        | M      | Medium     | Tester returns                                          | Out: give value before asking for anything; localStorage covers a demo          |

## Prototype C: Shelter Hand-off

| Feature                               | Value                                                          | Effort | Complexity | Success signal                                | In/Out |
| ------------------------------------- | -------------------------------------------------------------- | ------ | ---------- | --------------------------------------------- | ------ |
| _Example: One-page readiness summary_ | _Gives the counselor something to talk through at the counter_ | _S_    | _Low_      | _Counselor says they would print or share it_ | _In_   |
|                                       |                                                                |        |            |                                               |        |
