// Zero-import diagnostic probe. If /api/ping works but /api/* (router)
// crashes, the fault is in the router's imports/handlers. If even this
// crashes, the fault is the Vercel runtime/config itself.
export default function handler(_req: unknown, res: any): void {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ ping: 'ok', node: process.version, ts: new Date().toISOString() }));
}
