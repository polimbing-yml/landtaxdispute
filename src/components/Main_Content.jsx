import { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// ─── Year helpers ────────────────────────────────────────────
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 51 }, (_, i) => currentYear - i);

// ─── Dispute reasons ─────────────────────────────────────────
const PRIMARY_REASONS = [
  { id: "cb_a", value: "Incorrect land value" },
  { id: "cb_b", value: "Incorrect area or dimension errors" },
  { id: "cb_c", value: "Incorrect apportionment" },
  {
    id: "cb_d",
    value: "Failure to consider property-specific constraints, including:",
    hasSub: true,
  },
];

const SUB_CONSTRAINTS = [
  { id: "sc1", value: "Heritage listing or overlay" },
  { id: "sc2", value: "Flood zone or flood-prone classification" },
  { id: "sc3", value: "Bushfire Attack Level (BAL) restrictions" },
  { id: "sc4", value: "Easements or rights of way" },
  { id: "sc5", value: "Environmental or conservation overlay" },
  { id: "sc6", value: "Zoning or planning restrictions" },
  { id: "sc7", value: "Access restrictions or landlocked status" },
  { id: "sc8", value: "Contamination or remediation requirements" },
];

// ─── Validation schema ───────────────────────────────────────
const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  propAddress: Yup.string().required("Property address is required"),
  assessYearFrom: Yup.number().required("From year is required"),
  assessYearTo: Yup.number()
    .required("To year is required")
    .min(Yup.ref("assessYearFrom"), "To year must be ≥ From year"),
  dirName: Yup.string().required("Director name is required"),
  dirEmail: Yup.string()
    .email("Invalid email address")
    .required("Director email is required"),
  reasons: Yup.array().min(1, "Select at least one ground for dispute"),
});

// ─── SVG Icons ───────────────────────────────────────────────
const UploadIcon = () => (
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

const FileIcon = () => (
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

const CheckIcon = ({ size = 11 }) => (
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

const SendIcon = () => (
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

const InfoIcon = () => (
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

// ─── Reusable field wrapper ───────────────────────────────────
const FieldWrapper = ({ label, error, touched, children, optional }) => (
  <div className="mb-4">
    <label className="block font-mono text-[11px] uppercase tracking-widest text-[#c9a84c] mb-2">
      {label}
      {optional && (
        <span className="text-[#8a9bb0] normal-case tracking-normal text-[11px] font-sans font-light ml-1">
          (optional)
        </span>
      )}
    </label>
    {children}
    {touched && error && (
      <p className="mt-1.5 text-[11px] font-mono text-[#e05c5c]">{error}</p>
    )}
  </div>
);

// ─── Shared input class strings ───────────────────────────────
const inputBase =
  "w-full bg-white/[0.04] border border-white/10 rounded-[10px] px-[15px] py-3 font-sans text-sm text-white outline-none transition-all duration-200 placeholder-[#8a9bb0]/50 focus:border-[#c9a84c]/50 focus:bg-[#c9a84c]/[0.04]";

const selectBase =
  "w-full bg-[#0d1b2a] border border-white/10 rounded-[10px] px-[15px] py-3 font-mono text-sm text-white outline-none transition-all duration-200 focus:border-[#c9a84c]/50 appearance-none cursor-pointer";

// ─── Custom Checkbox ─────────────────────────────────────────
const Checkbox = ({ checked, onChange, label, sub = false }) => (
  <label
    className={`flex items-start gap-3 cursor-pointer group transition-colors duration-150 hover:text-white ${
      sub ? "text-[13px] text-[#8a9bb0]" : "text-[14px] text-[#faf8f3]"
    }`}
  >
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    <span
      className={`flex-shrink-0 mt-0.5 flex items-center justify-center rounded-[5px] transition-all duration-200 ${
        sub ? "w-[17px] h-[17px] border-[1.5px]" : "w-5 h-5 border-2"
      } ${
        checked
          ? "bg-[#c9a84c] border-[#c9a84c]"
          : "bg-white/[0.03] border-[#c9a84c]/40"
      }`}
    >
      {checked && <CheckIcon size={sub ? 9 : 11} />}
    </span>
    <span className="leading-snug">{label}</span>
  </label>
);

// ─── Divider ─────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-px bg-white/[0.08]" />
    <span className="font-mono text-[11px] text-[#8a9bb0] uppercase tracking-widest whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-white/[0.08]" />
  </div>
);

// ─── Success Modal ────────────────────────────────────────────
// Rendered as a fixed overlay — the form stays mounted beneath it.
// Close triggers: X button, click outside the panel, "Submit Another Application".
const SuccessModal = ({ refNumber, reasons, dirName, dirEmail, onClose }) => (
  // ── Backdrop ──
  // animate-modal-backdrop defined in index.css
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop"
    onClick={onClose}
  >
    {/* ── Panel ── */}
    {/* stopPropagation prevents backdrop click from firing when clicking inside */}
    {/* animate-modal-panel defined in index.css */}
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
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* ── Animated ring ── */}
      <div className="w-[74px] h-[74px] mx-auto mb-5">
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle
            cx="40" cy="40" r="35"
            stroke="rgba(42,157,92,0.15)"
            strokeWidth="2"
            fill="rgba(42,157,92,0.06)"
          />
          {/*
            SVG transform requires a style prop — Tailwind rotate utilities apply
            CSS transforms to the wrapper element, not SVG presentation attributes.
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

      <h2 className="font-serif text-2xl font-bold text-white mb-3">Document Received</h2>
      <p className="text-sm text-[#8a9bb0] leading-relaxed max-w-[420px] mx-auto mb-5">
        Your land tax bill has been{" "}
        <span className="text-[#c9a84c] font-medium">successfully received</span> and is
        currently being{" "}
        <span className="text-[#c9a84c] font-medium">analysed by our team</span>. A
        confirmation has been dispatched to your email address.
      </p>

      {/* ── Ref box ── */}
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

      {/* ── Director contact ── */}
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
            <div className="text-sm font-medium text-white">{dirName || "(not provided)"}</div>
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

// ─── Main Component ───────────────────────────────────────────
export default function Main_Content() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [subPanelOpen, setSubPanelOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const genRef = () =>
    `LTD-${currentYear}-${Math.floor(10000 + Math.random() * 90000)}`;

  const handleFileSelect = useCallback((f) => {
    if (!f || f.type !== "application/pdf") return alert("Please upload a PDF file.");
    setFile(f);
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      propAddress: "",
      assessYearFrom: currentYear,
      assessYearTo: currentYear,
      dirName: "",
      dirEmail: "",
      reasons: [],
      subConstraints: [],
      addNotes: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (!file) return alert("Please upload a PDF file.");

      const reasons = [];
      values.reasons.forEach((r) => {
        const primary = PRIMARY_REASONS.find((p) => p.id === r);
        if (primary) {
          reasons.push({ text: primary.value, sub: false });
          if (primary.hasSub) {
            values.subConstraints.forEach((sc) => {
              const c = SUB_CONSTRAINTS.find((x) => x.id === sc);
              if (c) reasons.push({ text: c.value, sub: true });
            });
          }
        }
      });

      setSubmittedData({
        ref: genRef(),
        reasons,
        dirName: values.dirName,
        dirEmail: values.dirEmail,
      });
      setSubmitted(true);
    },
  });

  const toggleReason = (id) => {
    const current = formik.values.reasons;
    const next = current.includes(id)
      ? current.filter((r) => r !== id)
      : [...current, id];
    formik.setFieldValue("reasons", next);
    if (id === "cb_d") setSubPanelOpen(!current.includes(id));
  };

  const toggleSub = (id) => {
    const current = formik.values.subConstraints;
    formik.setFieldValue(
      "subConstraints",
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id]
    );
  };

  const handleCloseModal = () => {
    // Reset everything so the form is clean for a fresh submission
    formik.resetForm();
    setFile(null);
    setSubmitted(false);
    setSubmittedData(null);
    setSubPanelOpen(false);
  };

  return (
    // No <style> block — all fonts, keyframes, and global rules live in index.css
    <div className="font-sans bg-[#0d1b2a] min-h-screen text-[#faf8f3] overflow-x-hidden relative">

      {/*
        Dual radial-gradient glow — cannot be expressed as a single Tailwind class.
        Defined as .bg-radial-glow in index.css.
      */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow" />

      {/* ── Success Modal — rendered above everything when submitted ── */}
      {submitted && submittedData && (
        <SuccessModal
          refNumber={submittedData.ref}
          reasons={submittedData.reasons}
          dirName={submittedData.dirName}
          dirEmail={submittedData.dirEmail}
          onClose={handleCloseModal}
        />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center px-5 py-14">

          {/* ── Hero ── */}
          {/* animate-fade-up defined in index.css */}
          <div className="text-center max-w-[600px] mb-11 animate-fade-up">
            <div className="font-mono text-[11px] uppercase tracking-[3px] text-[#c9a84c] mb-4">
              Land Tax Dispute
            </div>
            <h1 className="font-serif text-[clamp(28px,5vw,48px)] font-bold leading-[1.15] text-white mb-3">
              Submit Your <em className="italic text-[#c9a84c]">Dispute</em>
            </h1>
            <h1 className="font-serif text-[clamp(28px,5vw,48px)] font-bold leading-[1.15] text-white mb-3">
              Application
            </h1>
            <p className="text-[15px] font-light text-[#8a9bb0] leading-[1.7] max-w-[440px] mx-auto">
              Upload your land tax bill, select your grounds for dispute, and provide your
              details. Our team will respond within 5 business days.
            </p>
          </div>

          {/* ── Card — always visible; modal overlays it on success ── */}
          {/* animate-fade-up-delayed defined in index.css */}
          <div className="bg-[#1a2f45] border border-[#c9a84c]/[0.18] rounded-[20px] p-11 w-full max-w-[640px] relative overflow-hidden animate-fade-up-delayed">

            {/*
              Gold top accent line — gradient on a background property, not a CSS border.
              Defined as .gold-top-line in index.css.
            */}
            <div className="absolute top-0 left-0 right-0 h-[2px] gold-top-line" />

            <form onSubmit={formik.handleSubmit} noValidate>

                {/* ── Dropzone ── */}
                <div
                  className={`border-2 border-dashed rounded-[14px] p-11 text-center cursor-pointer relative transition-all duration-200 bg-white/[0.02] ${
                    dragOver
                      ? "border-[#c9a84c] bg-[#c9a84c]/[0.05] -translate-y-0.5"
                      : "border-[#c9a84c]/35 hover:border-[#c9a84c] hover:bg-[#c9a84c]/[0.05] hover:-translate-y-0.5"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
                  }}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) handleFileSelect(e.target.files[0]);
                    }}
                  />
                  <div
                    className={`size-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                      dragOver ? "bg-[#c9a84c]/20 scale-105" : "bg-[#c9a84c]/10"
                    }`}
                  >
                    <UploadIcon />
                  </div>
                  <div className="font-serif text-[18px] font-semibold text-white mb-1.5">
                    Upload Land Tax Bill
                  </div>
                  <div className="text-[13px] text-[#8a9bb0] mb-3">
                    Drag & drop your PDF here, or click to browse
                  </div>
                  <span className="inline-block bg-[#c9a84c]/[0.12] border border-[#c9a84c]/30 text-[#c9a84c] font-mono text-[10px] tracking-wide px-3 py-1 rounded-full">
                    PDF only · file saved to Downloads on select
                  </span>
                </div>

                {/* ── File preview ── */}
                {file && (
                  <div className="flex items-center gap-3 bg-[#c9a84c]/[0.07] border border-[#c9a84c]/25 rounded-[10px] px-4 py-3 mt-3">
                    <div className="w-9 h-9 bg-[#c9a84c]/[0.15] rounded-[7px] flex items-center justify-center flex-shrink-0">
                      <FileIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-white truncate">
                        {file.name}
                      </div>
                      <div className="font-mono text-[10px] text-[#8a9bb0] mt-0.5">
                        {file.size < 1048576
                          ? (file.size / 1024).toFixed(1) + " KB"
                          : (file.size / 1048576).toFixed(2) + " MB"}{" "}
                        · PDF
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-[#8a9bb0] hover:text-[#e05c5c] p-1 rounded transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* ── Your Details ── */}
                <Divider label="Your Details" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldWrapper
                    label="Full Name"
                    error={formik.errors.fullName}
                    touched={formik.touched.fullName}
                  >
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Jane Smith"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputBase}
                    />
                  </FieldWrapper>
                  <FieldWrapper
                    label="Email Address"
                    error={formik.errors.email}
                    touched={formik.touched.email}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="jane@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputBase}
                    />
                  </FieldWrapper>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldWrapper
                    label="Property Address"
                    error={formik.errors.propAddress}
                    touched={formik.touched.propAddress}
                  >
                    <input
                      type="text"
                      name="propAddress"
                      placeholder="123 Example St, Sydney NSW"
                      value={formik.values.propAddress}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputBase}
                    />
                  </FieldWrapper>

                  {/* Assessment Year — From / To dropdowns */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-widest text-[#c9a84c] mb-2">
                      Assessment Year
                    </label>
                    <div className="flex items-center gap-2">
                      {/* select-arrow class defined in index.css (SVG bg-image) */}
                      <select
                        name="assessYearFrom"
                        value={formik.values.assessYearFrom}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`${selectBase} select-arrow`}
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <span className="text-white font-mono">-</span>
                      <select
                        name="assessYearTo"
                        value={formik.values.assessYearTo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`${selectBase} select-arrow`}
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    {formik.touched.assessYearTo && formik.errors.assessYearTo && (
                      <p className="mt-1.5 text-[11px] font-mono text-[#e05c5c]">
                        {formik.errors.assessYearTo}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Client Director ── */}
                <Divider label="Client Director" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldWrapper
                    label="Director Name"
                    error={formik.errors.dirName}
                    touched={formik.touched.dirName}
                  >
                    <input
                      type="text"
                      name="dirName"
                      placeholder="e.g. Michael Huang"
                      value={formik.values.dirName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputBase}
                    />
                  </FieldWrapper>
                  <FieldWrapper
                    label="Director Email Address"
                    error={formik.errors.dirEmail}
                    touched={formik.touched.dirEmail}
                  >
                    <input
                      type="email"
                      name="dirEmail"
                      placeholder="avi.sharabi@ymlgroup.com.au"
                      value={formik.values.dirEmail}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputBase}
                    />
                  </FieldWrapper>
                </div>

                <div className="flex items-start gap-2.5 bg-[#c9a84c]/[0.06] border border-[#c9a84c]/20 rounded-[10px] px-4 py-3 mt-1 mb-4 text-[12px] text-[#8a9bb0] leading-relaxed">
                  <InfoIcon />
                  <span>
                    The client director will be kept informed throughout the dispute process
                    and may be contacted by our team for further clarification.
                  </span>
                </div>

                {/* ── Grounds for Dispute ── */}
                <Divider label="Grounds for Dispute" />

                <div className="mb-4">
                  <label className="block font-mono text-[11px] uppercase tracking-widest text-[#c9a84c] mb-3">
                    Select all that apply
                  </label>

                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-[12px] px-5 py-[18px]">
                    {PRIMARY_REASONS.map((reason, idx) => (
                      <div key={reason.id} className={idx > 0 ? "mt-3.5" : ""}>
                        <Checkbox
                          checked={formik.values.reasons.includes(reason.id)}
                          onChange={() => toggleReason(reason.id)}
                          label={reason.value}
                        />

                        {/* Sub-panel for property-specific constraints */}
                        {reason.hasSub &&
                          formik.values.reasons.includes(reason.id) &&
                          subPanelOpen && (
                            <div className="mt-3 ml-8 bg-[#c9a84c]/[0.04] border border-[#c9a84c]/[0.14] rounded-[10px] px-4 py-3.5">
                              <div className="font-mono text-[10px] uppercase tracking-widest text-[#c9a84c] mb-3">
                                Select applicable constraints
                              </div>
                              {SUB_CONSTRAINTS.map((sc, i) => (
                                <div key={sc.id} className={i > 0 ? "mt-2.5" : ""}>
                                  <Checkbox
                                    sub
                                    checked={formik.values.subConstraints.includes(sc.id)}
                                    onChange={() => toggleSub(sc.id)}
                                    label={sc.value}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>

                  {formik.touched.reasons && formik.errors.reasons && (
                    <p className="mt-2 text-[11px] font-mono text-[#e05c5c]">
                      {formik.errors.reasons}
                    </p>
                  )}
                </div>

                {/* ── Additional Notes ── */}
                <FieldWrapper label="Additional Notes" optional>
                  <textarea
                    name="addNotes"
                    placeholder="Provide any further context or supporting details about your dispute…"
                    value={formik.values.addNotes}
                    onChange={formik.handleChange}
                    rows={3}
                    className={`${inputBase} resize-y min-h-[78px] leading-relaxed`}
                  />
                </FieldWrapper>

                {/* ── Submit button ── */}
                {/*
                  btn-gold-gradient uses linear-gradient(135deg, ...) defined in index.css.
                  Tailwind's bg-gradient-to-br only supports directional keywords, not degrees.
                */}
                <button
                  type="submit"
                  disabled={!file || !formik.isValid}
                  className="btn-gold-gradient w-full py-[15px] rounded-[12px] font-sans text-[15px] font-semibold text-[#0d1b2a] cursor-pointer transition-all duration-200 flex items-center justify-center gap-2.5 mt-1.5 disabled:opacity-45 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_8px_28px_rgba(201,168,76,0.35)]"
                >
                  <SendIcon />
                  Submit Dispute Application
                </button>

                {(!file || !formik.isValid) && (
                  <p className="text-center font-mono text-[10px] text-[#8a9bb0] mt-2.5">
                    {!file
                      ? "Upload a PDF to enable submission"
                      : "Please fill in all required fields to continue"}
                  </p>
                )}
              </form>
          </div>
        </main>
      </div>
    </div>
  );
}