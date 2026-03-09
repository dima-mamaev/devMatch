export function sanitizeString(input?: string) {
  return input?.replace(/\s+/g, ' ');
}
