// src/components/validationSchemas.js
import * as Yup from "yup";

export const numberFieldSchema = Yup.number()
  .typeError("Must be a valid number")
  .min(0, "Value must be at least 0")
  .required("This field is required");
