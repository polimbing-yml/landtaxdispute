// src/hooks/useDisputeForm.js
import { useFormik } from "formik";
import { disputeSchema } from "../validation/disputeSchema";
import { PRIMARY_REASONS, SUB_CONSTRAINTS } from "../constants/reasons";
import { CURRENT_YEAR } from "../constants/years";

export const useDisputeForm = (file, onSubmitSuccess) => {
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
    onSubmit: (values) => {
      if (!file) {
        alert("Please upload a PDF file.");
        return;
      }

      // Build reasons list with sub-constraints if applicable
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

      // Generate reference number
      const refNumber = `LTD-${CURRENT_YEAR}-${Math.floor(10000 + Math.random() * 90000)}`;

      // Pass data back to MainContent
      onSubmitSuccess({
        ref: refNumber,
        reasons,
        dirName: values.dirName,
        dirEmail: values.dirEmail,
      });
    },
  });
};