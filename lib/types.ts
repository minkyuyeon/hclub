export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
};

export type PublicEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  ticketPrice: number;
  totalTickets: number;
  availableTickets: number;
  status: string;
  thumbnail: string | null;
};

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  status: string;
  createdAt: string;
};
