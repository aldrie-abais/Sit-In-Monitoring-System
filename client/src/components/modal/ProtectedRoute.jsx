// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const auth = localStorage.getItem('isLoggedIn');

    if (auth !== 'true') {
        return <Navigate to="/" replace />;
    }

    return children;
}