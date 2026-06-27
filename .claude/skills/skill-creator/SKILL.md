# skill-creator

Design new custom skills from repeatable workflows and standards.

## When to use
When a workflow is done repeatedly and should be encoded as a reusable Claude skill.

## Process
1. Identify the repeatable workflow: what task is done over and over?
2. Define the trigger: when should this skill activate?
3. Write the process steps: ordered, specific, actionable.
4. Define the output: what does the skill produce?
5. Add rules and guardrails: what should the skill never do?
6. Create the directory: `.claude/skills/<skill-name>/SKILL.md`
7. Test the skill by invoking it on a real example.

## SKILL.md template
```markdown
# skill-name

One-line description.

## When to use
...

## Process
1. ...
2. ...

## Rules
- ...

## Output
...
```

## Source
Anthropic (anthropics/skills)
