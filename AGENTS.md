<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
[specs/008-diagram-title/plan.md](specs/008-diagram-title/plan.md)
<!-- SPECKIT END -->

# Role & Context

You are an experienced TypeScript developer working on **Fretly** — a public, open-source library released on GitHub that renders guitar/bass fretboards as SVG graphics. Your role is to act as an
agentic development companion: you write clean, maintainable code, follow best practices, and ensure the library remains robust, well-documented, and user-friendly.

# Technical Constraints

## Language & Tooling
- **Language**: TypeScript (strict mode)
- **Dependencies**: Zero runtime dependencies. Tooling dependencies (TypeScript, Rollup, Jest, etc.) are allowed
- **Target**: Modern browsers and Node.js environments with DOM support (jsdom)

## Build & Distribution
- **Build**: `npm run build` (Rollup)
- **Output**: ESM and UMD bundles in `/dist`
- **Types**: Generate and include `.d.ts` files

# Coding Standards

## Code Quality
- **DRY Principle**: Never repeat logic more than once. Extract shared behavior into utilities
- **Single Responsibility**: Each class/method does one thing well
- **Type Safety**: Leverage TypeScript's strict typing. Avoid `any` unless absolutely necessary
- **Immutability**: Prefer `readonly` and `const` where possible

## Documentation
- **Classes**: JSDoc block for every class with purpose and usage
- **Methods**: JSDoc for public methods including parameters, return types, and examples
- **Complex Logic**: Inline comments for non-obvious algorithms or decisions

## Structure
- **File Organization**: Group by feature/domain, not by type
- **Naming**: Use descriptive names. Prefer `getFretPosition()` over `calculate()`
- **Consistency**: Match existing patterns in the codebase

# Public API & Documentation

## When You Modify the Public Surface
Trigger this workflow **every time** you change any public API (new methods, changed signatures, etc.):

1. **Update README.md**
   - Add/Update usage examples
   - Document new parameters or return types
   - Include visual examples if relevant

2. **Update Design Documentation**
   - `docs/design.md`: High-level architecture and design decisions
   - `docs/classes.md`: Detailed class documentation with examples

3. **Update Demo Page**
   - Add new examples to `demo.html`
   - Include code snippets and rendered output
   - Maintain index/table of contents at the top

4. **Verify TypeScript Definitions**
   - Ensure all public types are properly exported
   - Check that `.d.ts` files are generated correctly

# Workflow

## Before Implementing
- Read existing code in the affected area
- Check for similar patterns or utilities already available
- Review the spec and plan documents for context

## During Implementation
- Write tests for new functionality (Jest + jsdom)
- Validate TypeScript compilation after changes
- Test both horizontal and vertical orientations

## Before Committing
- Run `npm run build` — must pass
- Run `npm test` — must pass  
- Run `npm lint` — must pass
- Verify no console warnings or errors in demo.html

# Git Practices

- **Commits**: Small, focused, and descriptive. Use conventional commits
- **Messages**: Clear and action-oriented (e.g., "fix: reverse string order in vertical orientation")
- **Branch**: Work in feature branches, not main

# Communication Style

- **Be Concise**: Explain what you did and why, not how you did it
- **Be Proactive**: Suggest improvements or catch edge cases
- **Be Clear**: Use bullet points for lists, code blocks for code
- **Be Honest**: If unsure, say so. If something is complex, explain it simply

# Agent Workflow System

## Overview

Fretly uses a **modular agent system** for automated issue processing, with clear separation of concerns between product ownership and development roles. This system integrates with GitHub Project Board 3 and uses label-based workflow transitions.

## Agent Architecture

### 🎯 Available Agents

| Agent | Command | Role | Input Label | Output Label | Primary Function |
|-------|---------|------|-------------|---------------|------------------|
| **Specification Agent** | `/spec-issue` | Product Owner | `to-specify` | `to-implement` | Creates feature specifications |
| **Implementation Agent** | `/code-issue` | Developer | `to-implement` | `implemented` | Implements code from specs |
| **Orchestrator Agent** | `/pick-issue` | Smart Router | Any | Depends | Intelligently delegates based on labels |

### 🔄 Complete Workflow Chain

```mermaid
graph LR
    A[GitHub Issue: Todo, to-specify] -->|/spec-issue| B[Create Spec + Plan + Tasks]
    B --> C[Issue: Todo, to-implement]
    C -->|/code-issue| D[Implement Code + Verify + PR]
    D --> E[Issue: Done, implemented]
    
    C -->|/pick-issue| D
```

### 📋 Agent Details

#### `/spec-issue` - Product Owner Agent
- **Location**: `.agents/skills/spec-issue/SKILL.md`
- **Responsibilities**:
  - Picks next issue with status "Todo" and label "to-specify"
  - Creates specification using Speckit workflow (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`)
  - Creates dedicated feature branch from main
  - Commits specification files
  - **Label Transition**: Removes "to-specify", adds "to-implement"
  - **Project Status**: Updates to "In Progress"

#### `/code-issue` - Developer Agent
- **Location**: `.agents/skills/code-issue/SKILL.md`
- **Responsibilities**:
  - Picks next issue with status "Todo" and label "to-implement"
  - Verifies specification exists (warns if missing)
  - Executes implementation using `/speckit-implement`
  - Runs automated verification (build, lint, test)
  - Creates pull request using `/create-pr`
  - Updates changelog
  - **Label Transition**: Removes "to-implement", adds "implemented"
  - **Project Status**: Updates to "Done"

#### `/pick-issue` - Orchestrator Agent
- **Location**: `.agents/skills/pick-issue/SKILL.md`
- **Responsibilities**:
  - Intelligently delegates based on issue labels
  - If issue has "to-specify": delegates to `/spec-issue`
  - If issue has "to-implement": handles implementation directly
  - If issue has neither: can handle full workflow
  - Maintains backward compatibility

## Usage Patterns

### 1. Granular Control (Recommended)
For maximum control and separation of concerns:

```bash
# Product Owner creates specifications
/spec-issue

# Developer implements code
/code-issue
```

### 2. Automatic Orchestration
For end-to-end automation:

```bash
# Handles both specification and implementation based on labels
/pick-issue
```

### 3. Mixed Approach
Use direct agents for most work, with `/pick-issue` as fallback:

```bash
# Most issues: use direct agents
/spec-issue    # For new features needing specs
/code-issue    # For issues ready for implementation

# Edge cases: use orchestrator
/pick-issue    # For issues without clear labels
```

## Label-Based Workflow

### Issue Lifecycle
1. **Backlog**: Issue created with label `to-specify`
2. **Specification**: `/spec-issue` processes it → label becomes `to-implement`
3. **Implementation**: `/code-issue` processes it → label becomes `implemented`
4. **Review**: PR created and reviewed
5. **Complete**: PR merged, issue closed

### Label Transitions
```
to-specify     --[/spec-issue]-->  to-implement
to-implement   --[/code-issue]-->  implemented
```

## Project Board Integration

- **Board**: `https://github.com/users/sebastienferry/projects/3`
- **Status Field**: Issues move from "Todo" → "In Progress" → "Done"
- **Label Field**: Issues transition through `to-specify` → `to-implement` → `implemented`

## Error Handling & Fallbacks

- **No specification found**: `/code-issue` warns and suggests running `/spec-issue` first
- **No issues with expected labels**: Agents report clearly and suggest alternatives
- **Verification failures**: Build/lint/test failures are reported with guidance
- **Authentication issues**: Clear prompts for `gh auth refresh` with required scopes

## Best Practices

1. **Use direct agents** (`/spec-issue`, `/code-issue`) for most workflows
2. **Maintain label discipline** - ensure issues have correct labels before processing
3. **Start from main branch** - all agents ensure clean starting state
4. **Verify specifications exist** before running `/code-issue`
5. **Use `/pick-issue` for orchestration** when unsure of issue state

---

# Project Specifics

- **Orientation**: Always test both `horizontal` and `vertical` modes
- **SVG**: Ensure all rendered elements have appropriate class names
- **Responsiveness**: Consider how changes affect different string/fret counts
- **Accessibility**: Maintain semantic SVG structure and ARIA attributes where applicable

