import routerEX from "express";
import UserController from "../controllers/UserController.js";
// middlewares
import verifyToken from '../helpers/check-token.js';

const router = routerEX.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch(
  "/edit/:id",
  verifyToken,
  UserController.editUser
);

export default router;
