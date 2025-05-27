import type { User } from "./leagueRecord"

export type ReplayDropData = {
  fileName: string,
  users: User[],
  data: string,
  dataHash: string,
  checkedUsers: string[],
}
