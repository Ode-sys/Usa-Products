# insecure-defaults

Find hardcoded credentials, fail-open behavior, and unsafe defaults.

## When to use
When auditing a new codebase, reviewing a PR, or doing a pre-deployment security check.

## What to scan for
1. **Hardcoded credentials**: passwords, API keys, tokens in source code or config files
2. **Fail-open behavior**: catch blocks that silently ignore auth failures
3. **Unsafe defaults**: debug mode on, verbose error messages, permissive CORS (`*`), no rate limiting
4. **Weak crypto defaults**: MD5, SHA1, ECB mode, hardcoded IV
5. **Insecure transport**: HTTP URLs for internal services, TLS verification disabled
6. **Default credentials**: unchanged admin/admin, root/root patterns

## Grep patterns
```bash
grep -rE "(password|secret|api_key)\s*=\s*['\"][^'\"]{3,}" .
grep -rE "verify\s*=\s*False" .
grep -rE "DEBUG\s*=\s*True" .
```

## Source
Trail of Bits (trailofbits/skills)
