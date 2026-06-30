# devcontainer-setup

Create reproducible development containers with the right tools installed.

## When to use
When onboarding a new project, standardizing a team's dev environment, or ensuring CI and local environments match.

## Process
1. Create `.devcontainer/devcontainer.json` with the base image and features.
2. Add `postCreateCommand` to install project dependencies.
3. Include VS Code extensions list for automatic installation.
4. Forward required ports.
5. Mount any required secrets via environment variables (never bake secrets into the image).

## Template
```json
{
  "name": "Project Dev",
  "image": "mcr.microsoft.com/devcontainers/python:3.12",
  "features": { "ghcr.io/devcontainers/features/node:1": {} },
  "postCreateCommand": "pip install -r requirements.txt && npm install",
  "forwardPorts": [8000],
  "customizations": { "vscode": { "extensions": ["ms-python.python"] } }
}
```

## Source
Trail of Bits (trailofbits/skills)
