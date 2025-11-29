/**
 * @file Meeting.ts
 * @description Meeting model representing a video call meeting in Firestore
 */

export interface Meeting {
  id: string;              // Firestore document ID
  meetingId: string;       // Short meeting code (e.g., "ABC123")
  hostId: string;          // ID of the user who created the meeting
  createdAt: string;       // ISO timestamp
  participantCount: number;// Historical/statistical count (NOT real-time)
  maxParticipants: number; // Maximum participants allowed (2-10)
  isActive: boolean;       // Whether the meeting is active
  updatedAt: string;       // ISO timestamp of last update
}

export interface CreateMeetingDTO {
  hostId: string;
  maxParticipants?: number; // Optional, defaults to 10
}

export interface MeetingResponse {
  success: boolean;
  meetingId?: string;
  message?: string;
  meeting?: Partial<Meeting>;
  participantCount?: number;
  maxParticipants?: number;
  canJoin?: boolean;
}

export interface UpdateParticipantsDTO {
  currentParticipants: number; // Real-time count from Backend 2 (WebSocket)
}
