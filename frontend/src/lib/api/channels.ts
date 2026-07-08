/**
 * TODO(backend): backend/app/database/models/domain.py defines a
 * `ChannelRecord` table (platform, external_id, status per company) but
 * there is no router exposing it (no GET/POST /channels in
 * backend/app/api/v1/*). The Settings > Channels tab is built for this
 * shape and will call the real endpoints once they exist:
 *   GET  /channels           -> list connected channels for the company
 *   POST /channels           -> connect / update a channel's credentials
 *   DELETE /channels/{id}    -> disconnect a channel
 *
 * Until then, the UI renders the three channels (Telegram, WhatsApp,
 * Instagram) as informational cards and disables the save action with a
 * note pointing back here.
 */
export interface ChannelConfig {
  id: string;
  platform: "telegram" | "whatsapp" | "instagram";
  external_id: string | null;
  status: "connected" | "disconnected";
}

export async function listChannels(): Promise<ChannelConfig[]> {
  throw new Error(
    "NOT_IMPLEMENTED: backend has no GET /channels endpoint yet. See app/database/models/domain.py::ChannelRecord."
  );
}
