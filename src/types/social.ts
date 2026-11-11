import type React from "react";

export type FriendshipStatus = "pending" | "accepted";

export interface FriendshipRow {
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
}

export interface PublicProfileRow {
  id: string;
  username: string;
  avatar: string;
  total_xp: number;
}

export interface FriendSummary {
  id: string;
  username: string;
  avatar: string;
  level: number;
}

export interface FriendOverview {
  friends: FriendSummary[];
  received: FriendSummary[];
  sent: FriendSummary[];
}

export interface LeaderboardRow {
  id: string;
  username: string;
  avatar: string;
  total_xp: number;
  current_streak: number;
  last_active_on: string | null;
  weekly_xp: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  level: number;
  streak: number;
  weeklyXp: number;
  isSelf: boolean;
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export interface RequestListProps {
  title: string;
  people: FriendSummary[];
  kind: "received" | "sent";
}

export interface FriendListProps {
  friends: FriendSummary[];
}

export interface PersonRowProps {
  person: FriendSummary;
  children: React.ReactNode;
}

export interface FriendActionProps {
  friendId: string;
  label: string;
  variant: "primary" | "secondary" | "ghost";
  action: (formData: FormData) => Promise<void>;
}
