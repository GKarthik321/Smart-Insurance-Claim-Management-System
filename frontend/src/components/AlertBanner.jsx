export default function AlertBanner({ type = 'info', message, onDismiss }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onDismiss && <button className="alert-close" onClick={onDismiss}>&times;</button>}
    </div>
  );
}
