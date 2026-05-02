export function paginationFromSearchParams(searchParams: URLSearchParams, defaults = { limit: 20, max: 100 }) {
  const rawLimit = Number(searchParams.get("limit") || defaults.limit);
  const rawPage = Number(searchParams.get("page") || 1);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.trunc(rawLimit), 1), defaults.max) : defaults.limit;
  const page = Number.isFinite(rawPage) ? Math.max(Math.trunc(rawPage), 1) : 1;

  return {
    limit,
    page,
    skip: (page - 1) * limit
  };
}
