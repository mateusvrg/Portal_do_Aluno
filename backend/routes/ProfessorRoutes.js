import routerEX from "express";
import ProfessorController from "../controllers/ProfessorController.js";
import verifyTokenProfessor from "../helpers/check-token-professor.js";

const router = routerEX.Router();

router.get("/me/turmas", verifyTokenProfessor, ProfessorController.minhasTurma);
router.get("/me/notas", verifyTokenProfessor, ProfessorController.minhasNotas);
router.get("/me/frequencias", verifyTokenProfessor, ProfessorController.minhasFrequencias);
router.get("/me/materiais", verifyTokenProfessor, ProfessorController.meusMateriais);
router.post("/nota", verifyTokenProfessor, ProfessorController.lancarNotas);
router.post("/frequencia", verifyTokenProfessor, ProfessorController.lancarFrequencia);
router.post("/materiais", verifyTokenProfessor, ProfessorController.uploadMaterial);
router.post("/edit/frequencia", verifyTokenProfessor, ProfessorController.editFrequencia);
router.post("/edit/nota", verifyTokenProfessor, ProfessorController.editNota);
router.post("/edit/material", verifyTokenProfessor, ProfessorController.editMaterial);
router.delete("/nota/:id", verifyTokenProfessor, ProfessorController.deleteNota);
router.delete("/frequencia/:id", verifyTokenProfessor, ProfessorController.deleteFrequencia);
router.delete("/material/:id", verifyTokenProfessor, ProfessorController.deleteMaterial);

export default router;
