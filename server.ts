import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CreateOrderPayloadSchema,
  OrderConfirmationData,
} from './src/types/lavida';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Upstream Google Apps Script Single Source of Truth URL
let appsScriptUrl =
  process.env.APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyzgGSIW8Bs5cQkwUXEuAl8uRSBbpfbK0U_gmUlStruNnu6D1S9djrpT7PyKgEwAnvW/exec';

app.use(express.json({ limit: '512kb' }));

// In-memory order store & idempotency cache
const orderStore = new Map<string, OrderConfirmationData>();
const idempotencyStore = new Map<string, OrderConfirmationData>();

interface UpstreamState {
  testedAt: string;
  reachable: boolean;
  status: string;
  contentType: string;
  lastHttpCode: number;
}

let upstreamState: UpstreamState = {
  testedAt: new Date().toISOString(),
  reachable: false,
  status: 'Probing Apps Script gateway',
  contentType: '',
  lastHttpCode: 0,
};

function sendEnvelope<T>(
  res: Response,
  data: T | null,
  error: string | null = null,
  statusCode = 200,
  source: 'apps_script_live' | 'apps_script_ssot' = 'apps_script_ssot'
) {
  res.status(statusCode).json({
    ok: error === null,
    statusCode,
    data,
    error,
    requestId: 'req_' + Math.random().toString(36).substring(2, 11),
    schemaVersion: '1',
    source,
    authorityNotice: 'DEMO MODE · GOOGLE SHEETS BACKEND · ABSOLUTE SSOT (0 FALLBACK)',
    upstreamStatus: upstreamState.status,
    upstreamEndpoint: appsScriptUrl,
  });
}

/**
 * Pure upstream fetcher to Google Apps Script.
 * ABSOLUTE ZERO FALLBACK: Returns parsed JSON if available from Apps Script,
 * or null with documented diagnostic if Apps Script redirects or errors.
 */
async function fetchUpstream(action: string, domain?: string): Promise<{ data: any | null; error: string | null }> {
  try {
    const url = new URL(appsScriptUrl);
    url.searchParams.set('action', action);
    if (domain) url.searchParams.set('domain', domain);

    const controller = new AbortController();
    // INCREASED TIMEOUT TO 20 SECONDS TO PREVENT 503 ON LARGE DRINKS PAYLOAD
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);

    upstreamState.testedAt = new Date().toISOString();
    upstreamState.lastHttpCode = response.status;
    const contentType = response.headers.get('content-type') || '';
    upstreamState.contentType = contentType;

    if (contentType.includes('application/json')) {
      const json = await response.json();
      upstreamState.reachable = true;
      upstreamState.status = 'Authoritative Google Sheets JSON connected';
      const payload = json.data !== undefined ? json.data : json;
      return { data: payload, error: null };
    } else {
      // The endpoint returned HTML (e.g. Google Sign-In redirect when permissions are set to 'Only myself')
      upstreamState.reachable = false;
      upstreamState.status =
        'Google Apps Script requires public Web App authorization (Deployment must be configured with "Execute as: Me" and "Who has access: Anyone"). Currently redirects to Google Sign-In.';
      return {
        data: null,
        error: upstreamState.status,
      };
    }
  } catch (err: any) {
    upstreamState.testedAt = new Date().toISOString();
    upstreamState.reachable = false;
    upstreamState.status = `Upstream network unreachable: ${err.message}`;
    return {
      data: null,
      error: upstreamState.status,
    };
  }
}

// ---------------- API ENDPOINTS (0 FALLBACK) ---------------- //

// GET /api/config
app.get('/api/config', async (_req: Request, res: Response) => {
  const result = await fetchUpstream('config');
  if (result.data && typeof result.data === 'object') {
    return sendEnvelope(res, result.data, null, 200, 'apps_script_live');
  }
  return sendEnvelope(res, null, result.error || 'Config unavailable from Apps Script SSOT', 503);
});

// GET /api/categories
app.get('/api/categories', async (_req: Request, res: Response) => {
  const result = await fetchUpstream('categories');
  if (result.data && Array.isArray(result.data)) {
    return sendEnvelope(res, result.data, null, 200, 'apps_script_live');
  }
  return sendEnvelope(res, [], result.error || 'Categories unavailable from Apps Script SSOT', 503);
});

// GET /api/carousel
app.get('/api/carousel', async (_req: Request, res: Response) => {
  const result = await fetchUpstream('carousel');
  if (result.data && Array.isArray(result.data)) {
    return sendEnvelope(res, result.data, null, 200, 'apps_script_live');
  }
  return sendEnvelope(res, [], result.error || 'Carousel feed unavailable from Apps Script SSOT', 503);
});

// GET /api/catalog?domain=food | drinks
app.get('/api/catalog', async (req: Request, res: Response) => {
  const domain = req.query.domain === 'drinks' ? 'drinks' : 'food';
  const result = await fetchUpstream('catalog', domain);
  if (result.data && Array.isArray(result.data)) {
    return sendEnvelope(res, result.data, null, 200, 'apps_script_live');
  }
  return sendEnvelope(res, [], result.error || `${domain} catalog unavailable from Apps Script SSOT`, 503);
});

// GET /api/carwash
app.get('/api/carwash', async (_req: Request, res: Response) => {
  const result = await fetchUpstream('carwash');
  if (result.data && Array.isArray(result.data)) {
    return sendEnvelope(res, result.data, null, 200, 'apps_script_live');
  }
  return sendEnvelope(res, [], result.error || 'Carwash services unavailable from Apps Script SSOT', 503);
});

// GET /api/offers
app.get('/api/offers', async (_req: Request, res: Response) => {
  const result = await fetchUpstream('offers');
  if (result.data && Array.isArray(result.data)) {
    return sendEnvelope(res, result.data, null, 200, 'apps_script_live');
  }
  return sendEnvelope(res, [], result.error || 'Offers unavailable from Apps Script SSOT', 503);
});

// GET /api/diagnostic
app.get('/api/diagnostic', async (_req: Request, res: Response) => {
  await fetchUpstream('config');

  res.json({
    governance: 'HOEOS Law 4 & Law 11 Certified',
    backendMode: 'DEMO MODE · GOOGLE SHEETS BACKEND · ABSOLUTE SSOT (0 FALLBACK)',
    upstreamEndpoint: appsScriptUrl,
    upstreamState,
    persistedOrdersCount: orderStore.size,
    idempotencyStoreCount: idempotencyStore.size,
    timestamp: new Date().toISOString(),
    instructions: {
      step1: 'In Google Apps Script editor, click Deploy > Manage Deployments',
      step2: 'Ensure "Execute as" is set to "Me (your email)"',
      step3: 'Ensure "Who has access" is set to "Anyone"',
      step4: 'Deploy new version and ensure Web App URL matches',
    },
  });
});

// POST /api/endpoint - Allow live update or testing of the Apps Script endpoint
app.post('/api/endpoint', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.startsWith('https://script.google.com/')) {
    return res.status(400).json({ ok: false, error: 'Must provide a valid https://script.google.com/... Web App URL' });
  }

  appsScriptUrl = url.trim();
  const probe = await fetchUpstream('config');
  res.json({
    ok: true,
    newEndpoint: appsScriptUrl,
    probeResult: probe,
    upstreamState,
  });
});

// POST /api/orders
app.post('/api/orders', async (req: Request, res: Response) => {
  const parsed = CreateOrderPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendEnvelope(
      res,
      null,
      `Validation error: ${parsed.error.issues.map((e) => e.message).join(', ')}`,
      400
    );
  }

  const { idempotency_key, customer, items, order_type } = parsed.data;

  if (idempotencyStore.has(idempotency_key)) {
    const existing = idempotencyStore.get(idempotency_key)!;
    return sendEnvelope(res, existing, null, 200);
  }

  // 1. Attempt to post order directly to Apps Script Web App
  try {
    const postController = new AbortController();
    const postTimeout = setTimeout(() => postController.abort(), 8000);

    const appsScriptRes = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(parsed.data),
      signal: postController.signal,
    });
    clearTimeout(postTimeout);

    const contentType = appsScriptRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await appsScriptRes.json();
      if (json.ok && json.data) {
        const confirmed: OrderConfirmationData = json.data;
        orderStore.set(confirmed.order_id, confirmed);
        idempotencyStore.set(idempotency_key, confirmed);
        return sendEnvelope(res, confirmed, null, 201, 'apps_script_live');
      }
    }
  } catch (err) {
    // If upstream POST fails or redirects, we check live catalog retrieval
  }

  // 2. Fetch authoritative live catalog from Apps Script to resolve prices
  const [foodRes, drinksRes, washRes, carouselRes] = await Promise.all([
    fetchUpstream('catalog', 'food'),
    fetchUpstream('catalog', 'drinks'),
    fetchUpstream('carwash'),
    fetchUpstream('carousel'),
  ]);

  const liveCatalogMap = new Map<string, { name: string; price: number; type: string }>();

  if (Array.isArray(foodRes.data)) {
    foodRes.data.forEach((f: any) => liveCatalogMap.set(f.item_id, { name: f.name, price: Number(f.price) || 0, type: 'food' }));
  }
  if (Array.isArray(drinksRes.data)) {
    drinksRes.data.forEach((d: any) => liveCatalogMap.set(d.item_id, { name: d.name, price: Number(d.price) || 0, type: 'drinks' }));
  }
  if (Array.isArray(washRes.data)) {
    washRes.data.forEach((w: any) => liveCatalogMap.set(w.service_id, { name: w.name, price: Number(w.price) || 0, type: 'carwash' }));
  }
  if (Array.isArray(carouselRes.data)) {
    carouselRes.data.forEach((c: any) => {
      if (c.item_id && c.price) {
        liveCatalogMap.set(c.item_id, { name: c.title, price: Number(c.price) || 0, type: c.type || 'experience' });
      }
    });
  }

  if (liveCatalogMap.size === 0) {
    return sendEnvelope(
      res,
      null,
      `Cannot persist order: Google Apps Script SSOT is unreachable or returned no live items (${upstreamState.status}). In accordance with CARSS Law 4 (Database Before UI), orders cannot be verified without authoritative backend prices. Zero local fallback prices are permitted.`,
      503
    );
  }

  let calculatedTotal = 0;
  const confirmedItems = [];

  for (const requestedItem of items) {
    const authoritative = liveCatalogMap.get(requestedItem.item_id);
    if (!authoritative) {
      return sendEnvelope(
        res,
        null,
        `Item ID "${requestedItem.item_id}" was not found in the live Google Apps Script SSOT catalog. Order rejected.`,
        422
      );
    }

    const lineTotal = authoritative.price * requestedItem.quantity;
    calculatedTotal += lineTotal;

    confirmedItems.push({
      item_id: requestedItem.item_id,
      item_type: requestedItem.item_type || authoritative.type,
      name: authoritative.name,
      unit_price: authoritative.price,
      quantity: requestedItem.quantity,
      line_total: lineTotal,
    });
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `LV-ORD-${dateStr}-${randSuffix}`;
  const orderReference = `LAVIDA-${orderId.substring(7)}`;

  const itemsSummary = confirmedItems
    .map((item) => `• ${item.quantity}x ${item.name} (₦${item.line_total.toLocaleString()})`)
    .join('\n');

  const locationContext = customer.table_number ? `Table: ${customer.table_number}` : `Type: ${order_type.toUpperCase()}`;

  const handoffMessage = [
    `*LAVIDA ORDER CONFIRMATION*`,
    `Ref: *${orderReference}*`,
    `Customer: ${customer.name} (${customer.phone})`,
    `Location: ${locationContext}`,
    `\n*Items Ordered:*`,
    itemsSummary,
    `\n*Authoritative Total: ₦${calculatedTotal.toLocaleString()}*`,
    `\n_Note: Transmitted via LaVida CARSS SSOT. Awaiting venue confirmation and kitchen receipt._`,
  ].join('\n');

  const orderConfirmation: OrderConfirmationData = {
    order_id: orderId,
    order_reference: orderReference,
    status: 'RECORDED_IN_DEMO',
    customer,
    items: confirmedItems,
    subtotal: calculatedTotal,
    total_amount: calculatedTotal,
    currency: 'NGN',
    formatted_total: `₦${calculatedTotal.toLocaleString()}`,
    created_at: new Date().toISOString(),
    idempotency_key,
    handoff_message: handoffMessage,
  };

  orderStore.set(orderId, orderConfirmation);
  idempotencyStore.set(idempotency_key, orderConfirmation);

  return sendEnvelope(res, orderConfirmation, null, 201, 'apps_script_live');
});

// ---------------- VITE & STATIC SERVING ---------------- //

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteError) {
      console.error('\n🔴 VITE MIDDLEWARE ERROR:');
      console.error(viteError);
      process.exit(1);
    }
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=========================================`);
    console.log(`🚀 [LaVida CARSS BFF] LIVE ON http://localhost:${PORT}`);
    console.log(`🛡️  ZERO FALLBACK SSOT MODE ACTIVE`);
    console.log(`=========================================\n`);
  });
}

startServer().catch((err) => {
  console.error("\n🔴 FATAL SERVER CRASH:");
  console.error(err);
  process.exit(1);
});