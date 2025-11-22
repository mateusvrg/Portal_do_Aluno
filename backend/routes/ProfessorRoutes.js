import routerEX from "express";
import ProfessorController from "../controllers/ProfessorController.js";
import verifyToken from "../helpers/check-token.js";

const router = routerEX.Router();

router.get("/me/turmas", ProfessorController.minhasTurma);
router.get("/me/notas", ProfessorController.minhasNotas);
router.get("/me/frequencias", ProfessorController.minhasFrequencias);
router.get("/me/avisos", ProfessorController.meusAvisos);
router.post("/nota", ProfessorController.lancarNotas);
router.post("/frequencia", ProfessorController.lancarFrequencia);
router.post("/aviso", verifyToken, ProfessorController.lancarAviso);

export default router;
