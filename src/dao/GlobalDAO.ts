import { firebaseDB } from "../config/FirebaseConfig";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Generic Data Access Object for Firestore Collections.
 *
 * T = Model instance type (e.g., User)
 * U = Interface type for Firestore data (e.g., IUser)
 */
export class GlobalDAO<T, U extends { id?: string }> {
  /** Firestore collection name */
  protected collectionName: string;

  /** Function to create a model instance from plain data */
  protected modelFactory: (data: U) => T;

  /**
   * @param collectionName - Firestore collection name
   * @param modelFactory - Function that converts plain data into a model instance
   */
  constructor(collectionName: string, modelFactory: (data: U) => T) {
    this.collectionName = collectionName;
    this.modelFactory = modelFactory;
  }

  /** Returns Firestore collection reference */
  protected collection() {
    return firebaseDB.collection(this.collectionName);
  }

  /** Creates or overwrites a document */
  async create(item: T & { id: string; toFirestore?: () => U }): Promise<void> {
    if (!item.id) {
      throw new Error("ID is required to create a document.");
    }

    const data = item.toFirestore ? item.toFirestore() : (item as unknown as U);

    await this.collection().doc(item.id).set(data);
  }

  /** Finds a document by ID */
  async findById(id: string): Promise<T | null> {
    if (!id) return null;

    const snapshot = await this.collection().doc(id).get();

    if (!snapshot.exists) {
      return null;
    }

    const data = snapshot.data() as U;
    data.id = id;

    return this.modelFactory(data);
  }

  /** Returns all documents in the collection */
  async findAll(): Promise<T[]> {
    const snapshot = await this.collection().get();

    const items: T[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as U;
      data.id = doc.id;
      items.push(this.modelFactory(data));
    });

    return items;
  }

  /** Updates a document */
  async update(id: string, updates: Partial<U>): Promise<void> {
    if (!id) throw new Error("ID is required for update.");

    // Normalize Timestamp fields
    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value instanceof Timestamp) {
        (updates as any)[key] = value.toDate();
      }
    });

    (updates as any).updatedAt = new Date();

    await this.collection().doc(id).update(updates);
  }

  /** Deletes a document */
  async delete(id: string): Promise<void> {
    if (!id) throw new Error("ID is required for delete.");
    await this.collection().doc(id).delete();
  }
}
