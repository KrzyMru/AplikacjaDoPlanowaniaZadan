import {
    Navigate,
} from "react-router-dom";

export default function ProtectedRoute({ allowed, redirectPath = "/", children }) {
    return allowed ? children : <Navigate to={redirectPath} replace />;
};