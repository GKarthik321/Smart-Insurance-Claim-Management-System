export default function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();
  const toneMap = {
    ACTIVE: 'tone-green',
    APPROVED: 'tone-green',
    SETTLED: 'tone-green',
    SUCCESS: 'tone-green',
    SUBMITTED: 'tone-blue',
    UNDER_REVIEW: 'tone-amber',
    DOCUMENTS_REQUIRED: 'tone-amber',
    PENDING: 'tone-amber',
    REJECTED: 'tone-red',
    FAILED: 'tone-red',
    CANCELLED: 'tone-red',
    CANCELLATION_REQUESTED: 'tone-amber',
    EXPIRED: 'tone-gray'
  };
  const tone = toneMap[normalized] || 'tone-gray';
  return <span className={`badge ${tone}`}>{normalized.replaceAll('_', ' ')}</span>;
}
