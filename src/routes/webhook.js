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
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;

    // Ignore delivery/read statuses
    if (value?.statuses?.length) {
      console.log("STATUS EVENT:", JSON.stringify(value.statuses[0], null, 2));
      return res.sendStatus(200);
    }

    const msg = value?.messages?.[0];
    if (!msg) return res.sendStatus(200);

    // 1) Extract raw action
    let raw = null;

    if (msg.type === "text") raw = msg.text?.body;
    if (msg.type === "button") raw = msg.button?.payload || msg.button?.text;
    if (msg.type === "interactive" && msg.interactive?.type === "button_reply") {
      raw = msg.interactive?.button_reply?.id || msg.interactive?.button_reply?.title;
    }

    raw = String(raw || "").trim().toUpperCase();
    console.log("MSG TYPE:", msg.type);
    console.log("RAW ACTION:", raw);

    // 2) Map to pass type
    let appointmentPassType = null;
    if (raw.startsWith("RED")) appointmentPassType = "RED";
    else if (raw.startsWith("GREEN")) appointmentPassType = "GREEN";
    else if (raw.startsWith("PURPLE")) appointmentPassType = "PURPLE";
    else if (raw === "REJECT") appointmentPassType = "REJECT";
    else return res.sendStatus(200);

    console.log("PASS TYPE:", appointmentPassType);

    // 3) Correlate to appointment using context wamid
    const originalWamid = msg.context?.id;
    console.log("CONTEXT WAMID:", originalWamid);
    if (!originalWamid) return res.sendStatus(200);

    const appt = await Appointment.findOne({ approvalRequestWamid: originalWamid });
    if (!appt) {
      console.log("No appointment found for wamid:", originalWamid);
      return res.sendStatus(200);
    }

    console.log("CALLING SERVICE FOR:", appt._id.toString());

    // ✅ IMPORTANT: pass appointmentPassType (NOT appointmentStatus)
    const result = await approveOrRejectAppointment({
      appointmentMongoId: appt._id,
      appointmentPassType,
    });

    console.log("SERVICE RESULT:", result);

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err?.message, err);
    return res.sendStatus(200);
  }
});


export default router;
