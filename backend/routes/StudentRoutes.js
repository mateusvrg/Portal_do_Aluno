import routerEX from "express";
import StudentController from "../controllers/StudentController.js";

const router = routerEX.Router();

router.post("/login", StudentController.register);

export default router;