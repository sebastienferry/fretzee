# Feature Specification: Project Board Workflow Skills

**Feature Branch**: `feat/027-workflow-skills`  
**Created**: 2026-08-06  
**Status**: Draft  
**Input**: User description: "Implement the complete workflow automation for GitHub Project Board 3 with stage-gate skills: pick-issue (orchestrator), clarify-issue (to-clarify), spec-issue (to-specify), code-issue (to-implement). Label progression: selected -> clarified -> specified -> validate -> validated. Board columns: Idea, Clarification, Specification, Code, Done."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Updated Label Progression & Board Column Alignment (Priority: P1)

As a contributor or agent maintaining the Fretly repository, I want all agent skills (`pick-issue`, `clarify-issue`, `spec-issue`, `code-issue`) and documentation (`AGENTS.md`) aligned with the 5-stage GitHub Project Board 3 workflow (Idea → Clarification → Specification → Code → Done) and exact label progression (`selected` → `clarified` → `specified` → `validate` → `validated`).

**Why this priority**: Correct labels and stage alignment are the foundational contract for all workflow skills to hand off tasks correctly.

**Independent Test**: Can be tested by inspecting skill files (`.agents/skills/*/*.md`) and running `/pick-issue` on a board item to verify label checking and transition rules.

**Acceptance Scenarios**:

1. **Given** an issue in Clarification with label `selected`, **When** `/clarify-issue` processes it, **Then** it generates targeted clarifying questions in comments and leaves the issue in Clarification until user responds and adds `clarified`.
2. **Given** an issue in Specification with label `clarified`, **When** `/spec-issue` processes it, **Then** it creates a feature specification via Speckit, updates the label to `specified`, and moves status to Code.
3. **Given** an issue in Code with label `specified`, **When** `/code-issue` processes it, **Then** it executes the implementation, validates build/tests, updates the label to `validate`, and opens a PR.
4. **Given** an issue with label `validate` after user approval, **When** final validation completes, **Then** the label updates to `validated` and project board status moves to Done.

---

### User Story 2 - Automated Orchestrator Command (`/pick-issue`) (Priority: P2)

As a user, I want `/pick-issue` (or `/pick-issue <issue-number-or-url>`) to query Project Board 3 or open repository issues, inspect label/column status, and route to the correct stage agent (`clarify-issue`, `spec-issue`, `code-issue`) automatically.

**Why this priority**: Enables full end-to-end automation from a single command invocation.

**Independent Test**: Can be tested by invoking `/pick-issue https://github.com/sebastienferry/fretly/issues/<number>` and verifying it routes to the proper skill according to the label.

**Acceptance Scenarios**:

1. **Given** a specific issue URL or number passed as argument to `/pick-issue`, **When** executed, **Then** it picks that specific issue regardless of position in board.
2. **Given** an issue with no workflow labels or `selected`, **When** `/pick-issue` runs, **Then** it delegates to clarification flow.
3. **Given** an issue with `clarified`, **When** `/pick-issue` runs, **Then** it delegates to `/spec-issue`.
4. **Given** an issue with `specified`, **When** `/pick-issue` runs, **Then** it delegates to `/code-issue`.

---

### User Story 3 - Comprehensive Agent Documentation & Guidelines (Priority: P3)

As a repository maintainer, I want `AGENTS.md` and skill instructions (`SKILL.md` for each command) to document the stage-gate lifecycle, GitHub CLI commands for label/project item editing, and troubleshooting steps for missing permissions or missing labels.

**Why this priority**: Maintains repository documentation integrity per coding standards.

**Independent Test**: Can be verified by reviewing `AGENTS.md` and verifying that diagram and tables match implementation.

**Acceptance Scenarios**:

1. **Given** a reader of `AGENTS.md`, **When** examining the workflow diagram, **Then** it clearly shows: Idea (selected) → Clarification (clarified) → Specification (specified) → Code (validate) → Done (validated).

---

### Edge Cases

- What happens if a label does not exist on GitHub repository when `gh issue edit --add-label` is called? The workflow/agent creates or handles missing labels gracefully without crashing.
- What happens if an issue URL is provided (e.g. `https://github.com/sebastienferry/fretly/issues/27`)? The issue number (27) should be parsed cleanly.
- What happens if project board GraphQL item edit fails due to permission scope? Fall back gracefully to `gh issue` CLI commands.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST update `.agents/skills/clarify-issue/SKILL.md` to expect `selected` label and output `to-clarify` / keep in Clarification column until `clarified`.
- **FR-002**: System MUST update `.agents/skills/spec-issue/SKILL.md` to pick `clarified` issues, run Speckit specify/plan/tasks, and output `specified` label.
- **FR-003**: System MUST update `.agents/skills/code-issue/SKILL.md` to pick `specified` issues, execute Speckit implement, run tests/build/lint, update label to `validate`, and create PR.
- **FR-004**: System MUST update `.agents/skills/pick-issue/SKILL.md` to accept an optional issue number or URL argument, and orchestrate the transition through `selected` → `clarified` → `specified` → `validate` → `validated`.
- **FR-005**: System MUST update `AGENTS.md` to document the updated board columns (Idea, Clarification, Specification, Code, Done) and label progression (`selected` → `clarified` → `specified` → `validate` → `validated`).

### Key Entities

- **Workflow Stage**: A column on GitHub Project Board 3 (Idea, Clarification, Specification, Code, Done).
- **Workflow Label**: State indicator (`selected`, `to-clarify`, `clarified`, `specified`, `validate`, `validated`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 4 workflow skill documentation files (`pick-issue`, `clarify-issue`, `spec-issue`, `code-issue`) and `AGENTS.md` are completely updated and internally consistent.
- **SC-002**: `npm run build`, `npm run lint`, and `npm test` continue to pass with 100% test suite success.
- **SC-003**: End-to-end issue workflow successfully processes issue #27 following the specified label progression.

## Assumptions

- Project Board 3 is accessible via `gh` CLI.
- Standard git workflow uses feature branches created from `main`.
