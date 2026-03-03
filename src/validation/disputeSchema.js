// src/validation/disputeSchema.js
import * as Yup from "yup";

export const disputeSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  propAddress: Yup.string()
    .required("Property address is required"),

  assessYearFrom: Yup.number()
    .required("From year is required"),

  assessYearTo: Yup.number()
    .required("To year is required")
    .min(Yup.ref("assessYearFrom"), "To year must be ≥ From year"),

  dirName: Yup.string()
    .required("Director name is required"),

  dirEmail: Yup.string()
    .email("Invalid email address")
    .required("Director email is required"),

  reasons: Yup.array()
    .min(1, "Select at least one ground for dispute"),
});