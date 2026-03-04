import { useFormik } from "formik";
import { disputeSchema } from "../validation/disputeSchema";
import { PRIMARY_REASONS, SUB_CONSTRAINTS } from "../constants/reasons";
import { CURRENT_YEAR } from "../constants/years";
import { useSubmitDisputeMutation } from "../store/disputeApi";

// `file` is passed here for future extension (e.g. appending as FormData) but not used
// by the current JSON-based API.  `onSuccess` is an optional callback that will be
// invoked after a successful server response.  MainContent uses it to populate the
// modal state with a nicely formatted object including the reference number returned
// by the backend.
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
      // build payload exactly as the API expects
      const payload = {
        applicantFullName: values.fullName,
        applicantEmail: values.email,
        directorName: values.dirName,
        directorEmail: values.dirEmail,
        propertyAddress: values.propAddress,
        assessmentYear: values.assessYearTo,
        additionalNotes: values.addNotes,
        grounds: values.reasons.map((r) => {
          const primary = PRIMARY_REASONS.find((p) => p.id === r);
          return primary ? primary.value : r;
        }),
        constraints: values.subConstraints.map((sc) => {
          const c = SUB_CONSTRAINTS.find((x) => x.id === sc);
          return c ? c.value : sc;
        }),
      };

      console.log("Payload being sent:", payload);

      try {
        const result = await submitDispute(payload).unwrap();
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

          onSuccess(uiData, payload, result);
        }
      } catch (err) {
        console.error("Submission failed:", err);
        alert("There was an error submitting your dispute. Please try again.");
      }
    },
  });
};