// ─── src/assets/icons.jsx ────────────────────────────────────────────────────
// Single source of truth for every SVG icon used in the app.
//
// Consumers:
//   Main_Content.jsx  →  UploadIcon, FileIcon, CheckIcon, SendIcon,
//                        UserIcon, MailIcon, InfoIcon, CloseIcon, SuccessRingIcon
//   Success_Form.jsx  →  UserIcon, MailIcon, CloseIcon, SuccessRingIcon
//
// All components are pure inline SVG — no sprite sheet or external assets.
// ─────────────────────────────────────────────────────────────────────────────

// ─── UploadIcon ───────────────────────────────────────────────────────────────
// Used in: Main_Content — dropzone centre
export const UploadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-6 h-6"
    stroke="#c9a84c"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// ─── FileIcon ─────────────────────────────────────────────────────────────────
// Used in: Main_Content — file preview row
export const FileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    stroke="#c9a84c"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

// ─── CheckIcon ────────────────────────────────────────────────────────────────
// Used in: Main_Content — custom checkbox tick
// `size` is passed directly to SVG width/height (not via className) so the
// same icon renders at both 11px (primary) and 9px (sub-constraint) sizes.
export const CheckIcon = ({ size = 11 }) => (
  <svg
    viewBox="0 0 12 12"
    width={size}
    height={size}
    stroke="#0d1b2a"
    fill="none"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

// ─── SendIcon ─────────────────────────────────────────────────────────────────
// Used in: Main_Content — submit button
export const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ─── UserIcon ─────────────────────────────────────────────────────────────────
// Used in: Main_Content (director section), Success_Form (director contact box)
export const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    stroke="#c9a84c"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── MailIcon ─────────────────────────────────────────────────────────────────
// Used in: Main_Content (director section), Success_Form (director contact box)
export const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    stroke="#c9a84c"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// ─── InfoIcon ─────────────────────────────────────────────────────────────────
// Used in: Main_Content — director advisory note
export const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 flex-shrink-0"
    stroke="#c9a84c"
    strokeWidth="1.8"
    fill="none"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── CloseIcon ────────────────────────────────────────────────────────────────
// Used in: Main_Content (modal X, file-remove button), Success_Form (modal X)
//
// Props:
//   className    — Tailwind size class, e.g. "w-4 h-4" or "w-3.5 h-3.5"
//   strokeWidth  — "2.5" for modal X buttons, "2" for the file-remove button
export const CloseIcon = ({ className = "w-4 h-4", strokeWidth = "2" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    fill="none"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── SuccessRingIcon ──────────────────────────────────────────────────────────
// Used in: Main_Content (SuccessModal), Success_Form
//
// The green arc uses style={{ transform }} rather than a Tailwind rotate utility
// because SVG presentation-attribute transforms must be set via the React `style`
// prop — Tailwind rotate classes target the *wrapper* HTML element, not SVG geometry.
export const SuccessRingIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <circle
      cx="40" cy="40" r="35"
      stroke="rgba(42,157,92,0.15)"
      strokeWidth="2"
      fill="rgba(42,157,92,0.06)"
    />
    <circle
      cx="40" cy="40" r="35"
      stroke="#2a9d5c"
      strokeWidth="2"
      fill="none"
      strokeDasharray="220"
      strokeDashoffset="0"
      style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
    />
    <polyline
      points="25,40 35,52 55,30"
      stroke="#2a9d5c"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);