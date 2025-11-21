import { UserDAO } from "../dao/UserDAO";
import { User, IUser } from "../models/User";

/**
 * Service layer for User-related business logic.
 *
 * This class acts as an intermediary between the controller and the DAO.
 * It applies validation, enforces rules, and prevents controllers from
 * interacting with the database directly.
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
    const user = new User({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userDAO.create(user);
    return user;
  }

  /**
   * Retrieves a user by ID.
   *
   * @param {string} id - User document ID.
   * @returns {Promise<User | null>}
   */
  async getUserById(id: string): Promise<User | null> {
    return await this.userDAO.findById(id);
  }

  /**
   * Retrieves all users.
   *
   * @returns {Promise<User[]>}
   */
  async getAllUsers(): Promise<User[]> {
    return await this.userDAO.findAll();
  }

  /**
   * Updates an existing user.
   *
   * @param {string} id - User ID.
   * @param {Partial<IUser>} updates - Fields to update.
   * @returns {Promise<User | null>} - Updated user or null if not found.
   */
  async updateUser(id: string, updates: Partial<IUser>): Promise<User | null> {
    const existing = await this.userDAO.findById(id);
    if (!existing) return null;

    await this.userDAO.update(id, updates);

    return await this.userDAO.findById(id); // return updated version
  }

  /**
   * Deletes a user by ID.
   *
   * @param {string} id - User ID.
   * @returns {Promise<boolean>} - True if deleted, false if not.
   */
  async deleteUser(id: string): Promise<boolean> {
    const existing = await this.userDAO.findById(id);
    if (!existing) return false;

    await this.userDAO.delete(id);
    return true;
  }
}
