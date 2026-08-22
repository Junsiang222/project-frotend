import { Navigate } from "react-router";
import { useCookies } from "react-cookie";

const ProtectedRoute = ({ children }) => {
  const [cookies] = useCookies(["currentuser"]);

  if (!cookies.currentuser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;