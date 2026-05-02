# hclub.vn

Next.js event platform for H Club with public website, CMS, auth, events, posts and bookings.

## Local Run

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Local admin seed:

- URL: `http://localhost:3000/admin`
- Email: `admin@hclub.vn`
- Password: `ChangeMe123!`

Change `ADMIN_PASSWORD` and `JWT_SECRET` in `.env` before deploying.

## FlashPanel Deployment

1. Upload this folder to the site directory.
2. Install Node dependencies with `npm install`.
3. Set environment variables from `.env.example`.
4. Run `npm run build`.
5. Start with PM2 or FlashPanel Node app manager:

```bash
npm run start -- -p 3000
```

6. Point Nginx reverse proxy to the Node port.

## Notes

- SQLite database file is `prisma/hclub.db` by default.
- Booking creation uses a Prisma transaction and conditional ticket decrement to prevent overselling.
- Admin routes are protected by HttpOnly JWT cookie middleware.
