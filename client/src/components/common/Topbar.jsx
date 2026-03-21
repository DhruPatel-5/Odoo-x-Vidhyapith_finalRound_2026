import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleColors = {
  admin:       { bg: '#EAF6FB', color: '#0077B6' },
  engineering: { bg: '#EAF6FB', color: '#0077B6' },
  approver:    { bg: '#CAF0F8', color: '#03045E' },
  operations:  { bg: '#EAF6FB', color: '#0077B6' },
};

/**
 * Topbar — white bar: page title + breadcrumb left, role badge + user + logout right.
 * @param {string} title
 */
const Topbar = ({ title = '' }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role;
  const rStyle = roleColors[role] || { bg: '#EAF6FB', color: '#0077B6' };
  const initials = (currentUser?.name || 'U').charAt(0).toUpperCase();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 220, right: 0, height: 56,
      background: '#FFFFFF', borderBottom: '1.5px solid #CAF0F8',
      display: 'flex', alignItems: 'center', padding: '0 24px',
      zIndex: 20,
    }}>
      {/* Left: title + breadcrumb */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#03045E', lineHeight: 1.2 }}>{title}</p>
        <p style={{ margin: 0, fontSize: 11, color: '#00B4D8', lineHeight: 1 }}>
          RevoraX / {title}
        </p>
      </div>

      {/* Right: role badge, user avatar, logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Role badge */}
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '3px 10px',
          borderRadius: 20, textTransform: 'capitalize',
          background: rStyle.bg, color: rStyle.color,
          border: `1px solid ${rStyle.color}40`,
        }}>
          {role}
        </span>

        {/* User avatar with name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#CAF0F8', border: '1.5px solid #90E0EF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#0077B6' }}>{initials}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#03045E' }} className="hidden sm:block">
            {currentUser?.name}
          </span>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 500, color: '#90E0EF',
          padding: '4px 8px', borderRadius: 6, transition: 'color 0.15s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#A32D2D'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#90E0EF'}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
