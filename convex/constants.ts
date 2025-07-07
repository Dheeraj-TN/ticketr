import { Doc } from "./_generated/dataModel";

// time constants in milliseconds
export const DURATIONS = {
  TICKET_OFFER: 30 * 60 * 1000,
  // the user will have 30 minutes to buy the ticket, once reserved else the reservation will be cancelled, 30min because that is min time strip allows for checkout expiry
} as const;

// status types for better type saftey
export const WAITING_LIST_STATUS: Record<string, Doc<"waitingList">["status"]> =
  {
    WAITING: "waiting",
    OFFERED: "offered",
    PURCHASED: "purchased",
    EXPIRED: "expired",
  } as const;

export const TICKET_STATUS: Record<string, Doc<"tickets">["status"]> = {
  VALID: "valid",
  USED: "used",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;
