const InfoBox = ({ label, value }) => (
  <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', minWidth: '100px' }}>
    <strong>{label}:</strong> {value}
  </div>
);

export default function ScoreBoard({ balance, hits, timeLeft }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
      <InfoBox label="Balance" value={`₹${balance}`} />
      <InfoBox label="Hits" value={hits} />
      <InfoBox label="Time Left" value={`${timeLeft}s`} />
    </div>
  );
}
