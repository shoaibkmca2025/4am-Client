import type { ApiRequest, ApiResponse } from '../lib/server/http';
import { allowMethods, json } from '../lib/server/http';
import { envPresence } from '../lib/server/env';

// GET /api/health — proves the serverless function layer is wired up.
// Reports env-var PRESENCE only (booleans), never values.
export default function handler(req: ApiRequest, res: ApiResponse): void {
  if (!allowMethods(req, res, ['GET'])) return;
  json(res, 200, {
    ok: true,
    ts: new Date().toISOString(),
    env: envPresence(),
  });
}
