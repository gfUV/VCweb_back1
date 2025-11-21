import { Router } from "express";
import { UserController } from "../controllers/UserController";

/**
 * UserRoutes
 *
 * Express router that manages all HTTP endpoints related to users.
 * Each route delegates the request to the UserController.
 */
const router = Router();
const userController = new UserController();

/**
 * @route POST /users
 * @description Creates a new user.
 */
router.post("/", userController.createUser.bind(userController));

/**
 * @route GET /users/:id
 * @description Retrieves a user by ID.
 */
router.get("/:id", userController.getUserById.bind(userController));

/**
 * @route GET /users
 * @description Retrieves all users.
 */
router.get("/", userController.getAllUsers.bind(userController));

/**
 * @route PUT /users/:id
 * @description Updates an existing user.
 */
router.put("/:id", userController.updateUser.bind(userController));

/**
 * @route DELETE /users/:id
 * @description Deletes a user by ID.
 */
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;