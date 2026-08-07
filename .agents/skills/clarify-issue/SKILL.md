---
name: clarify-issue
description: Pick up the next Todo item from the GitHub project board and ask clarifying questions in comments, adding the to-clarify label.
---

# Clarification Agent Workflow (`/clarify-issue`)

This skill acts as a clarification agent responsible for asking targeted questions about GitHub project board issues that need more information before specification can begin. It picks up the next issue with status "Todo", asks clarifying questions as comments, and adds the "to-clarify" label.

---

## Target Project Board Context

- **Board URL**: `https://github.com/users/sebastienferry/projects/3`
- **Owner**: `sebastienferry`
- **Project Number**: `3`

---

## Workflow Steps

### Step 1: Check Prerequisites & Authentication

1. **Verify GitHub CLI Authentication**:
   Ensure `gh` CLI has project access permissions:
   ```bash
   gh auth status
   ```
   *If scope error occurs (`missing required scopes [read:project]`), prompt the user to run:*
   ```bash
   gh auth refresh -s project,read:project,write:project
   ```

---

### Step 2: Query & Pick Next Issue from Project Board

1. **Fetch Project Items**:
   Query items from Project Board 3:
   ```bash
   gh project item-list 3 --owner sebastienferry --format json
   ```

2. **Filter and Select Target Issue**:
   - Filter items matching `status == "Todo"` AND NOT having labels `"to-clarify"`, `"clarified"`, `"to-specify"`, `"to-implement"`, or `"implemented"`
   - Select the **first matching item** (oldest first)
   - Extract: `ISSUE_NUM`, `ISSUE_TITLE`, `ISSUE_BODY`, `ISSUE_LABELS`, `ITEM_ID`, and `NODE_ID`

3. **Fallback (if project CLI fails)**:
   Query repository open issues:
   ```bash
   gh issue list --owner sebastienferry --repo fretly --state open --json number,title,body,labels,projectItems
   ```
   - Filter issues with status "Todo" and without clarification/specification labels
   - Select the first matching issue

---

### Step 3: Analyze Issue and Generate Clarifying Questions

1. **Analyze Issue Content**:
   - Read the issue title, body, and any existing comments
   - Identify ambiguous or underspecified areas
   - Look for missing information such as:
     - Acceptance criteria
     - Technical requirements
     - Design preferences
     - Edge cases to consider
     - Dependencies or constraints

2. **Generate Targeted Questions**:
   - Use the `/speckit-clarify` skill to identify underspecified areas:
   ```bash
   /speckit-clarify
   ```
   - Generate 3-5 specific, targeted questions that would help clarify the requirements
   - Questions should be:
     - **Specific**: Address concrete aspects of the feature/bug
     - **Actionable**: Lead to clear answers that inform specification
     - **Non-redundant**: Don't ask about information already provided

---

### Step 4: Clarification Interview & Comment

1. **Interactive Chat Mode (When user is present in conversation)**:
   - Use the `ask_question` tool directly in the chat session to interview the user about key design choices.
   - Summarize agreed answers and post the technical clarification summary as an issue comment.
   - Update issue label from `to-clarify` to `clarified`.

2. **Async Mode (When issue picked in background / unattended)**:
   - Format questions as an issue comment.
   - Post comment to GitHub Issue:
     ```bash
     gh issue comment <ISSUE_NUM> --body "<FORMATTED_QUESTIONS>"
     ```
   - Add `to-clarify` label and wait for user input.

---

### Step 5: Add "to-clarify" Label

1. **Add Clarification Label**:
   ```bash
   gh issue edit <ISSUE_NUM> --add-label "to-clarify"
   ```

2. **Preserve Existing Labels**:
   - Keep any existing labels that don't conflict with the workflow
   - Only add "to-clarify", don't remove other labels

---

### Step 6: Update Project Board Status (Optional)

The issue should remain in "Todo" status until the user manually changes the label to "clarified". However, you can optionally add a custom field or note to track that clarification is in progress.

---

## Workflow Transition

### From Clarification to Specification

1. **User Provides Answers**:
   - User responds to the clarifying questions in comments
   - User may add additional information to the issue description

2. **User Signals Readiness**:
   - User manually changes the label from "to-clarify" to "clarified"
   - User can also add "to-specify" label at this point

3. **Automatic Detection**:
   - The `/spec-issue` or `/pick-issue` agents should detect issues with "clarified" label
   - When "clarified" label is present, the agent should:
     - Remove "clarified" label
     - Add "to-specify" label
     - Update project board status from "Todo" to "In Progress"
     - Proceed with specification workflow

---

## Error Handling

1. **No Issues Found**:
   - If no issues with status "Todo" and without workflow labels are found, report:
     > "No issues found with status 'Todo' that need clarification in project board 3."
   - Suggest checking for issues with "to-clarify" label that might need follow-up

2. **Authentication Failed**:
   - If `gh` CLI authentication fails, prompt user to run:
     ```bash
     gh auth login
     gh auth refresh -s project,read:project,write:project
     ```

3. **Comment Posting Failed**:
   - If posting the comment fails, retry once
   - If still failing, provide the formatted questions to the user to post manually

---

## Output

The skill should output:
- **Issue Selected**: Issue number and title
- **Questions Posted**: The clarifying questions that were posted as a comment
- **Label Added**: Confirmation that "to-clarify" label was added
- **Next Steps**: Instructions for the user on how to proceed

---

## Example Usage

User invokes:
```
/clarify-issue
```

Agent responds with:
```
## Clarification Agent Started

**Issue Selected**: #45 - "Add chord diagram support"
**Questions Posted**: 
1. What guitar tunings should be supported for chord diagrams?
2. Should the chord diagrams show finger positions, note names, or both?
3. What's the expected output format (SVG, PNG, interactive)?
4. Are there any specific chord types that should be prioritized?
5. Should this integrate with the existing fretboard rendering or be separate?

**Label Added**: "to-clarify"
**Project Status**: Remains "Todo" (will move to "In Progress" when labeled "clarified")

**Next Steps**:
- User should answer the questions in the issue comments
- User should change label from "to-clarify" to "clarified" when ready
- Then run `/spec-issue` or `/pick-issue` to start specification
```

---

## Workflow Integration

This agent integrates with the existing workflow as follows:

1. **Before `/spec-issue`**: Issues that need clarification are processed by this agent first
2. **Before `/code-issue`**: Ensures specifications are based on clear requirements
3. **With `/pick-issue`**: The orchestrator can delegate to this agent when clarification is needed

The complete workflow becomes:
```
/clarify-issue   → Asks questions, transitions to "to-clarify"
[User answers]   → User provides clarification in comments
[User action]   
/spec-issue     → Detects "clarified", transitions to "to-specify", starts specification
/code-issue     → Implements code, transitions "to-implement" → "implemented"
```

---

## Agent Responsibilities

| Agent | Role | Input Label / Column | Output Label | Primary Command |
|-------|------|----------------------|---------------|-----------------|
| `/clarify-issue` | Clarification | `selected` (Clarification column) | `to-clarify` | Ask questions in comments |
| `/spec-issue` | Product Owner | `clarified` (Specification column) | `specified` | `/speckit-specify` |
| `/code-issue` | Developer | `specified` (Code column) | `validate` / `validated` | `/speckit-implement` |
| `/pick-issue` | Orchestrator | Any | Depends on input | Delegates as needed |

---

## Notes

- This agent focuses only on clarification, not specification or implementation
- It helps ensure that specifications are based on clear, complete requirements
- The agent does not automatically transition issues - user must manually signal readiness by changing the label to "clarified"
- Issues remain in "Todo" status until they are ready for specification work to begin