// src/components/Checkbox.jsx
import { CheckIcon } from "../assets/icons";

export default function Checkbox({ checked, onChange, label, sub = false }) {
  return (
    <label className={`checkbox-label${sub ? " checkbox-label--sub" : ""}`}>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
      <span className={`checkbox-box${sub ? " checkbox-box--sub" : ""}${checked ? " checkbox-box--checked" : ""}`}>
        {checked && <CheckIcon size={sub ? 9 : 11} />}
      </span>
      <span className="leading-snug">{label}</span>
    </label>
  );
}