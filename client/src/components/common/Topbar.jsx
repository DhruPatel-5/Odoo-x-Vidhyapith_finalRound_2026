import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Fixed top bar with page title area, user info, role badge, and logout.
 * @param {string} title - Page title shown in topbar center-left
 */
const Topbar = ({ title = '' }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700',
    engineering: 'bg-blue-100 text-blue-700',
    approver: 'bg-amber-100 text-amber-700',
    operations: 'bg-green-100 text-green-700',
  };

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-20 shadow-sm">
      <h1 className="text-base font-semibold text-gray-900 flex-1">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${roleColors[currentUser?.role] || 'bg-gray-100 text-gray-700'}`}>
          {currentUser?.role}
        </span>

        {/* User name */}
        <span className="text-sm text-gray-600 font-medium hidden sm:block">
          {currentUser?.name}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-2 text-sm text-gray-400 hover:text-red-600 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
