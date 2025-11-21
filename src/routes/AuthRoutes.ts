import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const authController = new AuthController();

/**
 * @route POST /auth/validate
 * @description Validates a Firebase ID token and ensures user exists in Firestore.
 *              It automatically creates the user if they do not exist.
 */
router.post("/validate", authController.authenticate.bind(authController));

export default router;
