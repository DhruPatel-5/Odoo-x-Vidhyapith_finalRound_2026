/**
 * Button — uses CSS classes from index.css design system.
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
 * size: 'sm' | 'md' | 'lg'
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  loading = false,
  ...props
}) => {
  const variantClass = {
    primary:   'btn-primary',
    secondary: 'btn-outline',
    danger:    'btn-danger',
    ghost:     'btn-ghost',
    success:   'btn-primary',   // success reuses primary style (same shape)
  }[variant] || 'btn-primary';

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size] || '';

  // success override: teal-green bg (only via inline override so no extra class)
  const successStyle = variant === 'success' ? { background: '#157a4a' } : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variantClass} ${sizeClass} ${className}`}
      style={successStyle}
      {...props}
    >
      {loading && (
        <span style={{
          width: 13, height: 13,
          border: '2px solid currentColor', borderTopColor: 'transparent',
          borderRadius: '50%', display: 'inline-block',
          animation: 'spin 0.7s linear infinite',
        }} />
      )}
      {children}
    </button>
  );
};

export default Button;
