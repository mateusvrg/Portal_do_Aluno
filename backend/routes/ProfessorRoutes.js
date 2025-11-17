import routerEX from "express";
import ProfessorController from "../controllers/ProfessorController.js";

const router = routerEX.Router();

router.post("/login", ProfessorController.register);

export default router;