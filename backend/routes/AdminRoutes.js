import routerEX from "express";
import UserController from "../controllers/UserController.js";
// middlewares
import verifyToken from "../helpers/check-token.js";

const router = routerEX.Router();

router.post("/register", UserController.register);
router.get("/checkuser", UserController.checkUser);
router.get("/get-turmas", UserController.getTurma);
router.get("/:id", UserController.getUserById);
router.patch("/edit/:id", verifyToken, UserController.editUser);
router.delete("/delete-user/:id", UserController.deleteUser);
router.post("/create-turma", UserController.createTurma);

export default router;
