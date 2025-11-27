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
router.post("/aviso", ProfessorController.lancarAviso);
router.post("/edit/frequencia", ProfessorController.editFrequencia);
router.post("/edit/nota", ProfessorController.editNota);
router.post("/edit/aviso/:id", verifyToken, ProfessorController.editAviso);
router.delete("/nota/:id", verifyToken, ProfessorController.deleteNota);
router.delete(
  "/frequencia/:id",
  verifyToken,
  ProfessorController.deleteFrequencia
);
router.delete("/aviso/:id", verifyToken, ProfessorController.deleteAviso);

export default router;
