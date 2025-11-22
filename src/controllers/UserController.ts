import { Request, Response } from "express";
import { UserService } from "../services/UserService";

/**
 * Controller for handling User HTTP requests.
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Creates a new user.
   *
   * @route POST /users
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Validaciones minimas
      if (!data?.id) {
        res.status(400).json({ error: "Missing required field: id" });
        return;
      }
      if (!data?.firstName) {
        res.status(400).json({ error: "Missing required field: firstName" });
        return;
      }
      if (!data?.lastName) {
        res.status(400).json({ error: "Missing required field: lastName" });
        return;
      }
      if (data?.age !== undefined && typeof data.age !== "number") {
        res.status(400).json({ error: "Age must be a number" });
        return;
      }

      const user = await this.userService.createUser(data);
      res.status(201).json(user);

    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error creating user" });
    }
  }

  /**
   * Retrieves a single user by ID.
   *
   * @route GET /users/:id
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);

    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error retrieving user" });
    }
  }

  /**
   * Retrieves all users.
   *
   * @route GET /users
   */
  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);

    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error retrieving users" });
    }
  }

  /**
   * Updates an existing user.
   *
   * @route PUT /users/:id
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const updates = req.body;

      // Validación opcional para evitar datos incorrectos
      if (updates.age !== undefined && typeof updates.age !== "number") {
        res.status(400).json({ error: "Age must be a number" });
        return;
      }

      const updatedUser = await this.userService.updateUser(id, updates);

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(updatedUser);

    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error updating user" });
    }
  }

  /**
   * Deletes a user by ID.
   *
   * @route DELETE /users/:id
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const deleted = await this.userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ message: "User deleted successfully" });

    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error deleting user" });
    }
  }
}
