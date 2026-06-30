# Domain 04: DevOps & Cloud
*Source: Trail of Bits + Superpowers*

## Skills 31–40

### ci-cd-pipeline-design
```yaml
# Standard pipeline stages
stages:
  - lint        # fast feedback
  - test        # unit + integration
  - security    # SAST scan
  - build       # artifact creation
  - deploy-staging
  - smoke-test
  - deploy-prod  # manual gate
```

### devcontainer-setup
```json
{
  "name": "ode-dev",
  "image": "mcr.microsoft.com/devcontainers/python:3.11",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {"version": "20"},
    "ghcr.io/devcontainers/features/git:1": {}
  },
  "postCreateCommand": "pip install -r requirements.txt --break-system-packages"
}
```

### git-cleanup
```bash
# Safe cleanup pattern
git branch --merged | grep -v "main\|master\|develop" | xargs -r git branch -d
git remote prune origin
git gc --prune=now
```

### incident-runbook-templates
```markdown
## Incident: [NAME]
**Severity:** P1/P2/P3
**Owner:** 
**Started:**

### Detection
### Impact
### Steps to Resolve
1. 
### Verification
### Post-mortem due:
```
