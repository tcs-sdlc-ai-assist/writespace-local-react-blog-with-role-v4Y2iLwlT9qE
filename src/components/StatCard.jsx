import PropTypes from 'prop-types';

/**
 * StatCard component for the admin dashboard.
 * Displays a label, count value, and icon/emoji in a styled card.
 *
 * @param {Object} props
 * @param {string} props.title - The label/title for the stat.
 * @param {number|string} props.value - The count or value to display.
 * @param {string} [props.icon='📊'] - An emoji or icon string to display.
 * @param {string} [props.color='primary'] - Color theme: 'primary', 'secondary', 'success', or 'danger'.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @returns {JSX.Element} The rendered stat card element.
 */
export function StatCard({ title, value, icon = '📊', color = 'primary', className = '' }) {
  const colorMap = {
    primary: {
      bg: 'bg-gradient-to-br from-primary-50 to-primary-100',
      iconBg: 'bg-primary-200 text-primary-700',
      valueText: 'text-primary-800',
      border: 'border-primary-200',
    },
    secondary: {
      bg: 'bg-gradient-to-br from-secondary-50 to-secondary-100',
      iconBg: 'bg-secondary-200 text-secondary-700',
      valueText: 'text-secondary-800',
      border: 'border-secondary-200',
    },
    success: {
      bg: 'bg-gradient-to-br from-success-50 to-success-100',
      iconBg: 'bg-success-200 text-success-700',
      valueText: 'text-success-800',
      border: 'border-success-200',
    },
    danger: {
      bg: 'bg-gradient-to-br from-danger-50 to-danger-100',
      iconBg: 'bg-danger-200 text-danger-700',
      valueText: 'text-danger-800',
      border: 'border-danger-200',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`rounded-xl shadow-card border ${colors.border} ${colors.bg} p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.valueText}`}>{value}</p>
        </div>
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-lg ${colors.iconBg} text-xl`}
          role="img"
          aria-label={title}
        >
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  className: PropTypes.string,
};