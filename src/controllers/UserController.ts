import { Request, Response } from "express";
import { UserService } from "../services/UserService";

/**
 * Controller for handling User HTTP requests.
 *
 * This class receives incoming requests, validates input,
 * calls the UserService, and sends back HTTP responses.
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

      if (!data || !data.id) {
        res.status(400).json({ error: "Missing required field: id" });
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
