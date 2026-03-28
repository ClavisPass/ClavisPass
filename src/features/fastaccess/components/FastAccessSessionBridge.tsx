import { useEffect } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import {
  cleanupFastAccessOnStartup,
  syncFastAccessSession,
} from "../utils/FastAccess";

function FastAccessSessionBridge() {
  const auth = useAuth();

  useEffect(() => {
    cleanupFastAccessOnStartup(auth.isLoggedIn).catch(() => {});
  }, []);

  useEffect(() => {
    const sessionKey =
      auth.isLoggedIn && auth.sessionStart
        ? `session:${auth.sessionStart}`
        : null;

    syncFastAccessSession(sessionKey).catch(() => {});
  }, [auth.isLoggedIn, auth.sessionStart]);

  return null;
}

export default FastAccessSessionBridge;
