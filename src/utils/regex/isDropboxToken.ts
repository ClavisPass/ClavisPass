function isDropboxToken(token: string) {
  const regex = /^[A-Za-z0-9_-]{50,}$/;
  if (regex.test(token)) {
    return true;
  } else {
    return false;
  }
}

export default isDropboxToken;
