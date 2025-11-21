import routerEX from "express";
import ProfessorController from "../controllers/ProfessorController.js";
import verifyToken from "../helpers/check-token.js";

const router = routerEX.Router();

router.get("/minhas-notas", ProfessorController.minhasNotas);
router.get("/minhas-turmas", ProfessorController.getMinhaTurma);
router.post("/postar-notas", ProfessorController.postNotas);
router.post("/lancar-frequencia", ProfessorController.lancarFrequencia);
router.post("/lancar-aviso", verifyToken, ProfessorController.lancarAviso);

export default router;
