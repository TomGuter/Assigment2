import express from "express";
const router = express.Router();
import userControllerAuth from "../controllers/user_controller_auth";

router.post("/register", (req, res) => {
  userControllerAuth.register(req, res);
});
router.post("/login", userControllerAuth.login);

router.post("/logout", userControllerAuth.logout);

router.post("/refresh", userControllerAuth.refresh);

export default router;
