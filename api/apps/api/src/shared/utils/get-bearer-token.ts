export function getBearerToken(header: string) {
  return header.replace(/^[Bb]earer\s/, '');
}
