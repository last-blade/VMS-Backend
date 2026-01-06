import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const normalizeTo = (input) => {
  if (!input) return null;
  let digits = String(input).replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  return digits;
};

const textParam = (val) => ({
  type: "text",
  text: String(val ?? ""),
});

export const sendWhatsAppTemplate = async ({
  to,
  messages,
  templateName,
  languageCode,

  // ✅ body placeholders ({{1}}, {{2}}, ...)
  // bodyParams = [],

  // ✅ OPTIONAL: only if template has a dynamic URL button like https://.../{{1}}
  // For URL buttons this is typically a SINGLE value (the URL suffix)
  urlButton = null, // { index: 0, param: "69464e1bd703eabbf7f63795" }
}) => {
  if (!process.env.WHATSAPP_TOKEN) throw new Error("WHATSAPP_TOKEN missing");
  if (!process.env.WHATSAPP_PHONE_ID) throw new Error("WHATSAPP_PHONE_ID missing");
  if (!process.env.WHATSAPP_API_VERSION) throw new Error("WHATSAPP_API_VERSION missing");

  const normalizedTo = normalizeTo(to);
  if (!normalizedTo) throw new Error("Invalid phone number");
  if (!templateName) throw new Error("templateName missing");

  const components = [];

  // Add BODY only if template body actually has placeholders
  if (Array.isArray(messages) && messages.length > 0) {
    components.push({
      type: "body",
      parameters: messages.map(textParam),
    });
  }

  // Add URL button ONLY if template has a dynamic URL placeholder
  if (urlButton) {
    const index = String(urlButton.index ?? "0");
    const param = urlButton.param;

    if (param === undefined || param === null || String(param).trim() === "") {
      throw new Error("urlButton.param missing (template URL button needs a value)");
    }

    components.push({
      type: "button",
      sub_type: "url",
      index,
      parameters: [textParam(param)], // ✅ EXACTLY ONE param for URL variable
    });
  }

  const payload = {
    messaging_product: "whatsapp",
    to: normalizedTo,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components.length ? { components } : {}),
    },
  };console.log("WA FINAL PAYLOAD >>>", JSON.stringify(payload, null, 2));


  const response = await fetch(
    `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("WhatsApp API Error:", data);
    // Meta usually responds with data.error.message
    throw new Error(data?.error?.message || "WhatsApp API call failed");
  }

  return data;
};
