// src/pages/MainContent.jsx
import { useState, useCallback } from "react";
import { useDisputeForm } from "../hooks/useDisputeForm";
import { years } from "../constants/years";
import { PRIMARY_REASONS, SUB_CONSTRAINTS } from "../constants/reasons";

import Dropzone from "../components/Dropzone";
import FilePreview from "../components/FilePreview";
import Divider from "../components/Divider";
import FieldWrapper from "../components/FieldWrapper";
import Checkbox from "../components/Checkbox";
import Success_Form from "../components/Success_Form";

import { InfoIcon, SendIcon } from "../assets/icons";


export default function MainContent() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [subPanelOpen, setSubPanelOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // the formik instance tracks `isSubmitting` automatically, which corresponds
  // to the async submission defined in `useDisputeForm`.  we don't need a second
  // mutation slice in this component.

  const handleFileSelect = useCallback((f) => {
    if (!f || f.type !== "application/pdf") return alert("Please upload a PDF file.");
    setFile(f);
  }, []);

  // pass `file` for future use and provide a callback that receives the UI-friendly
  // data (including `ref` from the server).  We ignore the other args here.
  const formik = useDisputeForm(file, (uiData) => {
    setSubmittedData(uiData);
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
    setSubPanelOpen(false);
    setSubmittedData(null);
  };

  return (
    <div className="page-shell">
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow" />

      {submittedData && (
        <Success_Form
          refNumber={submittedData.ref}
          reasons={submittedData.reasons}
          dirName={submittedData.dirName}
          dirEmail={submittedData.dirEmail}
          onClose={handleCloseModal}
        />
      )}

      <div className="page-content">
        <main className="page-main">

          {/* Hero */}
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

          {/* Form Card */}
          <div className="form-card">
            <div className="absolute top-0 left-0 right-0 h-0.5 gold-top-line" />

            <form onSubmit={formik.handleSubmit} noValidate>

              {/* Dropzone */}
              <Dropzone
                dragOver={dragOver}
                setDragOver={setDragOver}
                handleFileSelect={handleFileSelect}
              />

              {/* File Preview */}
              <FilePreview file={file} onRemove={() => setFile(null)} />

              {/* Your Details */}
              <Divider label="Your Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldWrapper label="Full Name" error={formik.errors.fullName} touched={formik.touched.fullName}>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Jane Smith"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>
                <FieldWrapper label="Email Address" error={formik.errors.email} touched={formik.touched.email}>
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldWrapper label="Property Address" error={formik.errors.propAddress} touched={formik.touched.propAddress}>
                  <input
                    type="text"
                    name="propAddress"
                    placeholder="123 Example St, Sydney NSW"
                    value={formik.values.propAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>

                {/* Assessment Year */}
                <div>
                  <label className="field-label">Assessment Year</label>
                  <div className="flex items-center gap-2">
                    <select
                      name="assessYearFrom"
                      value={formik.values.assessYearFrom}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="select-base select-arrow"
                    >
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <span className="text-white font-mono">-</span>
                    <select
                      name="assessYearTo"
                      value={formik.values.assessYearTo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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

              {/* Client Director */}
              <Divider label="Client Director" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldWrapper label="Director Name" error={formik.errors.dirName} touched={formik.touched.dirName}>
                  <input
                    type="text"
                    name="dirName"
                    placeholder="e.g. Michael Huang"
                    value={formik.values.dirName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="input-base"
                  />
                </FieldWrapper>
                <FieldWrapper label="Director Email Address" error={formik.errors.dirEmail} touched={formik.touched.dirEmail}>
                  <input
                    type="email"
                    name="dirEmail"
                    placeholder="avi.sharabi@ymlgroup.com.au"
                    value={formik.values.dirEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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

              {/* Grounds for Dispute */}
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

              {/* Additional Notes */}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={!file || !formik.isValid || formik.isSubmitting}
                className="btn-gold-gradient btn-submit"
              >
                <SendIcon />
                {formik.isSubmitting ? "Submitting…" : "Submit Dispute Application"}
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