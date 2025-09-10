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

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authentication, logoutUser);


//Role routes
router.route("/roles/create-role").post(authentication, createRoles);
router.route("/roles/edit-role/:roleId").patch(authentication, editRoles);
router.route("/roles/get-roles/:roleId").get(authentication, getRoles);
router.route("/roles/delete-role/:roleId").delete(authentication, deleteRoles);

//Company
router.route("/companies/create-company").post(authentication, createComapny);
router.route("/companies/get-companies").get(authentication, getCompanies);
router.route("/companies/edit-company").patch(authentication, editCompany);
router.route("/companies/change-company-status").patch(authentication, changeCompanyActiveStatus);

//Country
router.route("/countries/create-country").post(authentication, createCountry);
router.route("/countries/get-countries").get(authentication, getCountries);

//State
router.route("/states/create-state").post(authentication, createState);
router.route("/states/fetch-states").get(authentication, getStates);

//City
router.route("/cities/create-city").post(authentication, createCity);
router.route("/cities/fetch-cities").get(authentication, getCities);

//PlantType
router.route("/plant-types/create-plant-type").post(authentication, createPlantType);

//Plant
router.route("/plants/create-plant").post(authentication, createPlant);
router.route("/plants/fetch-plants").get(authentication, getPlants);

//Department
router.route("/department/create-department").post(authentication, createDeparment);
router.route("/department/fetch-departments").get(authentication, getDepartments);

//Gate
router.route("/gates/create-gate").post(authentication, createGate);
router.route("/gates/fetch-gates").get(authentication, getGates);

export default router;