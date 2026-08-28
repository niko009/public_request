# public_request

Public staging repository for external contributions to Bacus projects.

This repository is **not** the production source of truth. It is an exchange area where external AI agents, collaborators, or tools can prepare code changes without receiving direct write access to the real project repositories.

## Workflow

1. Pick the target project.
2. Create or use a branch dedicated to that project and change.
3. Commit only files related to that project/change.
4. Open a Pull Request into `main` in `public_request` when the work is ready for review.
5. The maintainer reviews the result.
6. Approved code is manually transferred/cherry-picked/adapted into the real project repository.
7. The final production commit is created in the real repository, not here.

## Branch naming

Use this format:

`<project>/<type>/<short-description>`

Examples:

- `bacus-dev/feature/new-project-card`
- `bacus-dev/fix/mobile-header`
- `bacus-dev/snapshot/current-site`
- `nutriguru/feature/meal-planner`
- `cosmic-fight/fix/battle-ui`
- `racing-merge/design/new-garage`

Allowed types:

- `feature` — new functionality
- `fix` — bug fix
- `design` — UI/UX or visual changes
- `refactor` — code restructuring without intended behavior change
- `content` — text/content changes
- `experiment` — exploratory work that may not be accepted
- `snapshot` — clean baseline mirror of the current project code

Do not use generic branches such as `test`, `changes`, `update`, `new`, or `grok`.

## Project folders

Each project lives in its own top-level folder:

```text
projects/
  bacus.dev/
  nutriguru/
  cosmic-fight/
  racing-merge/
  ...
```

External contributors must change only the folder of the target project unless the task explicitly requires otherwise.

## Rules for external AI agents and contributors

- Never commit secrets, API keys, tokens, passwords, `.env` files, certificates, private keys, database dumps, server credentials, or production configuration.
- Do not add GitHub Actions, deployment scripts, server automation, infrastructure configuration, SSH configuration, or secret-management files unless explicitly requested.
- Do not modify another project's folder in the same branch.
- Keep commits focused and understandable.
- Prefer several small logical commits over one unrelated bulk commit.
- Do not force-push over another contributor's work unless explicitly coordinated.
- Do not treat this repository's `main` as production. Production changes happen only after maintainer review and transfer to the real repository.

## Commit messages

Recommended format:

`<type>(<project>): <summary>`

Examples:

- `feat(bacus-dev): add interactive project preview`
- `fix(bacus-dev): correct mobile navigation overflow`
- `design(racing-merge): redesign garage cards`

## Pull Requests

A PR should contain:

- target project;
- short description of the change;
- what was tested;
- screenshots for visual changes when possible;
- any known limitations or unfinished parts.

Suggested title:

`[bacus.dev] Improve project cards`

## bacus.dev snapshot

A clean code snapshot of the current `bacus.dev` website is stored in:

`projects/bacus.dev/`

Only website source/build files are mirrored there. Bacus factory documentation, deployment tooling, server scripts, internal build records, and test markers from the private source repository are intentionally excluded.

Current mirror includes:

- `src/`
- `public/`
- `package.json`
- `astro.config.mjs`
- `.gitignore`

The real production repository remains the source of truth for deployment and release history.
