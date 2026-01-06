import express from "express";
import { Appointment } from "../models/appointment.model.js";
import { approveOrRejectAppointment } from "../services/appointments/approval.service.js";

const router = express.Router();

router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

router.post("/", async (req, res) => {
    console.log("🔥 WEBHOOK HIT", new Date().toISOString());
  console.log("BODY:", JSON.stringify(req.body, null, 2));
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;

    // ✅ add logging so you SEE what's coming in
    console.log("WEBHOOK VALUE:", JSON.stringify(value, null, 2));

    const msg = value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    console.log("MSG TYPE:", msg.type);

    // 1) Extract action (covers TEXT + BUTTON + INTERACTIVE)
    let action = null;

    // ✅ IMPORTANT: many times quick replies arrive as TEXT
    if (msg.type === "text") {
      action = msg.text?.body;
    }

    if (msg.type === "button") {
      action = msg.button?.payload || msg.button?.text;
    }

    if (msg.type === "interactive" && msg.interactive?.type === "button_reply") {
      action = msg.interactive?.button_reply?.id || msg.interactive?.button_reply?.title;
    }

    action = String(action || "").trim().toUpperCase();
    console.log("PARSED ACTION:", action);

    if (action !== "ACCEPT" && action !== "REJECT") return res.sendStatus(200);

    // 2) Correlate with original template message id
    const originalWamid = msg.context?.id;
    console.log("CONTEXT WAMID:", originalWamid);

    if (!originalWamid) {
      console.warn("No context.id - cannot map using wamid");
      return res.sendStatus(200);
    }

    // 3) Find appointment by mapping
    const appt = await Appointment.findOne({ approvalRequestWamid: originalWamid });
    if (!appt) {
      console.warn("No appointment found for wamid:", originalWamid);
      return res.sendStatus(200);
    }

    const appointmentStatus = action === "ACCEPT" ? "Approved" : "Rejected";
    console.log("APPT:", appt._id.toString(), "STATUS:", appointmentStatus);

    // 4) Call your main logic
    await approveOrRejectAppointment({
      appointmentMongoId: appt._id,
      appointmentStatus,
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(200);
  }
});

export default router;
