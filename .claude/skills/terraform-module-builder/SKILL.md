# terraform-module-builder

Produce reusable infrastructure modules and validation checks.

## When to use
When defining cloud infrastructure as code with Terraform and reusability across environments is needed.

## Module structure
```
modules/<name>/
  main.tf        # resources
  variables.tf   # input variables with types and descriptions
  outputs.tf     # exported values
  versions.tf    # required_providers and terraform version
  README.md      # usage example
```

## Rules
- Every variable must have a description and type.
- Sensitive variables must be marked `sensitive = true`.
- Use `lifecycle { prevent_destroy = true }` on stateful resources in production.
- Run `terraform validate` and `terraform fmt` before committing.
- Pin provider versions with `~>` constraints.

## Validation
Add `validation` blocks to variables to catch bad inputs early:
```hcl
validation {
  condition     = length(var.name) <= 64
  error_message = "Name must be 64 characters or fewer."
}
```

## Source
Skill pattern
