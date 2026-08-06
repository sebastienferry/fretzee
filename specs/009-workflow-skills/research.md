# Research & Design: Project Board Workflow Skills

## Stage & Label Mapping

| Board Column | Primary Input Label | Agent / Tool | Output Label | Target Status |
|--------------|---------------------|--------------|--------------|---------------|
| **Idea** | `selected` | User / Lead | `selected` | Idea |
| **Clarification** | `selected` | `/clarify-issue` | `to-clarify` | Clarification |
| **Clarification** | `to-clarify` | User response | `clarified` | Clarification |
| **Specification** | `clarified` | `/spec-issue` | `specified` | Specification → Code |
| **Code** | `specified` | `/code-issue` | `validate` | Code |
| **Done** | `validate` | User approval | `validated` | Done |

## Label Progression
```
selected → clarified → specified → validate → validated
```
