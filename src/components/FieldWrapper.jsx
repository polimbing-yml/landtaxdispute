// src/components/FieldWrapper.jsx
export default function FieldWrapper({ label, error, touched, children, optional }) {
  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {optional && <span className="field-label-optional">(optional)</span>}
      </label>
      {children}
      {touched && error && <p className="field-error">{error}</p>}
    </div>
  );
}