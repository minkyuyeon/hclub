export const USER_ROLES = ["admin", "user"] as const;
export const CONTENT_STATUSES = ["draft", "published", "archived"] as const;
export const EVENT_STATUSES = ["draft", "published", "sold_out", "cancelled"] as const;
export const TABLE_TYPES = ["BAN_VIP", "BAN_DUNG"] as const;
export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN", "CANCELLED"] as const;

export const TABLE_TYPE_LABELS: Record<TableType, string> = {
  BAN_VIP: "BÀN VIP",
  BAN_DUNG: "BÀN ĐỨNG"
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã đến",
  CANCELLED: "Đã hủy"
};

export type UserRole = (typeof USER_ROLES)[number];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];
export type TableType = (typeof TABLE_TYPES)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
