# Work Diary – Kadri Nigulas

## 2.10.2026

**Time spent:** approximately 1 hour

### Activities
- logging in to github, changing my name there
- exploring the groupwork assingment and requirements

### Problems and corrections
- 

### AI assistance
- 

### What I learned
- what is needed to finish the course


## 11.10.2026

**Time spent:** approximately 9 hours

### Activities
- continuing to set up the tools and environments
- getting the example application working on my computer

### Problems and corrections
- several different errors and problems

### AI assistance
- all the steps done with the help from Copilot

### What I learned
- how to clone a project from github
- how to set up a project in my computer

### Next steps
- getting the group project on my computer and getting everything ready to work on the project


## 16.10.2026

**Time spent:** approximately 1 hour

### Activities
- checking my local branch is set up correctly and getting updates
- creating my work diary and filling in the work done so far

### Problems and corrections
- found out that my local branch had olny origin as a remote, added my group repository

### AI assistance
- all the steps done with the help from Copilot

### What I learned
- how to create and keep a work diary in .md file

### Next steps
- checking the questions regarding the user story and requirements with the group

## 19.10.2026

**Time spent:** approximately 1 hour

### Activities
- group meeting to discuss specification

### Problems and corrections
- 

### AI assistance
- 

### What I learned
- 

### Next steps
- 

## 08.11.2026

**Time spent:** approximately 2 hours

### Activities
- improving spec (data model)
- wiritng initial API spec

### Problems and corrections
- found some problems with the data model and requirements when writing the API spec, corrected/sent corrections to teammate

### AI assistance
- answering questions and helping with the assignement and doing the changes
- helping to validate the spec
- writing API specs

### What I learned
- writing API spec with the help of AI

### Next steps
- specifing the requirements together with the team
- specifing API spec

## 20.11.2026

**Time spent:** approximately 1.5 hours

### Activities
- Fetched and merged the team's updates from `upstream/main` into my parking-permit branch, then synced my branch to `origin`.
- Reviewed feedback on PR #10 and clarified the API path and optional `reason` with the team.
- Confirmed and updated the Parking Permit specification: application statuses, uniqueness rules, expiry and revocation scope, versioned API contract, pagination, sorting, and business tests.
- Aligned the user story and business tests to require an 11-digit personal identity code.

### Problems and corrections
- Initially fetched from `origin` instead of the shared `upstream`; Git's ref-pruning prompt and branch-list output were confusing. Checked the remotes, fetched from `upstream` without pruning, and exited the pager.
- Copilot's initial Git instructions were unclear and led to temporary missing-file indicators. Restored the files and verified the branch state.

### AI assistance
- Used Copilot to troubleshoot Git, review PR feedback, validate and update the specification, and align the user story and tests.

### What I learned
- `origin` is my fork and `upstream` is the shared team repository.
- Fetching downloads remote updates; merging brings them into my branch.
- API decisions and business tests should be agreed and specified before implementation.

### Next steps
- Ask the PR #10 author to align the endpoint with `/api/v1/permit-applications`, include optional `reason`, and update the tests.
- Review the updated PR and turn the confirmed business tests into executable tests before implementing the remaining endpoints.

## 23.11.2026

**Time spent:** approximately 4 hours

### Activities
- Implemented the remaining parking application list and details API operations.
- Implemented parking permit creation and permit-details operations.
- Added paged application responses with filtering, sorting, and pagination metadata.
- Added generated permit numbers in the `PARK-` plus 12-character format.
- Added permit validity and status validation at the service and database levels.
- Added Swagger/OpenAPI annotations and `application/problem+json` handling.
- Added focused parking permit integration tests and ran the complete backend Testcontainers suite.

### Problems and corrections
- A Windows build-directory lock caused repeated Gradle resource-cleanup failures; stopped the specific stale Java process and removed only generated build output before retrying.
- Docker was initially unavailable, then restarted successfully and the parking Testcontainers suite passed.
- The changeset checker reports violations in previously released parking changesets. I did not edit those files and instead added a new validation changeset.

### AI assistance
- Used Copilot to compare the implementation against the confirmed specification and course repository conventions.
- Used AI help to design API DTOs, repository queries, service rules, tests, and verification commands.

### What I learned
- The confirmed list contract uses the parking specification's `limit`, `offset`, and `total` meta fields.
- Permit creation must validate approved application state, duplicate permits, validity periods, and permit-number uniqueness.
- Released Liquibase changesets must remain unchanged; new database constraints require an appended changeset.
- Testcontainers verification is a stronger check than compilation alone because it tests the migrations and PostgreSQL behavior.

## 26.11.2026

**Time spent:** approximately 1 hour

### Activities
- Checked that my active `baste/parking-permit-work` branch matched the shared repository's latest `main` commit.
- Reviewed the parking-permit demo flow and identified that the UI only supported creating applications and the API had no decision endpoint.
- Added decision recording to the API, including validation, duplicate-decision conflict handling, the `DECIDED` status transition, and the specified `Location` response.
- Added a paginated applications list and application details UI with approval/rejection, permit issuance for approved applications, and issued permit details.
- Added integration tests for the approved and rejected flows, duplicate decisions, invalid decision types, and missing applications.
- Updated the README with the parking demo route and manually tested creating, approving, and issuing a permit.
- Ran the parking integration tests and frontend typecheck successfully.
- Restarted the local demo services after the user reported create-application errors, refreshed the browser, and confirmed the form and API were responding.

### Problems and corrections
- Gradle could not clean its test-results directory because it was a read-only OneDrive placeholder. Used a temporary Gradle init script to place build output in the system temp directory, reran the tests successfully, and removed the script and temporary output.
- Initially ran the frontend typecheck from the repository root, where there is no `package.json`; reran it from `frontend/`.
- Browser testing exposed deprecated Ant Design props; replaced them with the current `Space.orientation` and `Alert.title` props.
- I stopped the local database and application servers after the first browser verification. This left the user's browser page stale and caused API connection failures. Restarted PostgreSQL, the backend, and the frontend, then verified the mock-auth endpoints and parking API returned HTTP 200.

### AI assistance
- Used Copilot to compare the current implementation with the confirmed parking specification, implement the missing API and UI workflow, add tests before implementation, and verify the end-to-end flow.
- Used Copilot to compare the active branch with the shared repository and troubleshoot the OneDrive-related Gradle test-output issue.
- Used Copilot to diagnose the create-form error; the initial diagnosis was that the local services were stopped, which was confirmed by refused connections and fixed by restarting them.

### What I learned
- The existing decision table and unique constraint already supported the missing API workflow, so no database migration was needed.
- The application's local build output can be affected by OneDrive placeholder files; directing test output to a local temporary directory avoided changing repository files.
- The complete demo can now follow the specified officer workflow from application creation through active permit details.
- Local demo services need to remain running while the user is interacting with the browser.

### Next steps
- Review the diff with the group and run the complete pre-PR verification before committing and opening a pull request.
