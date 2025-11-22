import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

/**
 * Controller responsible for handling user authentication
 * using Firebase ID tokens. This controller delegates the
 * verification process to the AuthService.
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
   * @function authenticate
   * @param {Request} req - Express request object containing the ID token in the body.
   * @param {Response} res - Express response object used to return the result.
   * 
   * @returns {Promise<Response>} A response containing:
   *  - `success`: Whether the token is valid.
   *  - `message`: Description of the result.
   *  - `user`: Decoded Firebase user information (only if valid).
   * 
   * @throws Returns HTTP 400 if the token is missing, or 401 if the token is invalid or expired.
   */
  public authenticate = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { idToken } = req.body;

      // Validate required token
      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: "idToken is required.",
        });
      }

      // Delegate token verification to the service
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
        message: error?.message || "Invalid or expired ID token.",
      });
    }
  };
}
