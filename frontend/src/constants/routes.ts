export const ROUTES = {
  MAP: (id: number) => `/create/map/${id}`,
  COURSE: (id: number) => `/create/course/${id}`,
  ROOT: '/',
} as const;
