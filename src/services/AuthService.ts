import { firebaseAuth } from "../config/FirebaseConfig";
import { UserDAO } from "../dao/UserDAO";
import { User, AuthProvider } from "../models/User";

/**
 * Service responsible for handling authentication-related business logic
 * using Firebase Authentication and Firestore.
 *
 * This class is used by the AuthController and isolates asynchronous
 * operations and validation rules.
 */
export class AuthService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  /**
   * Validates a Firebase ID token and ensures that a corresponding user
   * exists in Firestore. If the user does not exist, the service creates it.
   *
   * @async
   * @param {string} idToken - Firebase ID token sent by the frontend.
   * @returns {Promise<User>} - The authenticated or newly created user.
   * @throws {Error} If the token is invalid or verification fails.
   */
  public async validateIdToken(idToken: string): Promise<User> {
    if (!idToken) {
      throw new Error("ID token is required.");
    }

    // Verify token
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Check if user exists
    let user = await this.userDAO.findById(uid);

    // Create user if it doesn't exist
    if (!user) {
      user = new User({
        id: uid,
        firstName: decoded.name?.split(" ")[0] ?? "",
        lastName: decoded.name?.split(" ").slice(1).join(" ") || "",
        age: null, // Not provided by Google/Facebook
        email: decoded.email ?? "",
        photoURL: decoded.picture ?? null,
        provider: this.mapProvider(decoded.firebase?.sign_in_provider),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.userDAO.create(user);
    }

    return user;
  }

  /**
   * Maps Firebase provider identifiers to the internal AuthProvider enum.
   *
   * @private
   * @param {string | undefined} providerId - Firebase provider ID.
   * @returns {AuthProvider}
   */
  private mapProvider(providerId?: string): AuthProvider {
    switch (providerId) {
      case "google.com":
        return AuthProvider.GOOGLE;
      case "facebook.com":
        return AuthProvider.FACEBOOK;
      default:
        return AuthProvider.MANUAL;
    }
  }
}
