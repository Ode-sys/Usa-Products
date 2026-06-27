# database-migration

Plan zero-downtime schema changes, rollbacks, and data checks.

## When to use
Before making any schema change to a production database.

## Process
1. Write the migration script (Alembic, Flyway, or raw SQL).
2. Write the rollback script before deploying forward.
3. Test on a staging database with production-size data.
4. Plan the deployment sequence for zero downtime:
   - Add column nullable first (no downtime)
   - Deploy app code that handles both old and new schema
   - Backfill data
   - Add constraints / drop old column
5. Verify row counts and data integrity after migration.

## Zero-downtime rules
- Never drop a column in the same deploy that removes app references to it.
- Never add a NOT NULL column without a default or backfill step.
- Always test rollback before going live.

## Source
Skill pattern
