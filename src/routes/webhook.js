import express from "express";
import { Appointment } from "../models/appointment.model.js"; // ✅ adjust path
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
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    const msg = value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    // 1) Extract action
    let action = null;

    if (msg.type === "button") {
      action = msg.button?.payload || msg.button?.text;
    }

    if (msg.type === "interactive" && msg.interactive?.type === "button_reply") {
      action = msg.interactive?.button_reply?.id || msg.interactive?.button_reply?.title;
    }

    action = String(action || "").trim().toUpperCase();
    if (action !== "ACCEPT" && action !== "REJECT") return res.sendStatus(200);

    // 2) Correlate with original template message id
    const originalWamid = msg.context?.id;
    if (!originalWamid) return res.sendStatus(200);

    // 3) Find appointment by mapping
    const appt = await Appointment.findOne({ approvalRequestWamid: originalWamid });
    if (!appt) return res.sendStatus(200);

    // 4) Prevent double processing (idempotent)
    if (appt.approvalStatus && appt.approvalStatus !== "PENDING") return res.sendStatus(200);

    const appointmentStatus = action === "ACCEPT" ? "Approved" : "Rejected";

    // 5) Call your main logic (updates DB + sends WhatsApp etc.)
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
