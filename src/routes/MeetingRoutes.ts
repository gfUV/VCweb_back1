/**
 * @file MeetingRoutes.ts
 * @description Routes for meeting-related API endpoints
 */

import { Router } from "express";
import { MeetingController } from "../controllers/MeetingController";

const router = Router();

/**
 * @route   POST /api/meetings
 * @desc    Create a new meeting
 * @access  Public
 */
router.post("/", MeetingController.createMeeting);

/**
 * @route   GET /api/meetings/:meetingId
 * @desc    Get meeting by code (just info, no validation)
 * @access  Public
 */
router.get("/:meetingId", MeetingController.getMeeting);

/**
 * @route   PATCH /api/meetings/:meetingId/participants
 * @desc    Update participant count (called by Backend 2 with real-time data)
 * @access  Public (should be called only by Backend 2)
 */
router.patch("/:meetingId/participants", MeetingController.updateParticipants);

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
