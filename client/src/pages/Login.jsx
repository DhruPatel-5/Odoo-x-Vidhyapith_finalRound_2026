import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: ROLES.ENGINEERING });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password, form.role);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 50%, #EAF6FB 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo block */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: '#CAF0F8', border: '1.5px solid #90E0EF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1.5" y="1.5" width="7.5" height="7.5" rx="1.5" stroke="#0077B6" strokeWidth="1.7"/>
              <rect x="13" y="1.5" width="7.5" height="7.5" rx="1.5" stroke="#0077B6" strokeWidth="1.7"/>
              <rect x="1.5" y="13" width="7.5" height="7.5" rx="1.5" stroke="#0077B6" strokeWidth="1.7"/>
              <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" stroke="#0077B6" strokeWidth="1.7"/>
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#03045E' }}>RevoraX</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#00B4D8' }}>Product Lifecycle Management</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#FFFFFF', border: '1.5px solid #90E0EF',
          borderRadius: 16, padding: '28px 28px 24px',
          boxShadow: '0 4px 24px rgba(0,119,182,0.06)',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', background: '#F0F9FF', borderRadius: 9,
            padding: 3, marginBottom: 22,
          }}>
            {['login', 'signup'].map((tab) => (
              <button key={tab} onClick={() => { setMode(tab); setError(''); }}
                style={{
                  flex: 1, padding: '7px 0', fontSize: 13, fontWeight: 500,
                  borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: mode === tab ? '#FFFFFF' : 'transparent',
                  color: mode === tab ? '#03045E' : '#90E0EF',
                  boxShadow: mode === tab ? '0 1px 4px rgba(0,119,182,0.12)' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}>
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{
                background: '#FCEBEB', border: '1px solid #A32D2D', borderRadius: 8,
                padding: '8px 12px', fontSize: 12, color: '#791F1F',
              }}>
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#0077B6', display: 'block', marginBottom: 4 }}>Full Name</label>
                <input value={form.name} onChange={(e) => set('name', e.target.value)} required
                  placeholder="John Doe"
                  style={{ width: '100%', border: '1.5px solid #CAF0F8', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#03045E', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#0077B6'; e.target.style.boxShadow = '0 0 0 3px #EAF6FB'; }}
                  onBlur={(e)  => { e.target.style.borderColor = '#CAF0F8'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#0077B6', display: 'block', marginBottom: 4 }}>Email Address</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required
                placeholder="you@company.com"
                style={{ width: '100%', border: '1.5px solid #CAF0F8', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#03045E', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#0077B6'; e.target.style.boxShadow = '0 0 0 3px #EAF6FB'; }}
                onBlur={(e)  => { e.target.style.borderColor = '#CAF0F8'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#0077B6', display: 'block', marginBottom: 4 }}>Password</label>
              <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6}
                placeholder="••••••••"
                style={{ width: '100%', border: '1.5px solid #CAF0F8', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#03045E', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#0077B6'; e.target.style.boxShadow = '0 0 0 3px #EAF6FB'; }}
                onBlur={(e)  => { e.target.style.borderColor = '#CAF0F8'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#0077B6', display: 'block', marginBottom: 4 }}>Role</label>
                <select value={form.role} onChange={(e) => set('role', e.target.value)}
                  style={{ width: '100%', border: '1.5px solid #CAF0F8', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#03045E', outline: 'none', background: '#FFFFFF', boxSizing: 'border-box' }}
                  onFocus={(e) => { e.target.style.borderColor = '#0077B6'; e.target.style.boxShadow = '0 0 0 3px #EAF6FB'; }}
                  onBlur={(e)  => { e.target.style.borderColor = '#CAF0F8'; e.target.style.boxShadow = 'none'; }}
                >
                  {Object.values(ROLES).map((r) => (
                    <option key={r} value={r} style={{ textTransform: 'capitalize' }}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? '#90E0EF' : '#0077B6', color: '#FFFFFF',
              border: 'none', borderRadius: 9, padding: '10px 0',
              fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 4, transition: 'background 0.18s',
              width: '100%',
            }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#005f8e'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#0077B6'; }}
            >
              {loading && (
                <span style={{
                  width: 14, height: 14, border: '2px solid rgba(255,255,255,0.5)',
                  borderTopColor: '#FFF', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block'
                }}/>
              )}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#CAF0F8', marginTop: 20 }}>
          RevoraX © 2026 — Internal Use Only
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
