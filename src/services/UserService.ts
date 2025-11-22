import { UserDAO } from "../dao/UserDAO";
import { User, IUser } from "../models/User";

/**
 * Service layer for User-related business logic.
 */
export class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  /**
   * Creates a new user.
   *
   * @param {IUser} data - Raw user data.
   * @returns {Promise<User>} - The created user instance.
   */
  async createUser(data: IUser): Promise<User> {

    // Sanitización mínima para evitar que vengan valores incorrectos
    const user = new User({
      id: data.id,
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      age: data.age ?? null,
      email: data.email ?? "",
      photoURL: data.photoURL ?? null,
      provider: data.provider,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userDAO.create(user);
    return user;
  }

  /**
   * Retrieves a user by ID.
   */
  async getUserById(id: string): Promise<User | null> {
    return await this.userDAO.findById(id);
  }

  /**
   * Retrieves all users.
   */
  async getAllUsers(): Promise<User[]> {
    return await this.userDAO.findAll();
  }

  /**
   * Updates an existing user.
   */
  async updateUser(id: string, updates: Partial<IUser>): Promise<User | null> {
    const existing = await this.userDAO.findById(id);
    if (!existing) return null;

    // Limpieza: no permitir actualizar campos inexistentes
    const allowedFields: (keyof IUser)[] = [
      "firstName",
      "lastName",
      "age",
      "email",
      "photoURL",
      "provider",
      "updatedAt"
    ];

    const safeUpdates: Partial<IUser> = {};

    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key as keyof IUser)) {
        (safeUpdates as any)[key] = (updates as any)[key];
      }
    }

    await this.userDAO.update(id, safeUpdates);

    return await this.userDAO.findById(id);
  }

  /**
   * Deletes a user by ID.
   */
  async deleteUser(id: string): Promise<boolean> {
    const existing = await this.userDAO.findById(id);
    if (!existing) return false;

    await this.userDAO.delete(id);
    return true;
  }
}
