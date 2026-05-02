# hclub.vn Platform Architecture

## Stack

- Frontend: Next.js App Router, React, Tailwind CSS, site assets from `public/images`.
- Backend: Next.js Route Handlers under `app/api`.
- Database: Prisma ORM with SQLite by default for FlashPanel/PM2 simplicity.
- Authentication: HttpOnly JWT cookie, `bcryptjs` password hashing, middleware-protected `/admin`.

## Database Schema

- `users`: `id`, `role`, `email`, `password_hash`, `profile_info`, timestamps.
- `posts`: `id`, `title`, `slug`, `content`, `thumbnail`, `author_id`, `status`, timestamps.
- `events`: `id`, `title`, `slug`, `description`, `date`, `location`, `ticket_price`, `total_tickets`, `available_tickets`, `status`, `thumbnail`, timestamps.
- `bookings`: `id`, `user_id`, `event_id`, `quantity`, `total_price`, `status`, `payment_method`, customer contact fields, timestamps.

## Booking Integrity

Booking creation runs inside a Prisma transaction. The event row is decremented with `updateMany` guarded by `availableTickets >= quantity`, so simultaneous requests cannot oversell the final tickets.
