export function getAuthProvider(auth0Id: string) {
  const [authIdent] = auth0Id.split('|');
  return authIdent.split('-')[0];
}
