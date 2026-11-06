/**
 * StatCard — A dashboard statistic card showing a number and label.
 * Props:
 *   title    - label text
 *   value    - number to display
 *   icon     - React element (Lucide icon)
 *   color    - CSS color string for icon background tint
 *   bgColor  - CSS background color for icon wrapper
 */
const StatCard = ({ title, value, icon, color, bgColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div
          className="stat-card-icon"
          style={{ background: bgColor, color: color }}
        >
          {icon}
        </div>
      </div>
      <div className="stat-card-value">{value ?? 0}</div>
      <div className="stat-card-label">{title}</div>
    </div>
  );
};

export default StatCard;
