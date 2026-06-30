# ci-cd-pipeline-design

Create multi-stage pipelines with tests, scans, artifacts, and approvals.

## When to use
When setting up or redesigning a CI/CD pipeline for a project.

## Pipeline stages
1. **Lint & format check** — fast, fails early
2. **Unit tests** — parallel by module
3. **Integration tests** — against real services (Docker Compose)
4. **Security scan** — SAST, dependency audit
5. **Build artifacts** — Docker image, binary, package
6. **Staging deploy** — auto on merge to main
7. **Smoke tests** — verify staging is healthy
8. **Production deploy** — manual approval gate or auto on tag

## Rules
- Fail fast: put the cheapest checks first.
- Never deploy to production without a passing test stage.
- Pin all action versions to commit SHAs.
- Store artifacts for at least 30 days.

## Source
Skill pattern
