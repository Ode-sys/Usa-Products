# Domain 05: Security & Audit
*Source: Trail of Bits skills (5.5k stars)*

## Skills 41–50

### insecure-defaults checklist
- [ ] No hardcoded credentials
- [ ] No `debug=True` in production
- [ ] No wildcard CORS (`*`)
- [ ] Input validation on all endpoints
- [ ] SQL parameterized queries only
- [ ] Secrets in env vars, never in code
- [ ] HTTPS enforced everywhere
- [ ] Rate limiting on auth endpoints

### supply-chain-risk-auditor
```bash
# Check for known vulnerabilities
pip audit  # Python
npm audit  # Node.js

# Check package provenance
pip show <package> | grep -E "Home-page|Author"
```

### differential-review
When reviewing code changes:
1. Read git diff first (not the full file)
2. Focus on: auth changes · data flow · new dependencies
3. Ask: "What's the worst thing this change could do?"
4. Check: error handling paths specifically

### audit-context-building
Before making security claims:
1. Map the attack surface (entry points)
2. Identify trust boundaries
3. Trace data from input to storage to output
4. Only then identify vulnerabilities
