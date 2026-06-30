# supply-chain-risk-auditor

Review dependencies, install scripts, package risk, and provenance.

## When to use
Before adding a new dependency, or as part of a periodic security audit of an existing project.

## Process
1. List all direct dependencies and their versions.
2. Check for known CVEs: `npm audit`, `pip-audit`, `cargo audit`, `trivy`.
3. Review maintainer reputation: stars, last publish date, maintainer count, npm/PyPI download trends.
4. Inspect `postinstall` scripts (npm) or `setup.py` for unexpected network calls or exec.
5. Check for typosquatting risk on package names.
6. Verify package provenance: is there a published SBOM or SLSA provenance attestation?

## Risk signals
- Package published recently by a new account
- Sudden spike in a dependency's permissions or network calls
- Install scripts that download additional binaries
- No source repo link on the registry page

## Source
Skill pattern
