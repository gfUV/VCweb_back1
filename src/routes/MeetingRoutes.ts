/**
 * @file MeetingRoutes.ts
 * @description Routes for meeting-related API endpoints
 */

import { Router } from "express";
import { MeetingController } from "../controllers/MeetingController";

const router = Router();

/**
 * @route   POST /api/meetings
 * @desc    Create a new meeting with optional maxParticipants (2-10)
 * @body    { hostId: string, maxParticipants?: number }
 * @access  Public
 */
router.post("/", MeetingController.createMeeting);

/**
 * @route   GET /api/meetings/:meetingId
 * @desc    Get meeting by code and validate if it exists
 * @access  Public
 */
router.get("/:meetingId", MeetingController.getMeeting);

/**
 * @route   GET /api/meetings/:meetingId/can-join
 * @desc    Check if a user can join the meeting (not full)
 * @access  Public
 */
router.get("/:meetingId/can-join", MeetingController.canJoinMeeting);

/**
 * @route   POST /api/meetings/:meetingId/join
 * @desc    Join a meeting (increment participant count)
 * @body    { userId: string }
 * @access  Public
 */
router.post("/:meetingId/join", MeetingController.joinMeeting);

/**
 * @route   POST /api/meetings/:meetingId/leave
 * @desc    Leave a meeting (decrement participant count)
 * @access  Public
 */
router.post("/:meetingId/leave", MeetingController.leaveMeeting);

/**
 * @route   GET /api/meetings/user/:userId
 * @desc    Get all meetings created by a specific user
 * @access  Public
 */
router.get("/user/:userId", MeetingController.getUserMeetings);

/**
 * @route   DELETE /api/meetings/:meetingId
 * @desc    Close/deactivate a meeting
 * @access  Public
 */
router.delete("/:meetingId", MeetingController.closeMeeting);

export default router;