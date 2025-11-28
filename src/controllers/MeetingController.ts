/**
 * @file MeetingController.ts
 * @description Controller layer for meeting-related HTTP requests
 */

import { Request, Response } from "express";
import { MeetingService } from "../services/MeetingService";
import { CreateMeetingDTO, MeetingResponse } from "../models/Meeting";

export class MeetingController {
  /**
   * POST /api/meetings
   * Create a new meeting
   */
  static async createMeeting(req: Request, res: Response): Promise<void> {
    try {
      const { hostId }: CreateMeetingDTO = req.body;

      if (!hostId) {
        res.status(400).json({
          success: false,
          error: "hostId is required",
        } as MeetingResponse);
        return;
      }

      const meeting = await MeetingService.createMeeting({ hostId });

      res.status(201).json({
        success: true,
        meetingId: meeting.meetingId,
        message: "Meeting created successfully",
      } as MeetingResponse);
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /api/meetings/:meetingId
   * Validate if a meeting exists and is active
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
          participantCount: meeting.participantCount,
          createdAt: meeting.createdAt,
        },
        participantCount: meeting.participantCount,
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
