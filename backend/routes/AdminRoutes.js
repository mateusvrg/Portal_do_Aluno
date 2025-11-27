import routerEX from "express";
import AdminController from "../controllers/AdminController.js";
// middlewares
import verifyTokenAdmin from "../helpers/check-token-admin.js";

const router = routerEX.Router();

router.post("/register", verifyTokenAdmin, AdminController.register);
router.get("/checkuser", verifyTokenAdmin, AdminController.checkUser);
router.post("/select-turmas", verifyTokenAdmin, AdminController.selectTurma);
router.post("/edit", verifyTokenAdmin, AdminController.editUser);
router.get("/:id", verifyTokenAdmin, AdminController.getUserById);
router.delete("/delete-user/:id", verifyTokenAdmin, AdminController.deleteUser);
router.delete("/delete-turma/:id", verifyTokenAdmin, AdminController.deleteTurma);
router.delete("/delete-disciplina/:id", verifyTokenAdmin, AdminController.deleteDisciplina);
router.delete("/delete-horario/:id", verifyTokenAdmin, AdminController.deleteHorario);
router.delete("/delete-matricula/:idaluno/:iddisciplina", verifyTokenAdmin, AdminController.deleteMatricula);
router.post("/create-turma", verifyTokenAdmin, AdminController.createTurma);
router.post("/edit-turma", verifyTokenAdmin, AdminController.editTurma);
router.post("/create-disciplina", verifyTokenAdmin, AdminController.createDisciplina);
router.post("/select-disciplina", verifyTokenAdmin, AdminController.selectDisciplina);
router.post("/edit-disciplina", verifyTokenAdmin, AdminController.editDisciplina);
router.post("/create-matricula", verifyTokenAdmin, AdminController.createMatricula);
router.post("/select-matricula-disciplina", verifyTokenAdmin, AdminController.selectMatriculaDisciplina);
router.post("/select-matricula-aluno", verifyTokenAdmin, AdminController.selectMatriculaAluno);
router.post("/create-horario", verifyTokenAdmin, AdminController.createHorario);
router.post("/select-horario-disciplina", verifyTokenAdmin, AdminController.selectHorarioDisciplina);
router.post("/edit-horario-disciplina", verifyTokenAdmin, AdminController.editHorarioDisciplina);

export default router;
