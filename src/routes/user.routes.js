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
router.route("/companies/get-companies").post(authentication, getCompanies);
router.route("/companies/edit-company").post(authentication, editCompany);
router.route("/companies/change-company-status").post(authentication, changeCompanyActiveStatus);

export default router;