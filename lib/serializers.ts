import type { Booking, Event, Post, User } from "@prisma/client";

export function serializePost(post: Post & { author?: Pick<User, "id" | "email"> }) {
  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  };
}

export function serializeEvent(event: Event) {
  return {
    ...event,
    date: event.date.toISOString(),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString()
  };
}

export function serializeBooking(booking: Booking & { event?: Event; user?: Pick<User, "id" | "email"> | null }) {
  return {
    ...booking,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    event: booking.event ? serializeEvent(booking.event) : undefined
  };
}
