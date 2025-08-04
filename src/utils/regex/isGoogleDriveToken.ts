function isGoogleDriveToken(token: string) {
  const regex = /^ya29\.[0-9A-Za-z\-_]+$/;
  if (regex.test(token)) {
    return true;
  } else {
    return false;
  }
}
export default isGoogleDriveToken;
