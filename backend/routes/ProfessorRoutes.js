import routerEX from "express";
import ProfessorController from "../controllers/ProfessorController.js";

const router = routerEX.Router();

router.get("/minhas-turmas", ProfessorController.getMinhaTurma);

export default router;
