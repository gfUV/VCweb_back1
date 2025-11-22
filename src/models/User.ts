import { Timestamp } from "firebase-admin/firestore";

/**
 * Enum representing the supported authentication providers.
 */
export enum AuthProvider {
  GOOGLE = "google",
  FACEBOOK = "facebook",
  MANUAL = "manual",
}

/**
 * Firestore User Data Interface.
 *
 * Updated: separated firstname/lastname and added age.
 */
export interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
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
 * application-level model.
 */
export class User {
  public id: string;
  public firstName: string;
  public lastName: string;
  public age: number;
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
    this.firstName = data.firstName ?? "";
    this.lastName = data.lastName ?? "";
    this.age = data.age ?? 0;

    this.email = data.email ?? "";
    this.photoURL = data.photoURL ?? null;
    this.provider = data.provider ?? AuthProvider.MANUAL;

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
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      email: this.email,
      photoURL: this.photoURL,
      provider: this.provider,
      createdAt: this.createdAt,
      updatedAt: new Date(), // Auto-update timestamp
    };
  }
}
