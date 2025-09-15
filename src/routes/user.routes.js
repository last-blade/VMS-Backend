import { Router } from "express";
import { registerUser } from "../controllers/userController/registerUser.controller.js";
import { loginUser } from "../controllers/userController/loginUser.controller.js";
import { logoutUser } from "../controllers/userController/logoutUser.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { createRoles } from "../controllers/userController/admin/roleControllers/createRoles.controller.js";
import { editRoles } from "../controllers/userController/admin/roleControllers/editRoles.controller.js";
import { getRoles } from "../controllers/userController/admin/roleControllers/getRoles.controller.js";
import { deleteRoles } from "../controllers/userController/admin/roleControllers/deleteRoles.controller.js";
import { createComapny } from "../controllers/userController/admin/companyControllers/createComapny.controller.js";
import { getCompanies } from "../controllers/userController/admin/companyControllers/getCompanies.controller.js";
import { editCompany } from "../controllers/userController/admin/companyControllers/editCompany.controller.js";
import { changeCompanyActiveStatus } from "../controllers/userController/admin/companyControllers/changeCompanyActiveStatus.controller.js";
import { createCountry } from "../controllers/userController/admin/countryControllers/createCountry.controller.js";
import { getCountries } from "../controllers/userController/admin/countryControllers/getCountries.controller.js";
import { createCity } from "../controllers/userController/admin/cityControllers/createCity.controller.js";
import { createState } from "../controllers/userController/admin/stateController/createState.controller.js";
import { createPlantType } from "../controllers/userController/admin/plantTypeControllers/createPlantType.controller.js";
import { createDeparment } from "../controllers/userController/admin/departmentControllers/createDepartment.controller.js";
import { createPlant } from "../controllers/userController/admin/plantControllers/createPlant.controller.js";
import { createGate } from "../controllers/userController/admin/gateControllers/createGate.controller.js";
import { getCities } from "../controllers/userController/admin/cityControllers/getCities.controller.js";
import { getDepartments } from "../controllers/userController/admin/departmentControllers/getDepartments.controller.js";
import { getStates } from "../controllers/userController/admin/stateController/getStates.controller.js";
import { getGates } from "../controllers/userController/admin/gateControllers/getGates.controller.js";
import { getPlants } from "../controllers/userController/admin/plantControllers/getPlants.controller.js";
import { getPlantTypes } from "../controllers/userController/admin/plantTypeControllers/getPlantTypes.controller.js";
import { createArea } from "../controllers/userController/admin/areaControllers/createArea.controller.js";
import { getAreas } from "../controllers/userController/admin/areaControllers/getAreas.controller.js";
import { createAppointment } from "../controllers/userController/appointmentControllers/createAppointment.controller.js";
import { scanQrCode } from "../controllers/userController/appointmentControllers/scanQrCode.controller.js";
import { visitorsCheckout } from "../controllers/userController/appointmentControllers/visitorsCheckout.controller.js";
import { rejectOrApproveVisitorAppointment } from "../controllers/userController/appointmentControllers/rejectOrApproveVisitorAppointment.controller.js";
import { deleteArea } from "../controllers/userController/admin/areaControllers/deleteArea.controller.js";
import { editArea } from "../controllers/userController/admin/areaControllers/editArea.controller.js";
import { deleteCompany } from "../controllers/userController/admin/companyControllers/deleteCompany.controller.js";
import { deleteCountry } from "../controllers/userController/admin/countryControllers/deleteCountry.controller.js";
import { deleteState } from "../controllers/userController/admin/stateController/deleteState.controller.js";
import { deleteCity } from "../controllers/userController/admin/cityControllers/deleteCity.controller.js";
import { deletePlantType } from "../controllers/userController/admin/plantTypeControllers/deletePlantType.controller.js";
import { deletePlant } from "../controllers/userController/admin/plantControllers/deletePlant.controller.js";
import { deleteDepartment } from "../controllers/userController/admin/departmentControllers/deleteDepartment.controller.js";
import { deleteGate } from "../controllers/userController/admin/gateControllers/deleteGate.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authentication, logoutUser);


//Role routes
router.route("/roles/create-role").post(authentication, createRoles);
router.route("/roles/edit-role/:roleId").patch(authentication, editRoles);
router.route("/roles/fetch-roles").get(authentication, getRoles);
router.route("/roles/delete-role/:roleId").delete(authentication, deleteRoles);

//Company
router.route("/companies/create-company").post(authentication, createComapny);
router.route("/companies/fetch-companies").get(authentication, getCompanies);
router.route("/companies/edit-company").patch(authentication, editCompany);
router.route("/companies/change-company-status").patch(authentication, changeCompanyActiveStatus);
router.route("/companies/delete-company/:companyId").delete(authentication, deleteCompany);

//Country
router.route("/countries/create-country").post(authentication, createCountry);
router.route("/countries/fetch-countries").get(authentication, getCountries);
router.route("/countries/delete-country/:countryId").delete(authentication, deleteCountry);

//State
router.route("/states/create-state").post(authentication, createState);
router.route("/states/fetch-states").get(authentication, getStates);
router.route("/states/delete-state/:stateId").delete(authentication, deleteState);

//City
router.route("/cities/create-city").post(authentication, createCity);
router.route("/cities/fetch-cities").get(authentication, getCities);
router.route("/cities/delete-city/:cityId").delete(authentication, deleteCity);

//PlantType
router.route("/plant-types/create-plant-type").post(authentication, createPlantType);
router.route("/plant-types/fetch-plant-types").get(authentication, getPlantTypes);
router.route("/plant-types/delete-plant-type/:plantTypeId").delete(authentication, deletePlantType);

//Plant
router.route("/plants/create-plant").post(authentication, createPlant);
router.route("/plants/fetch-plants").get(authentication, getPlants);
router.route("/plants/delete-plant/:plantId").delete(authentication, deletePlant);

//Department
router.route("/departments/create-department").post(authentication, createDeparment);
router.route("/departments/fetch-departments").get(authentication, getDepartments);
router.route("/departments/delete-department/:departmentId").delete(authentication, deleteDepartment);

//Gate
router.route("/gates/create-gate").post(authentication, createGate);
router.route("/gates/fetch-gates").get(authentication, getGates);
router.route("/gates/delete-gate/:gateId").delete(authentication, deleteGate);

//Area
router.route("/areas/create-area").post(authentication, createArea);
router.route("/areas/fetch-areas").get(authentication, getAreas);
router.route("/areas/edit-area/:areaId").patch(authentication, editArea);
router.route("/areas/delete-area/:areaId").delete(authentication, deleteArea);

//Appointment
router.route("/appointments/create-appointment").post(authentication, createAppointment);
router.route("/appointments/checkin-visitors").post(authentication, scanQrCode);
router.route("/appointments/checkout-visitors").post(authentication, visitorsCheckout);
router.route("/appointments/approve-reject-visitors").post(authentication, rejectOrApproveVisitorAppointment);

export default router;