/**
 * @file MeetingService.ts
 * @description Business logic layer for meeting operations
 */

import { MeetingDAO } from "../dao/MeetingDAO";
import { Meeting, CreateMeetingDTO } from "../models/Meeting";

export class MeetingService {
  /**
   * Generate a unique 6-character alphanumeric meeting ID
   */
  private static generateMeetingId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Create a new meeting
   */
  static async createMeeting(data: CreateMeetingDTO): Promise<Meeting> {
    const meetingId = this.generateMeetingId();
    const now = new Date().toISOString();

    const meeting: Meeting = {
      id: "", // Will be set by DAO
      meetingId,
      hostId: data.hostId,
      createdAt: now,
      participantCount: 1,
      isActive: true,
      updatedAt: now,
    };

    return await MeetingDAO.create(meeting);
  }

  /**
   * Get meeting by its short code
   */
  static async getMeetingByCode(meetingId: string): Promise<Meeting | null> {
    return await MeetingDAO.findByMeetingId(meetingId);
  }

  /**
   * Get all meetings created by a user
   */
  static async getUserMeetings(userId: string): Promise<Meeting[]> {
    return await MeetingDAO.findByHostId(userId);
  }

  /**
   * Close/deactivate a meeting
   */
  static async closeMeeting(meetingId: string): Promise<boolean> {
    return await MeetingDAO.deactivate(meetingId);
  }

  /**
   * Update participant count
   */
  static async updateParticipants(
    meetingId: string,
    count: number
  ): Promise<boolean> {
    return await MeetingDAO.updateParticipantCount(meetingId, count);
  }
}
