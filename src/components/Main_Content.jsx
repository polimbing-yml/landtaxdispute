import { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  UploadIcon,
  FileIcon,
  CheckIcon,
  SendIcon,
  UserIcon,
  MailIcon,
  InfoIcon,
  CloseIcon,
  SuccessRingIcon,
} from "../assets/icons";

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

// ─── Reusable field wrapper ───────────────────────────────────
// All class strings live in index.css: .field-group .field-label
// .field-label-optional .field-error
const FieldWrapper = ({ label, error, touched, children, optional }) => (
  <div className="field-group">
    <label className="field-label">
      {label}
      {optional && <span className="field-label-optional">(optional)</span>}
    </label>
    {children}
    {touched && error && <p className="field-error">{error}</p>}
  </div>
);

// ─── Custom Checkbox ─────────────────────────────────────────
// .checkbox-label  .checkbox-label--sub  .checkbox-box
// .checkbox-box--sub  .checkbox-box--checked  — all in index.css
const Checkbox = ({ checked, onChange, label, sub = false }) => (
  <label className={`checkbox-label${sub ? " checkbox-label--sub" : ""}`}>
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    <span className={`checkbox-box${sub ? " checkbox-box--sub" : ""}${checked ? " checkbox-box--checked" : ""}`}>
      {checked && <CheckIcon size={sub ? 9 : 11} />}
    </span>
    <span className="leading-snug">{label}</span>
  </label>
);

// ─── Divider ─────────────────────────────────────────────────
// .form-divider  .form-divider-line  .form-divider-label — index.css
const Divider = ({ label }) => (
  <div className="form-divider">
    <div className="form-divider-line" />
    <span className="form-divider-label">{label}</span>
    <div className="form-divider-line" />
  </div>
);

// ─── Success Modal ────────────────────────────────────────────
// All layout/styling delegated to index.css modal classes.
// All icons imported from src/assets/icons.jsx.
const SuccessModal = ({ refNumber, reasons, dirName, dirEmail, onClose }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>

      {/* Gold top accent line — .gold-top-line in index.css */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[20px] gold-top-line" />

      {/* X Close button — CloseIcon from src/assets/icons */}
      <button onClick={onClose} className="modal-close-btn" aria-label="Close">
        <CloseIcon className="w-4 h-4" strokeWidth="2.5" />
      </button>

      {/* Animated success ring — SuccessRingIcon from src/assets/icons */}
      <div className="modal-ring">
        <SuccessRingIcon />
      </div>

      <h2 className="modal-heading">Document Received</h2>
      <p className="modal-description">
        Your land tax bill has been{" "}
        <span className="text-highlight">successfully received</span> and is currently being{" "}
        <span className="text-highlight">analysed by our team</span>. A confirmation has been
        dispatched to your email address.
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
                r.sub ? "text-[#8a9bb0] text-xs pl-8" : "text-[13px] text-[#faf8f3] pl-4.5"
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

      {/* Director contact */}
      <div className="modal-director-box">
        <div className="label-gold flex items-center gap-2">
          <UserIcon /> Client Director Contact
        </div>
        <div className="modal-director-row">
          <div className="modal-director-icon"><UserIcon /></div>
          <div>
            <div className="label-muted">Director Name</div>
            <div className="text-sm font-medium text-white">{dirName || "(not provided)"}</div>
          </div>
        </div>
        <div className="modal-director-row">
          <div className="modal-director-icon"><MailIcon /></div>
          <div>
            <div className="label-muted">Director Email</div>
            <div className="text-sm font-medium text-white break-all">{dirEmail || "(not provided)"}</div>
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
    formik.resetForm();
    setFile(null);
    setSubmitted(false);
    setSubmittedData(null);
    setSubPanelOpen(false);
  };

  return (
    // All styles live in index.css — no inline Tailwind strings for layout/theme
    <div className="page-shell">

      {/* Dual radial-gradient glow — .bg-radial-glow in index.css */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow" />

      {/* Success Modal */}
      {submitted && submittedData && (
        <SuccessModal
          refNumber={submittedData.ref}
          reasons={submittedData.reasons}
          dirName={submittedData.dirName}
          dirEmail={submittedData.dirEmail}
          onClose={handleCloseModal}
        />
      )}

      <div className="page-content">
        <main className="page-main">

          {/* ── Hero ── */}
          <div className="hero">
            <div className="hero-eyebrow">Land Tax Dispute</div>
            <h1 className="hero-title">
              Submit Your <em className="italic text-[#c9a84c]">Dispute</em>
            </h1>
            <h1 className="hero-title">Application</h1>
            <p className="hero-body">
              Upload your land tax bill, select your grounds for dispute, and provide your
              details. Our team will respond within 5 business days.
            </p>
          </div>

          {/* ── Form Card ── */}
          <div className="form-card">

            {/* Gold accent bar — .gold-top-line in index.css */}
            <div className="absolute top-0 left-0 right-0 h-0.5 gold-top-line" />

            <form onSubmit={formik.handleSubmit} noValidate>

              {/* ── Dropzone ── */}
              <div
                className={`dropzone${dragOver ? " dropzone--active" : ""}`}
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
                <div className={`dropzone-icon-wrap${dragOver ? " dropzone-icon-wrap--active" : ""}`}>
                  <UploadIcon />
                </div>
                <div className="dropzone-title">Upload Land Tax Bill</div>
                <div className="dropzone-hint">Drag & drop your PDF here, or click to browse</div>
                <span className="dropzone-badge">PDF only · file saved to Downloads on select</span>
              </div>

              {/* ── File preview ── */}
              {file && (
                <div className="file-preview">
                  <div className="file-preview-icon"><FileIcon /></div>
                  <div className="flex-1 min-w-0">
                    <div className="file-preview-name">{file.name}</div>
                    <div className="file-preview-meta">
                      {file.size < 1048576
                        ? (file.size / 1024).toFixed(1) + " KB"
                        : (file.size / 1048576).toFixed(2) + " MB"}{" "}
                      · PDF
                    </div>
                  </div>
                  {/* CloseIcon with smaller size for the file-remove button */}
                  <button type="button" onClick={() => setFile(null)} className="file-preview-remove">
                    <CloseIcon className="w-3.5 h-3.5" strokeWidth="2" />
                  </button>
                </div>
              )}

              {/* ── Your Details ── */}
              <Divider label="Your Details" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldWrapper label="Full Name" error={formik.errors.fullName} touched={formik.touched.fullName}>
                  <input
                    type="text" name="fullName" placeholder="Jane Smith"
                    value={formik.values.fullName}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>
                <FieldWrapper label="Email Address" error={formik.errors.email} touched={formik.touched.email}>
                  <input
                    type="email" name="email" placeholder="jane@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldWrapper label="Property Address" error={formik.errors.propAddress} touched={formik.touched.propAddress}>
                  <input
                    type="text" name="propAddress" placeholder="123 Example St, Sydney NSW"
                    value={formik.values.propAddress}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>

                {/* Assessment Year — From / To dropdowns */}
                <div>
                  <label className="field-label">Assessment Year</label>
                  <div className="flex items-center gap-2">
                    {/* .select-arrow defined in index.css (SVG bg-image) */}
                    <select
                      name="assessYearFrom" value={formik.values.assessYearFrom}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className="select-base select-arrow"
                    >
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <span className="text-white font-mono">-</span>
                    <select
                      name="assessYearTo" value={formik.values.assessYearTo}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className="select-base select-arrow"
                    >
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  {formik.touched.assessYearTo && formik.errors.assessYearTo && (
                    <p className="field-error">{formik.errors.assessYearTo}</p>
                  )}
                </div>
              </div>

              {/* ── Client Director ── */}
              <Divider label="Client Director" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldWrapper label="Director Name" error={formik.errors.dirName} touched={formik.touched.dirName}>
                  <input
                    type="text" name="dirName" placeholder="e.g. Michael Huang"
                    value={formik.values.dirName}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>
                <FieldWrapper label="Director Email Address" error={formik.errors.dirEmail} touched={formik.touched.dirEmail}>
                  <input
                    type="email" name="dirEmail" placeholder="avi.sharabi@ymlgroup.com.au"
                    value={formik.values.dirEmail}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>
              </div>

              <div className="info-note">
                <InfoIcon />
                <span>
                  The client director will be kept informed throughout the dispute process
                  and may be contacted by our team for further clarification.
                </span>
              </div>

              {/* ── Grounds for Dispute ── */}
              <Divider label="Grounds for Dispute" />

              <div className="field-group">
                <label className="field-label">Select all that apply</label>
                <div className="checkbox-group">
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
                          <div className="sub-panel">
                            <div className="sub-panel-label">Select applicable constraints</div>
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
                  <p className="field-error">{formik.errors.reasons}</p>
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
                  className="input-base input-textarea"
                />
              </FieldWrapper>

              {/* ── Submit button ── */}
              {/* .btn-gold-gradient uses linear-gradient(135deg) — defined in index.css */}
              <button
                type="submit"
                disabled={!file || !formik.isValid}
                className="btn-gold-gradient btn-submit"
              >
                <SendIcon />
                Submit Dispute Application
              </button>

              {(!file || !formik.isValid) && (
                <p className="btn-submit-hint">
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