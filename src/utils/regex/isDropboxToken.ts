function isDropboxToken(token: string) {
  const regex = /^sl\.[A-Za-z0-9-_]+$/;
  if (regex.test(token)) {
    return true;
  } else {
    return false;
  }
}

export default isDropboxToken;
