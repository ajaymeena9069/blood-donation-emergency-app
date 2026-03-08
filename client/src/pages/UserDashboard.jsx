import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const activeRole = user.activeRole;
    
    if (activeRole === 'donor') {
      navigate('/donor/dashboard', { replace: true });
    } else if (activeRole === 'patient') {
      navigate('/patient/dashboard', { replace: true });
    } else if (activeRole === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      // Default to first role if activeRole not set
      const roles = user.role || [];
      if (roles.includes('donor')) {
        navigate('/donor/dashboard', { replace: true });
      } else if (roles.includes('patient')) {
        navigate('/patient/dashboard', { replace: true });
      } else if (roles.includes('admin')) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
