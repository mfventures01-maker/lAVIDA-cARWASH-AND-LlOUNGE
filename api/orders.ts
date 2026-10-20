import type { Request, Response } from 'express';
import { CreateOrderPayloadSchema } from '../src/types/lavida';

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyzgGSIW8Bs5cQkwUXEuAl8uRSBbpfbK0U_gmUlStruNnu6D1S9djrpT7PyKgEwAnvW/exec';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const parsed = CreateOrderPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: `Validation error: ${parsed.error.issues.map((e) => e.message).join(', ')}`,
    });
  }

  // Forward order directly to Apps Script SSOT
  try {
    const upstreamRes = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(parsed.data),
    });

    const contentType = upstreamRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await upstreamRes.json();
      return res.status(200).json(json);
    }
  } catch (err: any) {
    // Zero fallback
  }

  return res.status(503).json({
    ok: false,
    error: 'Google Apps Script SSOT is unreachable or requires public authorization (0 fallback). Orders cannot be verified without authoritative backend prices.',
  });
}
