import { Timestamp } from "firebase-admin/firestore";

/**
 * Enum representing the supported authentication providers.
 */
export enum AuthProvider {
  GOOGLE = "google",
  GITHUB = "github",    // 
  MANUAL = "manual",
}

/**
 * Firestore User Data Interface.
 *
 * Works with Firebase Admin SDK, where timestamps
 * may be either Firestore Timestamp or JS Date.
 */
export interface IUser {
  id?: string;
  name?: string;
  age?: number | null;  
  email?: string;
  photoURL?: string | null;
  provider?: AuthProvider;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

/**
 * User Model class.
 *
 * Normalizes Firestore data and Auth provider data into a consistent
 * application-level model. Designed for MVC + DAO architecture.
 */
export class User {
  public id: string;
  public name: string;
  public age: number | null;
  public email: string;
  public photoURL: string | null;
  public provider: AuthProvider;
  public createdAt: Date;
  public updatedAt: Date;

  /**
   * Creates a new User instance.
   *
   * @param {IUser} data - Raw data from Firestore or auth providers.
   */
  constructor(data: IUser = {}) {
    this.id = data.id ?? "";
    this.name = data.name ?? "";
    this.age = data.age ?? null;
    this.email = data.email ?? "";
    this.photoURL = data.photoURL ?? null;
    this.provider = data.provider ?? AuthProvider.MANUAL;

    // Normalize Firestore Timestamp → JS Date
    this.createdAt =
      data.createdAt instanceof Date
        ? data.createdAt
        : data.createdAt?.toDate?.() ?? new Date();

    this.updatedAt =
      data.updatedAt instanceof Date
        ? data.updatedAt
        : data.updatedAt?.toDate?.() ?? new Date();
  }

  /**
   * Converts this User instance into a Firestore-compatible object.
   *
   * @returns {IUser}
   */
  public toFirestore(): IUser {
    return {
      name: this.name,
      age: this.age,
      email: this.email,
      photoURL: this.photoURL,
      provider: this.provider,
      createdAt: this.createdAt,
      updatedAt: new Date(), // Auto-update timestamp
    };
  }
}