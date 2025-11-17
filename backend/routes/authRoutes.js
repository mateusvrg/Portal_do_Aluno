import routerEX from "express";
import AuthController from "../controllers/AuthController.js";

const router = routerEX.Router();

router.post("/login", AuthController.login);

export default router;
