// Chat notifications for new leads / applications.
// Activates only when a webhook URL is configured — otherwise a silent no-op,
// so nothing ever fails because chat alerts are unset.
//
//   SLACK_WEBHOOK_URL   — Slack incoming webhook (also works for Discord/Teams
//                         style JSON webhooks that accept { text })
//   WHATSAPP_WEBHOOK_URL— any endpoint accepting { message } (e.g. Twilio proxy,
//                         CallMeBot, or an n8n/Make automation)

const post = async (url: string, payload: unknown): Promise<boolean> => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.warn('[notify] webhook returned', res.status);
    return res.ok;
  } catch (err) {
    console.warn('[notify] webhook failed:', err instanceof Error ? err.message : err);
    return false;
  }
};

export const notifyChat = async (opts: {
  title: string;
  lines: Array<[string, string | null | undefined]>;
  body?: string;
  url?: string;
}): Promise<{ slack: boolean; whatsapp: boolean }> => {
  const details = opts.lines.filter(([, v]) => v).map(([k, v]) => `• *${k}:* ${v}`).join('\n');
  const text = [
    `*${opts.title}*`,
    details,
    opts.body ? `\n${opts.body}` : '',
    opts.url ? `\n${opts.url}` : '',
  ].filter(Boolean).join('\n');

  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  const waUrl = process.env.WHATSAPP_WEBHOOK_URL;

  const [slack, whatsapp] = await Promise.all([
    slackUrl ? post(slackUrl, { text }) : Promise.resolve(false),
    // Plain-text variant: most WhatsApp bridges don't render Slack markdown.
    waUrl ? post(waUrl, { message: text.replace(/\*/g, '') }) : Promise.resolve(false),
  ]);
  return { slack, whatsapp };
};
