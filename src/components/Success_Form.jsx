// ─── Success_Form.jsx ─────────────────────────────────────────
// Standalone modal shown when a dispute application is submitted.
// Consumed by Main_Content.jsx — rendered as a fixed overlay above the form.
//
// Props:
//   refNumber  string   — generated reference number (e.g. LTD-2025-12345)
//   reasons    array    — [{ text: string, sub: boolean }]
//   dirName    string   — client director's name
//   dirEmail   string   — client director's email
//   onClose    fn       — called by X button OR clicking the backdrop
//
// CSS dependencies (all in index.css):
//   .animate-modal-backdrop  — fade-in blurred dark overlay
//   .animate-modal-panel     — scale + fade-up entry animation
//   .gold-top-line           — linear-gradient accent bar
//   .scrollbar-hide          — suppresses scrollbar chrome cross-browser
//
// Icon dependencies (all in src/assets/icons.jsx):
//   UserIcon, MailIcon, CloseIcon, SuccessRingIcon

import {
  UserIcon,
  MailIcon,
  CloseIcon,
  SuccessRingIcon,
} from "../assets/icons";

// ─── Success_Form (modal) ──────────────────────────────────────
export default function Success_Form({ refNumber, reasons, dirName, dirEmail, onClose }) {
  return (
    // Backdrop — clicking it closes the modal
    // .modal-backdrop defined in index.css
    <div className="modal-backdrop" onClick={onClose}>

      {/* Panel — stopPropagation prevents backdrop click from firing inside
          .modal-panel defined in index.css (includes scrollbar-hide) */}
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>

        {/* Gold top accent line — .gold-top-line defined in index.css */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[20px] gold-top-line" />

        {/* X Close button — CloseIcon from src/assets/icons */}
        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
          <CloseIcon className="w-4 h-4" strokeWidth="2.5" />
        </button>

        {/* Animated success ring — SuccessRingIcon from src/assets/icons */}
        <div className="modal-ring">
          <SuccessRingIcon />
        </div>

        {/* Heading & description */}
        <h2 className="modal-heading">Document Received</h2>
        <p className="modal-description">
          Your land tax bill has been{" "}
          <span className="text-highlight">successfully received</span> and is currently
          being{" "}
          <span className="text-highlight">analysed by our team</span>. A confirmation has
          been dispatched to your email address.
        </p>

        {/* Reference + estimated response */}
        <div className="modal-ref-box">
          <div>
            <div className="label-muted">Reference Number</div>
            <div className="ref-number">{refNumber}</div>
          </div>
          <div>
            <div className="label-muted">Estimated Response</div>
            <div className="ref-response">5 Business Days</div>
          </div>
        </div>

        {/* Grounds submitted */}
        <div className="modal-grounds-box">
          <div className="label-gold">Grounds Submitted</div>
          <ul>
            {reasons.map((r, i) => (
              <li
                key={i}
                className={`py-0.5 relative leading-relaxed ${
                  r.sub
                    ? "text-[#8a9bb0] text-xs pl-8"
                    : "text-[13px] text-[#faf8f3] pl-4.5"
                }`}
              >
                <span className="absolute left-0 text-[#c9a84c] text-[11px]">
                  {r.sub ? "·" : "→"}
                </span>
                {r.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Client director contact */}
        <div className="modal-director-box">
          <div className="label-gold flex items-center gap-2">
            <UserIcon /> Client Director Contact
          </div>
          <div className="modal-director-row">
            <div className="modal-director-icon"><UserIcon /></div>
            <div>
              <div className="label-muted">Director Name</div>
              <div className="text-sm font-medium text-white">
                {dirName || "(not provided)"}
              </div>
            </div>
          </div>
          <div className="modal-director-row">
            <div className="modal-director-icon"><MailIcon /></div>
            <div>
              <div className="label-muted">Director Email</div>
              <div className="text-sm font-medium text-white break-all">
                {dirEmail || "(not provided)"}
              </div>
            </div>
          </div>
        </div>

        {/* Status pills */}
        <div className="modal-pills">
          {["Document Received", "Under Analysis", "Awaiting Review"].map((pill) => (
            <div key={pill} className="modal-pill">
              <span className="modal-pill-dot" />
              <span className="modal-pill-text">{pill}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}