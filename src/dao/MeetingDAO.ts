/**
 * @file MeetingDAO.ts
 * @description Data Access Object for Meeting operations in Firestore
 */

import { firebaseDB } from "../config/FirebaseConfig";
import { Meeting } from "../models/Meeting";

const MEETINGS_COLLECTION = "meetings";

export class MeetingDAO {
  /**
   * Create a new meeting in Firestore
   */
  static async create(meeting: Meeting): Promise<Meeting> {
    const docRef = firebaseDB.collection(MEETINGS_COLLECTION).doc();
    const meetingData = {
      ...meeting,
      id: docRef.id,
    };
    
    await docRef.set(meetingData);
    return meetingData;
  }

  /**
   * Find a meeting by meetingId (the short code)
   */
  static async findByMeetingId(meetingId: string): Promise<Meeting | null> {
    const snapshot = await firebaseDB
      .collection(MEETINGS_COLLECTION)
      .where("meetingId", "==", meetingId)
      .where("isActive", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as Meeting;
  }

  /**
   * Find all meetings created by a specific user
   */
  static async findByHostId(hostId: string): Promise<Meeting[]> {
    const snapshot = await firebaseDB
      .collection(MEETINGS_COLLECTION)
      .where("hostId", "==", hostId)
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => doc.data() as Meeting);
  }

  /**
   * Update a meeting's status to inactive
   */
  static async deactivate(meetingId: string): Promise<boolean> {
    const snapshot = await firebaseDB
      .collection(MEETINGS_COLLECTION)
      .where("meetingId", "==", meetingId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return false;
    }

    await snapshot.docs[0].ref.update({
      isActive: false,
      updatedAt: new Date().toISOString(),
    });

    return true;
  }

  /**
   * Update participant count
   */
  static async updateParticipantCount(
    meetingId: string,
    count: number
  ): Promise<boolean> {
    const snapshot = await firebaseDB
      .collection(MEETINGS_COLLECTION)
      .where("meetingId", "==", meetingId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return false;
    }

    await snapshot.docs[0].ref.update({
      participantCount: count,
      updatedAt: new Date().toISOString(),
    });

    return true;
  }
}
