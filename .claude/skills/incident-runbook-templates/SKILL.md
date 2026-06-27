# incident-runbook-templates

Create clear operational playbooks for outages and escalation.

## When to use
Before a service goes to production, or after a post-mortem identifies a gap in response procedures.

## Runbook structure
```markdown
# Incident: <Name>

## Severity: P1 / P2 / P3
## Owner: <team>
## Last tested: <date>

## Symptoms
- What does the alert look like?
- What do users report?

## Diagnosis steps
1. Check <dashboard link>
2. Run: `kubectl get pods -n <namespace>`
3. Check logs: `kubectl logs -l app=<name> --tail=100`

## Remediation
- If X: do Y
- If Z: escalate to <team> via <channel>

## Rollback
`kubectl rollout undo deployment/<name>`

## Post-incident
- [ ] Update status page
- [ ] Write post-mortem within 48h
```

## Source
Skill pattern
