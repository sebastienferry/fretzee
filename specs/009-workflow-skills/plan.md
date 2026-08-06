# Implementation Plan: Project Board Workflow Skills

**Branch**: `feat/027-workflow-skills` | **Date**: 2026-08-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/009-workflow-skills/spec.md`

## Summary

Implement stage-gate workflow skills (`pick-issue`, `clarify-issue`, `spec-issue`, `code-issue`) aligned with GitHub Project Board 3 stage columns (Idea → Clarification → Specification → Code → Done) and label progression (`selected` → `clarified` → `specified` → `validate` → `validated`). Update `AGENTS.md` and related agent documentation.

## Technical Context

**Language/Version**: Markdown / Bash / GitHub CLI (`gh`)  
**Primary Dependencies**: None  
**Testing**: Skill verification & repo validation (`npm run build`, `npm run lint`, `npm test`)  
**Target Platform**: GitHub CLI / Agent workflow environment  
**Project Type**: Open Source TypeScript Library & Agent Workflow Infrastructure  

## Constitution Check

- [x] **Zero Runtime Dependencies**: No runtime npm dependencies added.
- [x] **DRY / Script Reuse**: Reuses existing Speckit and agent workflow structures.
- [x] **Backward Compatibility**: Supports existing CLI invocations while expanding workflow label transitions.

## Project Structure

```text
.agents/skills/
├── pick-issue/SKILL.md      # Update orchestrator to parse issue argument & handle stages
├── clarify-issue/SKILL.md   # Update clarification agent for 'selected' -> 'to-clarify' -> 'clarified'
├── spec-issue/SKILL.md      # Update specification agent for 'clarified' -> 'specified'
└── code-issue/SKILL.md      # Update developer agent for 'specified' -> 'validate' -> 'validated'

AGENTS.md                    # Update workflow diagrams, label progression & agent table

specs/009-workflow-skills/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| *None* | *Standard markdown/doc updates* | *N/A* |
