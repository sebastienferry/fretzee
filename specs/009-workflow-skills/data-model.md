# Data Model: Project Board Workflow Skills

## Entity Schema

### Issue Workflow State
- **`issue_number`**: number (e.g. 27)
- **`issue_url`**: string (e.g. `https://github.com/sebastienferry/fretly/issues/27`)
- **`current_label`**: `'selected'` | `'to-clarify'` | `'clarified'` | `'specified'` | `'validate'` | `'validated'`
- **`current_column`**: `'Idea'` | `'Clarification'` | `'Specification'` | `'Code'` | `'Done'`

### Workflow Transitions
1. `Clarification`: `selected` (or no label) → `/clarify-issue` → `to-clarify` (awaits user `clarified`)
2. `Specification`: `clarified` → `/spec-issue` → `specified`
3. `Code`: `specified` → `/code-issue` → `validate` (PR created)
4. `Done`: `validate` → user review/approval → `validated` (Issue closed / Project item Done)
