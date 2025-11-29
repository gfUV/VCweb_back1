/**
 * @file MeetingService.ts
 * @description Business logic layer for meeting operations
 */

import { MeetingDAO } from "../dao/MeetingDAO";
import { Meeting, CreateMeetingDTO, JoinMeetingDTO } from "../models/Meeting";

export class MeetingService {
  // Constants for participant limits
  private static readonly MIN_PARTICIPANTS = 2;
  private static readonly MAX_PARTICIPANTS = 10;
  private static readonly DEFAULT_MAX_PARTICIPANTS = 10;

  /**
   * Generate a unique 6-character alphanumeric meeting ID
   */
  private static generateMeetingId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Validate maxParticipants value
   */
  private static validateMaxParticipants(maxParticipants?: number): number {
    if (!maxParticipants) {
      return this.DEFAULT_MAX_PARTICIPANTS;
    }

    if (maxParticipants < this.MIN_PARTICIPANTS) {
      throw new Error(
        `Maximum participants must be at least ${this.MIN_PARTICIPANTS}`
      );
    }

    if (maxParticipants > this.MAX_PARTICIPANTS) {
      throw new Error(
        `Maximum participants cannot exceed ${this.MAX_PARTICIPANTS}`
      );
    }

    return maxParticipants;
  }

  /**
   * Create a new meeting
   */
  static async createMeeting(data: CreateMeetingDTO): Promise<Meeting> {
    const meetingId = this.generateMeetingId();
    const now = new Date().toISOString();
    const maxParticipants = this.validateMaxParticipants(data.maxParticipants);

    const meeting: Meeting = {
      id: "", // Will be set by DAO
      meetingId,
      hostId: data.hostId,
      createdAt: now,
      participantCount: 0, // Starts at 0, host joins separately
      maxParticipants,
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
   * Check if a user can join a meeting
   */
  static async canJoinMeeting(meetingId: string): Promise<{
    canJoin: boolean;
    reason?: string;
    meeting?: Meeting;
  }> {
    const meeting = await this.getMeetingByCode(meetingId);

    if (!meeting) {
      return {
        canJoin: false,
        reason: "Meeting not found or expired",
      };
    }

    if (!meeting.isActive) {
      return {
        canJoin: false,
        reason: "Meeting is no longer active",
      };
    }

    if (meeting.participantCount >= meeting.maxParticipants) {
      return {
        canJoin: false,
        reason: `Meeting is full (${meeting.maxParticipants}/${meeting.maxParticipants} participants)`,
      };
    }

    return {
      canJoin: true,
      meeting,
    };
  }

  /**
   * Join a meeting (increment participant count)
   */
  static async joinMeeting(data: JoinMeetingDTO): Promise<{
    success: boolean;
    message?: string;
    meeting?: Meeting;
  }> {
    const { meetingId } = data;

    // Check if user can join
    const { canJoin, reason, meeting } = await this.canJoinMeeting(meetingId);

    if (!canJoin || !meeting) {
      return {
        success: false,
        message: reason || "Cannot join meeting",
      };
    }

    // Increment participant count
    const newCount = meeting.participantCount + 1;
    await MeetingDAO.updateParticipantCount(meetingId, newCount);

    // Get updated meeting
    const updatedMeeting = await this.getMeetingByCode(meetingId);

    return {
      success: true,
      message: "Successfully joined meeting",
      meeting: updatedMeeting || undefined,
    };
  }

  /**
   * Leave a meeting (decrement participant count)
   */
  static async leaveMeeting(meetingId: string): Promise<boolean> {
    const meeting = await this.getMeetingByCode(meetingId);

    if (!meeting) {
      return false;
    }

    const newCount = Math.max(0, meeting.participantCount - 1);
    return await MeetingDAO.updateParticipantCount(meetingId, newCount);
  }

  /**
   * Update participant count manually
   */
  static async updateParticipants(
    meetingId: string,
    count: number
  ): Promise<boolean> {
    const meeting = await this.getMeetingByCode(meetingId);

    if (!meeting) {
      return false;
    }

    // Validate count doesn't exceed maxParticipants
    if (count > meeting.maxParticipants) {
      throw new Error(
        `Participant count cannot exceed maximum of ${meeting.maxParticipants}`
      );
    }

    if (count < 0) {
      throw new Error("Participant count cannot be negative");
    }

    return await MeetingDAO.updateParticipantCount(meetingId, count);
  }
}
