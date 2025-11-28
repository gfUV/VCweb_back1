/**
 * @file routes.ts
 * @description Central router that groups and exposes all route modules.
 *
 * This file keeps all API routes organized by acting as the single
 * entry point for every resource-specific router (Users, Auth, Meetings, etc.).
 */

import { Router } from "express";
import UserRoutes from "./UserRoutes";
import AuthRoutes from "./AuthRoutes";
import MeetingRoutes from "./MeetingRoutes";

const router = Router();

/**
 * @route /users
 * @description User CRUD operations and user-related endpoints.
 */
router.use("/users", UserRoutes);

/**
 * @route /auth
 * @description Authentication endpoints (Firebase token verification).
 */
router.use("/auth", AuthRoutes);

/**
 * @route /api/meetings
 * @description Meeting management endpoints (create, validate, close meetings).
 */
router.use("/api/meetings", MeetingRoutes);

export default router;
