import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Homepage from '../../Pages/Homepage.js'

const NotRequireAuth = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? <Navigate to={"/"} replace /> : <Outlet/> ? <Outlet/> : <Homepage/>;
};

export default NotRequireAuth;
