import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canViewECO, canViewReports, canManageSettings } from '../../utils/roleGuard';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '📊' },
  { label: 'Products', to: '/products', icon: '📦' },
  { label: 'Bill of Materials', to: '/bom', icon: '🔧' },
  { label: 'Change Orders', to: '/eco', icon: '📋', guard: canViewECO },
  { label: 'Reports', to: '/reports', icon: '📈', guard: canViewReports },
  { label: 'Settings', to: '/settings', icon: '⚙️', guard: canManageSettings },
];

/**
 * Fixed left sidebar with logo and role-filtered navigation links.
 */
const Sidebar = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col z-30 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">PLM System</p>
            <p className="text-xs text-gray-400">Lifecycle Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map(({ label, to, icon, guard }) => {
          if (guard && !guard(role)) return null;
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: role badge */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-xs uppercase">
            {currentUser?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{currentUser?.name}</p>
            <p className="text-xs text-indigo-600 font-medium capitalize">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
