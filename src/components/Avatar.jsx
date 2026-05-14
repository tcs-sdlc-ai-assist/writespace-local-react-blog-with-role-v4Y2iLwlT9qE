import PropTypes from 'prop-types';

/**
 * Avatar component rendering role-distinct visual avatars.
 * Admin users get a crown emoji with purple/indigo background.
 * Regular users get a book emoji with blue/teal background.
 *
 * @param {Object} props
 * @param {string} [props.role='user'] - The role of the user ('admin' or 'user').
 * @param {string} [props.size='md'] - Size variant: 'sm', 'md', or 'lg'.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @returns {JSX.Element} The rendered avatar element.
 */
export function Avatar({ role = 'user', size = 'md', className = '' }) {
  const isAdmin = role === 'admin';

  const emoji = isAdmin ? '👑' : '📖';

  const bgClasses = isAdmin
    ? 'bg-primary-100 text-primary-700 ring-primary-300'
    : 'bg-blue-100 text-blue-700 ring-blue-300';

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full ring-2 ${bgClasses} ${selectedSize} ${className}`}
      role="img"
      aria-label={isAdmin ? 'Admin avatar' : 'User avatar'}
    >
      <span>{emoji}</span>
    </div>
  );
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};