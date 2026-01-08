import { Router } from "express";
import { getPlantsForVForm } from "../controllers/visitorFormControllers/getPlants.controller.js";
import { getDepartmentsForVForm } from "../controllers/visitorFormControllers/getDepartments.controller.js";
import { getAreasForVForm } from "../controllers/visitorFormControllers/getAreas.controller.js";
import { getUsersForVForm } from "../controllers/visitorFormControllers/getUsers.controller.js";
import { scanQrCode } from "../controllers/visitorFormControllers/scanQrCode.controller.js";
import { visitorsCheckout } from "../controllers/visitorFormControllers/visitorsCheckout.controller.js";

const router = Router();

router.route("/plants/fetch-plants").get(getPlantsForVForm);
router.route("/departments/fetch-departments").get(getDepartmentsForVForm);
router.route("/areas/fetch-areas").get(getAreasForVForm);
router.route("/fetch-users").get(getUsersForVForm);
router.route("/appointments/checkin-visitors/:appointmentId").post(scanQrCode);
router.route("/appointments/checkout-visitors/:appointmentId").post(visitorsCheckout);

export default router;