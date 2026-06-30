# c-review

Run comprehensive C/C++ security review with structured findings.

## When to use
When auditing C or C++ code for security vulnerabilities, memory safety, or undefined behavior.

## Review categories
1. **Memory safety**: buffer overflows, use-after-free, double-free, uninitialized reads
2. **Integer issues**: signed/unsigned mismatch, truncation, overflow in array indexing
3. **Format string**: user-controlled format strings passed to printf-family
4. **Race conditions**: shared state accessed without synchronization
5. **Input validation**: trust boundaries, missing length checks
6. **Dangerous functions**: gets, strcpy, sprintf — flag all uses
7. **Pointer arithmetic**: bounds not checked before dereference

## Tools
- Clang static analyzer: `scan-build make`
- AddressSanitizer: `-fsanitize=address`
- UBSan: `-fsanitize=undefined`
- CodeQL for systematic pattern matching

## Output format
Finding: [Category] [File:Line] [Severity] Description + remediation.

## Source
Trail of Bits (trailofbits/skills)
