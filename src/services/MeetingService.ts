/**
 * @file MeetingService.ts
 * @description Business logic layer for meeting operations
 */

import { MeetingDAO } from "../dao/MeetingDAO";
import { Meeting, CreateMeetingDTO, JoinMeetingDTO } from "../models/Meeting";

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
   * Host is automatically counted as participant #1
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
      participantCount: 1, // HOST IS COUNTED HERE
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

  static async canJoinMeeting(meetingId: string) {
    const meeting = await this.getMeetingByCode(meetingId);

    if (!meeting)
      return { canJoin: false, reason: "Meeting not found or expired" };

    if (!meeting.isActive)
      return { canJoin: false, reason: "Meeting is no longer active" };

    if (meeting.participantCount >= meeting.maxParticipants) {
      return {
        canJoin: false,
        reason: `Meeting is full (${meeting.maxParticipants}/${meeting.maxParticipants} participants)`,
      };
    }

    return { canJoin: true, meeting };
  }

  static async joinMeeting(data: JoinMeetingDTO) {
    const { meetingId } = data;

    const { canJoin, reason, meeting } =
      await this.canJoinMeeting(meetingId);

    if (!canJoin || !meeting)
      return { success: false, message: reason || "Cannot join meeting" };

    const newCount = meeting.participantCount + 1;
    await MeetingDAO.updateParticipantCount(meetingId, newCount);

    const updatedMeeting = await this.getMeetingByCode(meetingId);

    return {
      success: true,
      message: "Successfully joined meeting",
      meeting: updatedMeeting || undefined,
    };
  }

  static async leaveMeeting(meetingId: string): Promise<boolean> {
    const meeting = await this.getMeetingByCode(meetingId);
    if (!meeting) return false;

    const newCount = Math.max(0, meeting.participantCount - 1);
    return await MeetingDAO.updateParticipantCount(meetingId, newCount);
  }

  static async updateParticipants(
    meetingId: string,
    count: number
  ): Promise<boolean> {
    const meeting = await this.getMeetingByCode(meetingId);
    if (!meeting) return false;

    if (count > meeting.maxParticipants)
      throw new Error(
        `Participant count cannot exceed maximum of ${meeting.maxParticipants}`
      );

    if (count < 0)
      throw new Error("Participant count cannot be negative");

    return await MeetingDAO.updateParticipantCount(meetingId, count);
  }
}

