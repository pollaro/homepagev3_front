import type { HblTeam } from '@/interfaces/hblTeam'

interface HblPlayer {
  firstName: string
  lastName: string
  yahooPlayerId: string
  teamName: string
  primaryPosition: string
  displayPositions: string
  playerStatus?: string | null
  hblTeam?: HblTeam | null
  previousHblTeam?: HblTeam | null
  keeperCostCurrent: number
  seasonsOnTeam: number
  consecutiveSeasons: number
  fourKeeperCost: boolean
  fourKeeperYears: number
}

export type { HblPlayer }
