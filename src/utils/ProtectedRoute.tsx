import { ReactNode } from "react";

import { useAuth } from "../contexts/AuthProvider";

type Props = {
  children: ReactNode;
  loginScreen: ReactNode;
};

const ProtectedRoute = ({ children, loginScreen }: Props) => {
  const auth = useAuth();

  if (auth.master == null) {
    return loginScreen;
  }
  return children;
};

export default ProtectedRoute;
