import { z } from "zod";
import { BOOKING_STATUSES, CONTENT_STATUSES, EVENT_STATUSES, TABLE_TYPES, USER_ROLES } from "@/lib/constants";

const vietnamPhoneRegex = /^(?:\+?84|0)(?:\d[\s.-]?){8,10}\d$/;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự."),
  profileInfo: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const postSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).optional().or(z.literal("")),
  content: z.string().min(1),
  thumbnail: z.string().optional().or(z.literal("")),
  status: z.enum(CONTENT_STATUSES).default("draft")
});

export const eventSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).optional().or(z.literal("")),
  description: z.string().min(1),
  date: z.coerce.date(),
  location: z.string().min(2),
  ticketPrice: z.coerce.number().int().min(0).default(0),
  totalTickets: z.coerce.number().int().min(0).default(0),
  availableTickets: z.coerce.number().int().min(0).optional(),
  status: z.enum(EVENT_STATUSES).default("draft"),
  thumbnail: z.string().optional().or(z.literal(""))
});

export const bookingCreateSchema = z.object({
  eventId: z.string().min(1).optional(),
  event_id: z.string().min(1).optional(),
  guestCount: z.coerce.number().int().min(1, "Số khách phải lớn hơn 0.").max(100, "Số khách tối đa cho một yêu cầu là 100."),
  tableType: z.enum(TABLE_TYPES).default("BAN_VIP"),
  customerName: z.string().min(2),
  customerPhone: z.string().trim().regex(vietnamPhoneRegex, "Số điện thoại không hợp lệ."),
  customerEmail: z.string().email().optional().or(z.literal("")),
  note: z.string().max(1000).optional().or(z.literal(""))
}).transform((payload, context) => {
  const eventId = payload.eventId || payload.event_id;
  if (!eventId) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "eventId is required.",
      path: ["eventId"]
    });
    return z.NEVER;
  }

  return {
    eventId,
    guestCount: payload.guestCount,
    tableType: payload.tableType,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    customerEmail: payload.customerEmail,
    note: payload.note
  };
});

export const bookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES)
});

export const adminUserSchema = z.object({
  role: z.enum(USER_ROLES)
});
