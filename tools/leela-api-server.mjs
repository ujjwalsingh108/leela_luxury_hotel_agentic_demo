import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve("theleela_playwright_site");
const dataDir = path.resolve("metadata", "runtime");
const port = Number(process.env.PORT || 4174);
const actionSecret = process.env.ACTION_SECRET || "";
const reservationUrl = process.env.RESERVATION_URL || "https://reservations.theleela.com?chain=23514";

const brochureUrls = {
  rooms: process.env.BROCHURE_ROOMS_URL || "https://www.theleela.com/",
  weddings_events: process.env.BROCHURE_EVENTS_URL || "https://www.theleela.com/weddings",
  dining_spa: process.env.BROCHURE_DINING_SPA_URL || "https://www.theleela.com/wellness",
  offers: process.env.BROCHURE_OFFERS_URL || "https://www.theleela.com/special-offers",
  hotel_overview: process.env.BROCHURE_HOTEL_OVERVIEW_URL || "https://www.theleela.com/",
  leela_palace_hotel: process.env.BROCHURE_LEELA_PALACE_HOTEL_URL || "https://www.theleela.com/",
};

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
  [".otf", "font/otf"],
  [".mp4", "video/mp4"],
]);

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  response.end(JSON.stringify(body, null, 2));
}

function text(response, status, body) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(body);
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  const body = Buffer.concat(chunks).toString("utf8");
  if (!body.trim()) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return { rawBody: body };
  }
}

function requireAuth(request) {
  if (!actionSecret) {
    return true;
  }

  return request.headers.authorization === `Bearer ${actionSecret}`;
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

function isValidPhone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(normalizePhone(phone));
}

function required(payload, fields) {
  return fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || String(value).trim() === "";
  });
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

async function appendRecord(kind, payload) {
  await fs.mkdir(dataDir, { recursive: true });
  const record = {
    id: createId(kind),
    kind,
    createdAt: new Date().toISOString(),
    payload,
  };
  await fs.appendFile(path.join(dataDir, `${kind}.jsonl`), `${JSON.stringify(record)}\n`);
  return record;
}

function getWhatsAppProvider() {
  return String(process.env.WHATSAPP_PROVIDER || "mock").toLowerCase();
}

async function sendMetaCloudTemplate({ phone, fullName, brochureType, brochureUrl }) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_BROCHURE_TEMPLATE || "leela_brochure_send";
  const languageCode = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en";

  if (!token || !phoneNumberId) {
    throw new Error("Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID.");
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizePhone(phone).replace(/^\+/, ""),
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: fullName },
              { type: "text", text: brochureType.replaceAll("_", " ") },
              { type: "text", text: brochureUrl },
            ],
          },
        ],
      },
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`WhatsApp send failed: ${JSON.stringify(body)}`);
  }

  return {
    mode: "cloud",
    providerMessageId: body.messages?.[0]?.id || null,
    providerResponse: body,
  };
}

async function sendWatiTemplate({ phone, fullName, brochureType, brochureUrl }) {
  const apiBase = String(process.env.WATI_API_BASE || "").replace(/\/$/, "");
  const token = process.env.WATI_API_TOKEN;
  const templateName = process.env.WATI_BROCHURE_TEMPLATE || "leela_brochure_send";
  const broadcastName = process.env.WATI_BROADCAST_NAME || templateName;
  const whatsappNumber = normalizePhone(phone).replace(/^\+/, "");

  if (!apiBase || !token) {
    throw new Error("Missing WATI_API_BASE or WATI_API_TOKEN.");
  }

  const response = await fetch(`${apiBase}/api/v1/sendTemplateMessage?whatsappNumber=${encodeURIComponent(whatsappNumber)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template_name: templateName,
      broadcast_name: broadcastName,
      parameters: [
        { name: process.env.WATI_NAME_PARAM || "name", value: fullName },
        { name: process.env.WATI_BROCHURE_TYPE_PARAM || "brochure_type", value: brochureType.replaceAll("_", " ") },
        { name: process.env.WATI_BROCHURE_URL_PARAM || "brochure_url", value: brochureUrl },
      ],
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`WATI send failed: ${JSON.stringify(body)}`);
  }

  return {
    mode: "wati",
    providerMessageId: body.id || body.messageId || body.result?.id || null,
    providerResponse: body,
  };
}

async function sendWhatsAppTemplate({ phone, fullName, brochureType, brochureUrl }) {
  const provider = getWhatsAppProvider();

  if (provider === "cloud") {
    return sendMetaCloudTemplate({ phone, fullName, brochureType, brochureUrl });
  }

  if (provider === "wati") {
    return sendWatiTemplate({ phone, fullName, brochureType, brochureUrl });
  }

  return {
    mode: "mock",
    providerMessageId: createId("mock_whatsapp"),
    note: "Set WHATSAPP_PROVIDER=wati for WATI or WHATSAPP_PROVIDER=cloud for WhatsApp Cloud API.",
  };
}

async function handleSendBrochure(payload) {
  const missing = required(payload, ["fullName", "phone", "brochureType"]);
  if (missing.length) {
    return { status: 400, body: { ok: false, error: `Missing required fields: ${missing.join(", ")}` } };
  }

  if (!isValidPhone(payload.phone)) {
    return { status: 400, body: { ok: false, error: "Phone number must include country code, for example +919999999999." } };
  }

  if (payload.whatsappConsent !== true) {
    return { status: 400, body: { ok: false, error: "WhatsApp consent is required before sending a brochure." } };
  }

  const brochureType = String(payload.brochureType || "hotel_overview").toLowerCase();
  const brochureUrl = brochureUrls[brochureType] || brochureUrls.hotel_overview;
  const lead = await appendRecord("lead", {
    ...payload,
    intent: "brochure",
    source: payload.source || "leela_website",
    phone: normalizePhone(payload.phone),
    brochureUrl,
  });
  const whatsapp = await sendWhatsAppTemplate({
    phone: payload.phone,
    fullName: payload.fullName,
    brochureType,
    brochureUrl,
  });

  await appendRecord("whatsapp", {
    leadId: lead.id,
    phone: normalizePhone(payload.phone),
    brochureType,
    brochureUrl,
    whatsapp,
  });

  return {
    status: 200,
    body: {
      ok: true,
      leadId: lead.id,
      brochureUrl,
      whatsapp,
      message: whatsapp.mode === "mock"
        ? "Demo mode: brochure send was recorded. Configure WhatsApp Cloud API to send a real message."
        : "Brochure sent on WhatsApp.",
    },
  };
}

async function handleScheduleCall(payload) {
  const missing = required(payload, ["fullName", "phone", "preferredDateTime", "topic"]);
  if (missing.length) {
    return { status: 400, body: { ok: false, error: `Missing required fields: ${missing.join(", ")}` } };
  }
  if (!isValidPhone(payload.phone)) {
    return { status: 400, body: { ok: false, error: "Phone number must include country code." } };
  }

  const callback = await appendRecord("callback", {
    ...payload,
    intent: "schedule_call",
    phone: normalizePhone(payload.phone),
    status: "requested",
  });

  return { status: 200, body: { ok: true, callbackId: callback.id, message: "Callback request created." } };
}

async function handleEnquiry(payload) {
  const missing = required(payload, ["fullName", "phone", "message"]);
  if (missing.length) {
    return { status: 400, body: { ok: false, error: `Missing required fields: ${missing.join(", ")}` } };
  }
  if (!isValidPhone(payload.phone)) {
    return { status: 400, body: { ok: false, error: "Phone number must include country code." } };
  }

  const enquiry = await appendRecord("enquiry", {
    ...payload,
    intent: payload.enquiryType || "general_enquiry",
    phone: normalizePhone(payload.phone),
    status: "new",
  });

  return { status: 200, body: { ok: true, enquiryId: enquiry.id, message: "Enquiry created." } };
}

async function handleBookingLead(payload) {
  const missing = required(payload, ["fullName", "phone", "hotelOrCity", "checkIn", "checkOut", "rooms", "adults"]);
  if (missing.length) {
    return { status: 400, body: { ok: false, error: `Missing required fields: ${missing.join(", ")}` } };
  }
  if (!isValidPhone(payload.phone)) {
    return { status: 400, body: { ok: false, error: "Phone number must include country code." } };
  }

  const booking = await appendRecord("booking_lead", {
    ...payload,
    intent: "booking",
    phone: normalizePhone(payload.phone),
    status: "lead_created",
    reservationUrl,
  });

  return {
    status: 200,
    body: {
      ok: true,
      bookingLeadId: booking.id,
      reservationUrl,
      message: "Booking lead created. Final rates and availability must be confirmed on the official reservations page.",
    },
  };
}

async function handleCheckAvailability(payload) {
  const missing = required(payload, ["hotelOrCity", "checkIn", "checkOut", "rooms", "adults"]);
  if (missing.length) {
    return { status: 400, body: { ok: false, error: `Missing required fields: ${missing.join(", ")}` } };
  }

  return {
    status: 200,
    body: {
      ok: true,
      mode: "mock",
      available: null,
      reservationUrl,
      message: "Live availability is not connected in this demo. Please continue to official reservations for current rates and rooms.",
    },
  };
}

async function handleChat(payload) {
  const message = String(payload.message || "").toLowerCase();
  let reply = "Namaste. I can help with brochures, call scheduling, enquiries, offers, and room booking. How may I assist you today?";
  let quickActions = ["Send brochure", "Schedule call", "Enquire", "Book rooms"];

  if (message.includes("brochure")) {
    reply = "I can send a brochure on WhatsApp. Please share your full name, WhatsApp number with country code, brochure type, and consent to receive it on WhatsApp.";
    quickActions = ["Rooms brochure", "Wedding brochure", "Offers brochure"];
  } else if (message.includes("call")) {
    reply = "Certainly. Please share your full name, phone number with country code, preferred call time, and what you would like to discuss.";
  } else if (message.includes("book") || message.includes("room")) {
    reply = "I can prepare a booking enquiry. Please share the hotel or city, check-in, check-out, rooms, adults, children, name, phone, and email.";
  } else if (message.includes("wedding") || message.includes("event")) {
    reply = "I can help create a wedding or event enquiry. Please share the city/property, tentative date, guest count, room requirement, name, phone, and email.";
  }

  const chat = await appendRecord("chat", { ...payload, reply });
  return { status: 200, body: { ok: true, chatId: chat.id, reply, quickActions } };
}

function requireWatiWebhookAuth(request, url) {
  const secret = process.env.WATI_WEBHOOK_SECRET || "";
  if (!secret) {
    return true;
  }

  return request.headers["x-wati-webhook-secret"] === secret
    || request.headers["x-webhook-secret"] === secret
    || url.searchParams.get("secret") === secret;
}

async function handleWatiWebhook(request, response, url) {
  if (request.method === "GET") {
    json(response, 200, {
      ok: true,
      service: "leela-wati-webhook",
      message: "WATI webhook endpoint is reachable. Configure WATI to POST WhatsApp events to this URL.",
    });
    return;
  }

  if (request.method !== "POST") {
    json(response, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  if (!requireWatiWebhookAuth(request, url)) {
    json(response, 401, { ok: false, error: "Unauthorized webhook request." });
    return;
  }

  const payload = await readJson(request);
  const event = await appendRecord("wati_inbound", {
    provider: "wati",
    query: Object.fromEntries(url.searchParams.entries()),
    payload,
  });

  json(response, 200, {
    ok: true,
    eventId: event.id,
    message: "WATI webhook event received.",
  });
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  const decodedPath = decodeURIComponent(url.pathname);
  const requested = path.resolve(root, `.${decodedPath}`);

  if (!requested.startsWith(root)) {
    return null;
  }

  return requested;
}

async function serveStatic(request, response) {
  let filePath = resolveRequestPath(request.url || "/");
  if (!filePath) {
    text(response, 403, "Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    const contentType = mimeTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    createReadStream(filePath).pipe(response);
  } catch {
    text(response, 404, "Not found");
  }
}

const handlers = new Map([
  ["/api/leela/chat", handleChat],
  ["/api/leela/send-brochure", handleSendBrochure],
  ["/api/leela/schedule-call", handleScheduleCall],
  ["/api/leela/enquiry", handleEnquiry],
  ["/api/leela/booking-lead", handleBookingLead],
  ["/api/leela/check-availability", handleCheckAvailability],
]);

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", "http://localhost");

  if (request.method === "OPTIONS") {
    json(response, 204, {});
    return;
  }

  if (url.pathname === "/api/leela/health") {
    json(response, 200, { ok: true, service: "leela-api", mode: getWhatsAppProvider() });
    return;
  }

  if (url.pathname === "/api/leela/wati/webhook") {
    try {
      await handleWatiWebhook(request, response, url);
    } catch (error) {
      json(response, 500, { ok: false, error: error.message });
    }
    return;
  }

  if (url.pathname.startsWith("/api/leela/")) {
    if (request.method !== "POST") {
      json(response, 405, { ok: false, error: "Method not allowed." });
      return;
    }

    if (!requireAuth(request)) {
      json(response, 401, { ok: false, error: "Unauthorized." });
      return;
    }

    const handler = handlers.get(url.pathname);
    if (!handler) {
      json(response, 404, { ok: false, error: "Endpoint not found." });
      return;
    }

    try {
      const payload = await readJson(request);
      const result = await handler(payload);
      json(response, result.status, result.body);
    } catch (error) {
      json(response, 500, { ok: false, error: error.message });
    }
    return;
  }

  await serveStatic(request, response);
});

server.listen(port, () => {
  console.log(`Leela site and API running at http://localhost:${port}/`);
  console.log(`Health: http://localhost:${port}/api/leela/health`);
});
