/**
 * @file MeetingController.ts
 * @description Controller layer for meeting-related HTTP requests
 */

import { Request, Response } from "express";
import { MeetingService } from "../services/MeetingService";
import { CreateMeetingDTO, MeetingResponse, UpdateParticipantsDTO } from "../models/Meeting";

export class MeetingController {
  /**
   * POST /api/meetings
   * Create a new meeting
   */
  static async createMeeting(req: Request, res: Response): Promise<void> {
    try {
      const { hostId, maxParticipants }: CreateMeetingDTO = req.body;

      if (!hostId) {
        res.status(400).json({
          success: false,
          error: "hostId is required",
        } as MeetingResponse);
        return;
      }

      const meeting = await MeetingService.createMeeting({ 
        hostId,
        maxParticipants 
      });

      res.status(201).json({
        success: true,
        meetingId: meeting.meetingId,
        maxParticipants: meeting.maxParticipants,
        message: "Meeting created successfully",
      } as MeetingResponse);
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /api/meetings/:meetingId
   * Get meeting info (NO validation, just data)
   */
  static async getMeeting(req: Request, res: Response): Promise<void> {
    try {
      const { meetingId } = req.params;

      const meeting = await MeetingService.getMeetingByCode(meetingId);

      if (!meeting) {
        res.status(404).json({
          success: false,
          message: "Meeting not found or expired",
        } as MeetingResponse);
        return;
      }

      res.json({
        success: true,
        meeting: {
          meetingId: meeting.meetingId,
          hostId: meeting.hostId,
          participantCount: meeting.participantCount, // Historical/statistical
          maxParticipants: meeting.maxParticipants,
          createdAt: meeting.createdAt,
          isActive: meeting.isActive,
        },
        participantCount: meeting.participantCount,
        maxParticipants: meeting.maxParticipants,
      } as MeetingResponse);
    } catch (error: any) {
      console.error("Error getting meeting:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  /**
   * PATCH /api/meetings/:meetingId/participants
   * Update participant count (called by Backend 2 with real-time WebSocket count)
   */
  static async updateParticipants(req: Request, res: Response): Promise<void> {
    try {
      const { meetingId } = req.params;
      const { currentParticipants }: UpdateParticipantsDTO = req.body;

      if (currentParticipants === undefined || currentParticipants === null) {
        res.status(400).json({
          success: false,
          error: "currentParticipants is required",
        } as MeetingResponse);
        return;
      }

      const success = await MeetingService.updateParticipantCount(
        meetingId,
        currentParticipants
      );

      if (!success) {
        res.status(404).json({
          success: false,
          message: "Meeting not found",
        } as MeetingResponse);
        return;
      }

      res.json({
        success: true,
        message: "Participant count updated successfully",
      } as MeetingResponse);
    } catch (error: any) {
      console.error("Error updating participants:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /api/meetings/user/:userId
   * List all meetings created by a user
   */
  static async getUserMeetings(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const meetings = await MeetingService.getUserMeetings(userId);

      res.json({
        success: true,
        meetings,
      });
    } catch (error: any) {
      console.error("Error getting user meetings:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  /**
   * DELETE /api/meetings/:meetingId
   * Close/deactivate a meeting
   */
  static async closeMeeting(req: Request, res: Response): Promise<void> {
    try {
      const { meetingId } = req.params;

      const success = await MeetingService.closeMeeting(meetingId);

      if (!success) {
        res.status(404).json({
          success: false,
          message: "Meeting not found",
        } as MeetingResponse);
        return;
      }

      res.json({
        success: true,
        message: "Meeting closed successfully",
      } as MeetingResponse);
    } catch (error: any) {
      console.error("Error closing meeting:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }
}
