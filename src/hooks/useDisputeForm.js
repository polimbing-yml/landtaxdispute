import { useFormik } from "formik";
import { disputeSchema } from "../validation/disputeSchema";
import { PRIMARY_REASONS, SUB_CONSTRAINTS } from "../constants/reasons";
import { CURRENT_YEAR } from "../constants/years";
import { useSubmitDisputeMutation } from "../store/disputeApi";

// `file` is passed to build FormData with the uploaded PDF.  `onSuccess` is an optional
// callback that will be invoked after a successful server response.  MainContent uses it
// to populate the modal state with the reference number returned by the backend.
export const useDisputeForm = (file, onSuccess) => {
  const [submitDispute] = useSubmitDisputeMutation();

  return useFormik({
    initialValues: {
      fullName: "",
      email: "",
      propAddress: "",
      assessYearFrom: CURRENT_YEAR,
      assessYearTo: CURRENT_YEAR,
      dirName: "",
      dirEmail: "",
      reasons: [],
      subConstraints: [],
      addNotes: "",
    },
    validationSchema: disputeSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      // build FormData with field names matching the backend schema
      const formData = new FormData();
      formData.append("ApplicantFullName", values.fullName);
      formData.append("ApplicantEmail", values.email);
      formData.append("PropertyAddress", values.propAddress);
      formData.append("DirectorName", values.dirName);
      formData.append("DirectorEmail", values.dirEmail);
      formData.append("AssessmentYearFrom", String(values.assessYearFrom));
      formData.append("AssessmentYearTo", String(values.assessYearTo));
      formData.append("AdditionalNotes", values.addNotes || "");

      // append grounds as array items
      const groundsValues = values.reasons.map((r) => {
        const primary = PRIMARY_REASONS.find((p) => p.id === r);
        return primary ? primary.value : r;
      });
      groundsValues.forEach((g) => formData.append("Grounds", g));

      // append file if selected
      if (file) {
        formData.append("SupportingDocument", file);
      }

      console.log("FormData being sent");

      try {
        const result = await submitDispute(formData).unwrap();
        console.log("Server response:", result);

        // call the optional success callback with data for the UI
        if (typeof onSuccess === "function") {
          // format reasons/subs for the Success_Form modal
          const formattedReasons = [];
          values.reasons.forEach((id) => {
            const prim = PRIMARY_REASONS.find((p) => p.id === id);
            if (prim) formattedReasons.push({ text: prim.value, sub: false });
            else formattedReasons.push({ text: id, sub: false });
          });
          values.subConstraints.forEach((id) => {
            const sub = SUB_CONSTRAINTS.find((s) => s.id === id);
            if (sub) formattedReasons.push({ text: sub.value, sub: true });
            else formattedReasons.push({ text: id, sub: true });
          });

          const uiData = {
            // backend is expected to return a reference string; adapt as needed
            ref: result?.referenceNumber || result?.ref || "",
            reasons: formattedReasons,
            dirName: values.dirName,
            dirEmail: values.dirEmail,
          };

          onSuccess(uiData, formData, result);
        }
      } catch (err) {
        console.error("Submission failed:", err);
        alert("There was an error submitting your dispute. Please try again.");
      }
    },
  });
};