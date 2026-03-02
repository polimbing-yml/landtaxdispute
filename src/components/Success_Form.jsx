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

// ─── SVG Icons (local — not re-exported from Main_Content) ────
const UserIcon = () => (
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

const MailIcon = () => (
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

// ─── Success_Form (modal) ──────────────────────────────────────
export default function Success_Form({ refNumber, reasons, dirName, dirEmail, onClose }) {
  return (
    // ── Backdrop — clicking it closes the modal ──
    // animate-modal-backdrop defined in index.css
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop"
      onClick={onClose}
    >
      {/* ── Panel ──
          stopPropagation prevents the backdrop onClick from firing
          when the user clicks anywhere inside the panel itself.
          animate-modal-panel + scrollbar-hide defined in index.css  */}
      <div
        className="relative w-full max-w-[560px] bg-[#1a2f45] border border-[#c9a84c]/[0.18] rounded-[20px] px-8 py-10 text-center animate-modal-panel scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top accent line — .gold-top-line defined in index.css */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[20px] gold-top-line" />

        {/* ── X Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#8a9bb0] hover:text-white hover:bg-white/[0.08] transition-all duration-150"
          aria-label="Close modal"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Animated success ring ── */}
        <div className="w-[74px] h-[74px] mx-auto mb-5">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <circle
              cx="40" cy="40" r="35"
              stroke="rgba(42,157,92,0.15)"
              strokeWidth="2"
              fill="rgba(42,157,92,0.06)"
            />
            {/*
              SVG transform requires a style prop — Tailwind rotate utilities
              apply CSS transforms to the wrapper element, not SVG presentation
              attributes.
            */}
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
        </div>

        {/* ── Heading & description ── */}
        <h2 className="font-serif text-2xl font-bold text-white mb-3">
          Document Received
        </h2>
        <p className="text-sm text-[#8a9bb0] leading-relaxed max-w-[420px] mx-auto mb-5">
          Your land tax bill has been{" "}
          <span className="text-[#c9a84c] font-medium">successfully received</span> and
          is currently being{" "}
          <span className="text-[#c9a84c] font-medium">analysed by our team</span>. A
          confirmation has been dispatched to your email address.
        </p>

        {/* ── Reference + estimated response ── */}
        <div className="bg-[#2a9d5c]/[0.07] border border-[#2a9d5c]/25 rounded-xl px-5 py-4 mb-4 flex items-center justify-between flex-wrap gap-3 text-left">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8a9bb0] mb-1">
              Reference Number
            </div>
            <div className="font-mono text-base font-medium text-[#2a9d5c] tracking-wide">
              {refNumber}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#8a9bb0] mb-1">
              Estimated Response
            </div>
            <div className="font-mono text-[13px] font-medium text-[#e8c878]">
              5 Business Days
            </div>
          </div>
        </div>

        {/* ── Grounds submitted ── */}
        <div className="bg-[#c9a84c]/[0.06] border border-[#c9a84c]/[0.18] rounded-xl px-[18px] py-[14px] mb-4 text-left">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9a84c] mb-3">
            Grounds Submitted
          </div>
          <ul>
            {reasons.map((r, i) => (
              <li
                key={i}
                className={`py-0.5 relative leading-relaxed ${
                  r.sub
                    ? "text-[#8a9bb0] text-xs pl-8"
                    : "text-[13px] text-[#faf8f3] pl-[18px]"
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

        {/* ── Client director contact ── */}
        <div className="bg-[#0d1b2a]/60 border border-[#c9a84c]/25 rounded-xl px-5 py-[18px] mb-4 text-left">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9a84c] mb-3 flex items-center gap-2">
            <UserIcon /> Client Director Contact
          </div>
          <div className="py-2 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c9a84c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserIcon />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-[#8a9bb0] mb-0.5">
                Director Name
              </div>
              <div className="text-sm font-medium text-white">
                {dirName || "(not provided)"}
              </div>
            </div>
          </div>
          <div className="py-2 flex items-center gap-3 border-t border-white/[0.06]">
            <div className="w-8 h-8 bg-[#c9a84c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MailIcon />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-[#8a9bb0] mb-0.5">
                Director Email
              </div>
              <div className="text-sm font-medium text-white break-all">
                {dirEmail || "(not provided)"}
              </div>
            </div>
          </div>
        </div>

        {/* ── Status pills ── */}
        <div className="flex justify-center gap-2 flex-wrap mb-2">
          {["Document Received", "Under Analysis", "Awaiting Review"].map((pill) => (
            <div
              key={pill}
              className="flex items-center gap-1.5 bg-[#c9a84c]/[0.08] border border-[#c9a84c]/20 rounded-full px-3 py-1.5"
            >
              <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full animate-pulse" />
              <span className="font-mono text-[10px] text-[#c9a84c]">{pill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}