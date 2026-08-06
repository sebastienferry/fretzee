# Tasks: Project Board Workflow Skills

**Input**: Design documents from `specs/009-workflow-skills/`
**Prerequisites**: plan.md (required), spec.md (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: User story mapping (US1, US2, US3)

---

## Phase 1: Setup & Data Model

- [x] T001 [P] [US1] Create research and data model documentation in `specs/009-workflow-skills/research.md` and `specs/009-workflow-skills/data-model.md`

---

## Phase 2: Skill Updates (US1 & US2)

- [x] T002 [US1] Update `.agents/skills/clarify-issue/SKILL.md` to target `selected` label and transition to `to-clarify` until user sets `clarified`.
- [x] T003 [US1] Update `.agents/skills/spec-issue/SKILL.md` to target `clarified` label, generate specs, and output `specified` label.
- [x] T004 [US1] Update `.agents/skills/code-issue/SKILL.md` to target `specified` label, execute implementation, set `validate` label, create PR, and transition to `validated` / Done.
- [x] T005 [US2] Update `.agents/skills/pick-issue/SKILL.md` to accept optional issue argument (number or URL) and route according to stage labels (`selected` → `clarified` → `specified` → `validate` → `validated`).

---

## Phase 3: Documentation & Verification (US3)

- [x] T006 [US3] Update `AGENTS.md` to reflect new board columns (Idea, Clarification, Specification, Code, Done) and label progression (`selected` → `clarified` → `specified` → `validate` → `validated`).
- [x] T007 [US3] Run automated verification suite (`npm run build`, `npm run lint`, `npm test`).

---

## Phase 4: Finalization & PR

- [x] T008 Update `CHANGELOG.md` under `## [Next]` for Issue #27.
- [x] T009 Create PR using `/create-pr` for branch `feat/027-workflow-skills`.
