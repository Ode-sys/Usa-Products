# burpsuite-project-parser

Extract useful evidence and targets from Burp Suite project files.

## When to use
When a penetration test or bug bounty engagement provides a Burp Suite project file and you need to extract targets, requests, or findings.

## What to extract
1. **Scope**: in-scope hosts and URL patterns
2. **Interesting requests**: authentication endpoints, API calls, file uploads
3. **Findings**: any issues Burp Scanner flagged
4. **Session tokens**: identify token patterns and entropy
5. **Discovered endpoints**: from the sitemap and proxy history

## Process
1. Export project items as XML or use the Burp REST API.
2. Parse the XML to extract request/response pairs.
3. Identify unique endpoints and HTTP methods.
4. Flag requests with interesting parameters (id, token, file, redirect, etc.).
5. Summarize scope, interesting targets, and any scanner findings.

## Source
Trail of Bits (trailofbits/skills)
