// src/components/Divider.jsx
export default function Divider({ label }) {
  return (
    <div className="form-divider">
      <div className="form-divider-line" />
      <span className="form-divider-label">{label}</span>
      <div className="form-divider-line" />
    </div>
  );
}