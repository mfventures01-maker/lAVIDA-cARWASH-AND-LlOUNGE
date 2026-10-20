import type { Request, Response } from 'express';

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyzgGSIW8Bs5cQkwUXEuAl8uRSBbpfbK0U_gmUlStruNnu6D1S9djrpT7PyKgEwAnvW/exec';

export default async function handler(_req: Request, res: Response) {
  try {
    const upstreamRes = await fetch(`${APPS_SCRIPT_URL}?action=carousel`, {
      redirect: 'follow',
      headers: { Accept: 'application/json' },
    });
    const contentType = upstreamRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await upstreamRes.json();
      return res.status(200).json({
        ok: true,
        data: json.data || json,
        error: null,
        requestId: 'vercel_' + Math.random().toString(36).substring(2, 9),
        schemaVersion: '1',
      });
    }
  } catch (err: any) {
    // Zero fallback
  }

  return res.status(503).json({
    ok: false,
    data: [],
    error: 'Google Apps Script SSOT carousel unavailable or requires public authorization (0 fallback).',
    requestId: 'vercel_err_' + Math.random().toString(36).substring(2, 9),
    schemaVersion: '1',
  });
}
