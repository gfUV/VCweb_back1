import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

/**
 * Controller responsible for handling authentication
 * via Firebase Authentication (Google, Facebook, Manual).
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Validates a Firebase ID token and returns the corresponding user.
   *
   * @async
   */
  public authenticate = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { idToken } = req.body;

      const user = await this.authService.validateIdToken(idToken);

      return res.status(200).json({
        success: true,
        message: "Authentication validated successfully.",
        user,
      });

    } catch (error: any) {
      console.error("AuthController.authenticate error:", error);

      return res.status(401).json({
        success: false,
        message: error.message || "Invalid or expired ID token.",
      });
    }
  };
}
