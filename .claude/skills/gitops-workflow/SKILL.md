# gitops-workflow

Structure ArgoCD or Flux style infrastructure delivery from Git.

## When to use
When the team wants infrastructure changes to be driven by Git commits rather than manual kubectl or Terraform commands.

## Structure
```
infra/
  apps/
    production/    # ArgoCD Application manifests
    staging/
  base/            # shared Kustomize base manifests
  overlays/
    production/    # environment-specific patches
    staging/
```

## ArgoCD Application template
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: https://github.com/org/infra
    path: overlays/production
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Source
Skill pattern
