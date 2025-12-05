import routerEX from "express";
import StudentController from "../controllers/StudentController.js";
import verifyTokenStudent from "../helpers/check-token-student.js";

const router = routerEX.Router();

router.get("/me/notas", verifyTokenStudent, StudentController.minhasNotas);
router.get("/me/frequencia", verifyTokenStudent, StudentController.minhasFrequencias);
router.get("/me/horarios", verifyTokenStudent, StudentController.meusHorarios);
router.get("/me/avisos", verifyTokenStudent, StudentController.listAvisos);
router.get("/me/materiais/", verifyTokenStudent, StudentController.meusMateriais);

export default router;
