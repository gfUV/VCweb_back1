import { firebaseAuth } from "../config/FirebaseConfig";
import { UserDAO } from "../dao/UserDAO";
import { User, AuthProvider } from "../models/User";

/**
 * Service responsible for handling authentication-related
 * business logic using Firebase Authentication and Firestore.
 *
 * This class is used by the AuthController and isolates
 * asynchronous operations and validation rules.
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

    // Verify the token via Firebase Admin SDK
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Check if user exists in Firestore
    let user = await this.userDAO.findById(uid);

    // If user does not exist, create it
    if (!user) {
      user = new User({
        id: uid,
        name: decoded.name ?? "",
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
      case "github.com":           
        return AuthProvider.GITHUB;
      default:
        return AuthProvider.MANUAL;
    }
  }
}