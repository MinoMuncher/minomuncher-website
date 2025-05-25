export type User = {
  id: string;
  username: string;
  avatar_revision?: number;
  banner_revision?: number;
  country?: string;
  supporter: boolean;
}

export type MultiPlayerLeaderboardEntry = {
  id: string;
  username: string;
  active: boolean;
  wins: number;
  stats: Record<string, unknown>;
}

export type MultiPlayerRoundEntry = {
  id: string;
  username: string;
  active: boolean;
  alive: boolean;
  lifetime: number;
  stats: Record<string, unknown>;
}

export type MultiPlayerResults = {
  leaderboard: MultiPlayerLeaderboardEntry[];
  rounds: MultiPlayerRoundEntry[][];
}

export type RecordEntry = {
  _id: string;
  replayid: string;
  stub: boolean;
  gamemode: string;
  pb: boolean;
  oncepb: boolean;
  ts: string;
  revolution?: string | null;
  user: User;
  otherusers: User[];
  leaderboards: string[];
  disputed: boolean;
  results: MultiPlayerResults;
}

export type LeagueResponse = {
  success: boolean, //Whether the request was successful.
  error?: object, //If unsuccessful, the reason the request failed.
  data?: {
    entries: RecordEntry[] //we ignore singleplayer records
  },
}
