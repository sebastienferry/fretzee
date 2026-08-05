---
name: create-pr
description: Push code to GitHub using gh CLI and create a PR if not existing
---

# Create Pull Request (`/create-pr`)

This skill pushes local commits/changes to GitHub and ensures a Pull Request exists for the current branch using the GitHub CLI (`gh`).

## Workflow Steps

### 1. Prerequisites Check
Verify that `git` and `gh` are installed and configured:
```bash
git rev-parse --is-inside-work-tree
gh auth status
```
- If `gh` is not installed or not logged in, inform the user:
  - Install: `brew install gh` (macOS) or refer to https://cli.github.com
  - Login: `gh auth login`

### 2. Branch & Working Tree Validation
- Get current branch:
  ```bash
  git branch --show-current
  ```
- **Main/Master Safeguard**: If the current branch is `main` or `master`, warn the user and avoid pushing directly to main/master unless explicitly instructed. Suggest creating a feature branch:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Check working tree status:
  ```bash
  git status --porcelain
  ```
- **Automatic Semantic Commit Generation**: If there are uncommitted changes:
  - Inspect changed files and content:
    ```bash
    git diff
    git diff --cached
    ```
  - **Analyze Changes & Determine Semantic Type**:
    - `feat:` New feature or functionality added
    - `fix:` Bug fix or issue resolution
    - `docs:` Documentation changes only
    - `style:` Formatting, missing semi-colons, white-space changes
    - `refactor:` Code change that neither fixes a bug nor adds a feature
    - `test:` Adding missing tests or correcting existing tests
    - `chore:` Maintenance tasks, build/tooling configuration, skills updates
  - **Construct Semantic Commit Message**:
    - **Header**: `<type>(<scope>): <short summary in imperative present tense>` (e.g., `chore(skills): add create-pr skill for github workflow`)
    - Keep summary under 72 characters.
  - **Stage & Commit**:
    ```bash
    git add -A
    git commit -m "<semantic-header>" -m "<optional detailed body>"
    ```

### 3. Push to Remote Repository
- Push current branch to remote repository and set upstream tracking if needed:
  ```bash
  git push -u origin <current-branch>
  ```

### 4. Check for Existing Pull Request
- Search for an open PR for the current branch:
  ```bash
  gh pr list --head $(git branch --show-current) --json number,title,url,state
  ```
- **If PR exists**:
  - Do NOT create a duplicate PR.
  - Display the existing PR status and link to the user:
    > "Pull Request already exists: [#<number> <title>](<url>)"
  - Inform the user that the branch was pushed and the existing PR has been updated.

- **If PR does NOT exist**:
  - Generate a clear PR Title and Body based on branch commits (`git log origin/main..HEAD --oneline`):
    - **Title**: Concise overview matching commit subject.
    - **Body**: Detailed summary of changes, motivation, and verification tests run.
  - Create the Pull Request using GitHub CLI:
    ```bash
    gh pr create --title "<PR Title>" --body "<PR Description>"
    ```
  - Output the generated PR URL to the user.

## Command Usage

- `/create-pr` - Automatically pushes local changes and creates or references the GitHub PR.
