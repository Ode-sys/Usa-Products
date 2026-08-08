import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";

const API_KEY = process.env.PRINTFUL_API_KEY;
const BASE_URL = "https://api.printful.com";

if (!API_KEY) {
  process.stderr.write("Error: PRINTFUL_API_KEY environment variable is required\n");
  process.exit(1);
}

async function pf(path, method = "GET", body = null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Printful API error: ${res.status}`);
  return data.result ?? data;
}

const server = new McpServer({
  name: "printful",
  version: "1.0.0",
});

// ===== STORE PRODUCTS =====

server.tool(
  "get_store_products",
  "Get all synced products in your Printful store with their variants and prices",
  { limit: z.number().optional().describe("Max products to return (default 20)") },
  async ({ limit = 20 }) => {
    const data = await pf(`/store/products?limit=${limit}`);
    const items = Array.isArray(data) ? data : data.items ?? [];
    const summary = items.map(p => ({
      id: p.id,
      name: p.name,
      thumbnail: p.thumbnail_url,
      variants: p.variants,
      synced: p.synced,
    }));
    return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
  }
);

server.tool(
  "get_store_product",
  "Get detailed info about a single store product including all variants and sync status",
  { id: z.number().describe("Store product ID") },
  async ({ id }) => {
    const data = await pf(`/store/products/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ===== CATALOG =====

server.tool(
  "get_catalog_product",
  "Get a Printful catalog product details (blank product info, available colors/sizes)",
  { id: z.number().describe("Catalog product ID (e.g. 12 for Gildan 64000 T-shirt)") },
  async ({ id }) => {
    const data = await pf(`/products/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "search_catalog",
  "Search Printful product catalog by category or keyword",
  {
    category_id: z.number().optional().describe("Category ID to filter"),
    search: z.string().optional().describe("Search keyword"),
  },
  async ({ category_id, search }) => {
    let url = "/products";
    const params = [];
    if (category_id) params.push(`category_id=${category_id}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length) url += "?" + params.join("&");
    const data = await pf(url);
    const items = Array.isArray(data) ? data : data.items ?? [];
    const summary = items.slice(0, 30).map(p => ({
      id: p.id,
      title: p.title,
      type: p.type,
      type_name: p.type_name,
      brand: p.brand,
      model: p.model,
      image: p.image,
    }));
    return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
  }
);

// ===== MOCKUP GENERATOR =====

server.tool(
  "create_mockup",
  "Generate product mockup images by combining your design with a Printful product. Returns mockup image URLs.",
  {
    product_id: z.number().describe("Printful catalog product ID (e.g. 12 for Gildan T-shirt)"),
    variant_ids: z.array(z.number()).describe("Array of variant IDs to generate mockups for"),
    design_url: z.string().describe("Public URL of your design PNG/SVG (must be accessible)"),
    position: z.enum(["front", "back", "left", "right"]).optional().default("front"),
  },
  async ({ product_id, variant_ids, design_url, position = "front" }) => {
    const taskBody = {
      variant_ids,
      format: "jpg",
      files: [{ placement: position, image_url: design_url, position: { area_width: 1800, area_height: 2400, width: 1800, height: 1800, top: 300, left: 0 } }],
    };
    const task = await pf(`/mockup-generator/create-task/${product_id}`, "POST", taskBody);

    // Poll for result
    const taskKey = task.task_key;
    let result = null;
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const status = await pf(`/mockup-generator/task?task_key=${taskKey}`);
      if (status.status === "completed") { result = status; break; }
      if (status.status === "failed") throw new Error(`Mockup generation failed: ${status.error}`);
    }

    if (!result) throw new Error("Mockup generation timed out after 30s");

    const mockups = result.mockups?.map(m => ({
      placement: m.placement,
      mockup_url: m.mockup_url,
      extra: m.extra_mockups?.slice(0, 2).map(e => e.url),
    }));

    return { content: [{ type: "text", text: JSON.stringify({ task_key: taskKey, mockups }, null, 2) }] };
  }
);

server.tool(
  "get_mockup_templates",
  "Get available mockup templates for a catalog product (what angles/placements are available)",
  { product_id: z.number().describe("Catalog product ID") },
  async ({ product_id }) => {
    const data = await pf(`/mockup-generator/templates/${product_id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ===== ORDERS =====

server.tool(
  "get_orders",
  "Get orders from your Printful store with status and tracking info",
  {
    status: z.enum(["draft", "pending", "fulfilled", "canceled", "all"]).optional().default("all"),
    limit: z.number().optional().default(20),
  },
  async ({ status, limit }) => {
    let url = `/orders?limit=${limit}`;
    if (status && status !== "all") url += `&status=${status}`;
    const data = await pf(url);
    const items = Array.isArray(data) ? data : data.items ?? [];
    const summary = items.map(o => ({
      id: o.id,
      status: o.status,
      created: o.created,
      recipient: `${o.recipient?.name} - ${o.recipient?.country_code}`,
      items: o.items?.map(i => `${i.name} x${i.quantity}`),
      costs: o.costs,
      tracking: o.shipments?.map(s => s.tracking_url),
    }));
    return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
  }
);

server.tool(
  "get_order",
  "Get full details of a specific order",
  { id: z.number().describe("Order ID") },
  async ({ id }) => {
    const data = await pf(`/orders/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ===== SHIPPING =====

server.tool(
  "calculate_shipping",
  "Calculate shipping rates for products to a specific country/address",
  {
    recipient_country: z.string().describe("2-letter country code, e.g. US, CA, GB"),
    recipient_state: z.string().optional().describe("State code for US, e.g. CA, NY"),
    items: z.array(z.object({
      variant_id: z.number(),
      quantity: z.number(),
    })).describe("Items to ship"),
  },
  async ({ recipient_country, recipient_state, items }) => {
    const body = {
      recipient: { country_code: recipient_country, ...(recipient_state ? { state_code: recipient_state } : {}) },
      items,
    };
    const data = await pf("/shipping/rates", "POST", body);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ===== STORE INFO =====

server.tool(
  "get_store_info",
  "Get your Printful store info including name, currency, and settings",
  {},
  async () => {
    const data = await pf("/store");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_printful_countries",
  "Get list of countries Printful ships to",
  {},
  async () => {
    const data = await pf("/countries");
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// ===== START SERVER =====
const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("Printful MCP Server running\n");
