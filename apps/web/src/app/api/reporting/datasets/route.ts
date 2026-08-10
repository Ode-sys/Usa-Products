import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth-middleware";
import { apiSuccess, apiError, apiValidationError } from "@/lib/api-response";
import { db } from "@ode/database";
import { getPaginationOffset } from "@ode/shared";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  fileId: z.string().uuid().optional(),
});

export const GET = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const { searchParams } = new URL(authReq.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));

    const where = { tenantId: ctx.tenantId };
    const [datasets, total] = await Promise.all([
      db.reportingDataset.findMany({
        where,
        ...getPaginationOffset({ page, limit }),
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, description: true, rowCount: true, columnCount: true, columns: true, createdAt: true },
      }),
      db.reportingDataset.count({ where }),
    ]);

    return apiSuccess({ items: datasets, total, page, limit, totalPages: Math.ceil(total / limit) });
  }, { module: "REPORTING_AI" });

export const POST = (req: NextRequest) =>
  withAuth(req, async (authReq, ctx) => {
    const body = await authReq.json().catch(() => ({}));
    const parse = createSchema.safeParse(body);
    if (!parse.success) return apiValidationError(parse.error.issues);

    const { name, description, fileId } = parse.data;

    const dataset = await db.reportingDataset.create({
      data: {
        tenantId: ctx.tenantId,
        name,
        description,
        fileId,
        rowCount: 0,
        columnCount: 0,
        columns: [],
        data: [],
        createdById: ctx.userId,
      },
    });

    return apiSuccess({ dataset }, 201);
  }, { module: "REPORTING_AI", permission: "reporting.datasets.manage" });
