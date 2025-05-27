import type { LeagueResponse } from "./leagueRecord";

export type ProfileData = { response: LeagueResponse, username: string, userId: string, avatar?: string, avatarLoaded: boolean, checkedReplays: string[] }
