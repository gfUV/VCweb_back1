/**
 * @file MeetingService.ts
 * @description Business logic layer for meeting operations
 */

import { MeetingDAO } from "../dao/MeetingDAO";
import { Meeting, CreateMeetingDTO } from "../models/Meeting";

export class MeetingService {
  private static readonly MIN_PARTICIPANTS = 2;
  private static readonly MAX_PARTICIPANTS = 10;
  private static readonly DEFAULT_MAX_PARTICIPANTS = 10;

  private static generateMeetingId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private static validateMaxParticipants(maxParticipants?: number): number {
    if (!maxParticipants) return this.DEFAULT_MAX_PARTICIPANTS;

    if (maxParticipants < this.MIN_PARTICIPANTS)
      throw new Error(
        `Maximum participants must be at least ${this.MIN_PARTICIPANTS}`
      );

    if (maxParticipants > this.MAX_PARTICIPANTS)
      throw new Error(
        `Maximum participants cannot exceed ${this.MAX_PARTICIPANTS}`
      );

    return maxParticipants;
  }

  /**
   * Create a new meeting
   * participantCount starts at 0 (historical/statistical field)
   */
  static async createMeeting(data: CreateMeetingDTO): Promise<Meeting> {
    const meetingId = this.generateMeetingId();
    const now = new Date().toISOString();
    const maxParticipants = this.validateMaxParticipants(data.maxParticipants);

    const meeting: Meeting = {
      id: "",
      meetingId,
      hostId: data.hostId,
      createdAt: now,
      participantCount: 0, // Start at 0, Backend 2 will update
      maxParticipants,
      isActive: true,
      updatedAt: now,
    };

    return await MeetingDAO.create(meeting);
  }

  static async getMeetingByCode(meetingId: string): Promise<Meeting | null> {
    return await MeetingDAO.findByMeetingId(meetingId);
  }

  static async getUserMeetings(userId: string): Promise<Meeting[]> {
    return await MeetingDAO.findByHostId(userId);
  }

  static async closeMeeting(meetingId: string): Promise<boolean> {
    return await MeetingDAO.deactivate(meetingId);
  }

  /**
   * Update participant count (called by Backend 2 with real-time data)
   * This is a statistical/historical field, not used for validation
   */
  static async updateParticipantCount(
    meetingId: string,
    currentParticipants: number
  ): Promise<boolean> {
    const meeting = await this.getMeetingByCode(meetingId);
    if (!meeting) return false;

    if (currentParticipants < 0) {
      throw new Error("Participant count cannot be negative");
    }

    // Update as historical/statistical data
    return await MeetingDAO.updateParticipantCount(meetingId, currentParticipants);
  }
}
