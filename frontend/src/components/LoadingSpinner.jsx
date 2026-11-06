/**
 * LoadingSpinner — Shown while data is being fetched from the API.
 * Props:
 *   message - optional custom loading message
 */
const LoadingSpinner = ({ message = "Loading assignments..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
