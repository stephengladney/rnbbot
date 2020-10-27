export type Status =
  | "Unassigned"
  | "In Development"
  | "Ready for Code Review"
  | "Ready for Design Review"
  | "Ready for QA"
  | "Ready for Acceptance"
  | "Ready for Merge"
  | "Done"

export interface CardData {
  age?: string
  alertCount?: number
  assignee: string
  cardNumber: string
  cardTitle: string
  currentStatus: Status
  lastColumnChangeTime?: number
  nextAlertTime?: number
  previousStatus: string
  pullRequests: []
  teamAssigned: string
}

export type StagnantCards = CardData[]

export interface JiraPayloadBody {
  changelog: {
    items: { fieldId: string; fromString: string; toString: string }[]
  }
  issue: {
    fields: {
      assignee: { displayName: string }
      customfield_10025: { value: string }
      summary: string
    }
    key: string
  }
}
