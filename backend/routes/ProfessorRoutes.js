import routerEX from "express";
import ProfessorController from "../controllers/ProfessorController.js";
import verifyToken from "../helpers/check-token-professor.js";
import UploadController from "../helpers/aws-upload-s3.js";
import MaterialController from "../helpers/aws-get-materiais-s3.js";

const router = routerEX.Router();

router.get("/me/turmas", verifyToken, ProfessorController.minhasTurma);
router.get("/me/notas", verifyToken, ProfessorController.minhasNotas);
router.get(
  "/me/frequencias",
  verifyToken,
  ProfessorController.minhasFrequencias
);
router.post("/nota", verifyToken, ProfessorController.lancarNotas);
router.post("/frequencia", verifyToken, ProfessorController.lancarFrequencia);
router.post(
  "/edit/frequencia",
  verifyToken,
  ProfessorController.editFrequencia
);
router.post("/edit/nota", verifyToken, ProfessorController.editNota);
router.delete("/nota/:id", verifyToken, ProfessorController.deleteNota);
router.delete(
  "/frequencia/:id",
  verifyToken,
  ProfessorController.deleteFrequencia
);
router.post("/materiais", UploadController.gerarUrlUpload);
router.post("/materiais-listar", MaterialController.gerarUrlLeitura);

export default router;
