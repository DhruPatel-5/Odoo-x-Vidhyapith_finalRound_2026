import { useEffect } from 'react';

/**
 * Modal — centered overlay. RevoraX styled: white card, ocean border, frost backdrop.
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = { sm: 380, md: 520, lg: 720, xl: 960 };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(3,4,94,0.18)',
        backdropFilter: 'blur(4px)',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative', background: '#FFFFFF',
        border: '1.5px solid #90E0EF', borderRadius: 16,
        width: '100%', maxWidth: maxWidths[size],
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 8px 40px rgba(0,119,182,0.12)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1.5px solid #CAF0F8',
        }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#03045E' }}>{title}</h2>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7, border: 'none',
            background: '#F0F9FF', color: '#90E0EF', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 600, transition: 'background 0.15s, color 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FCEBEB'; e.currentTarget.style.color = '#A32D2D'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F0F9FF'; e.currentTarget.style.color = '#90E0EF'; }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }} className="custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
