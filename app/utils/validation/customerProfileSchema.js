import * as yup from 'yup';

export const customerProfileSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  contact: yup.string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number"),
  age: yup.number()
    .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value))
    .nullable()
    .typeError("Age must be a number")
    .positive("Age must be positive")
    .integer("Age must be a whole number"),
  whatsapp: yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .matches(/^[0-9]{10}$/, { message: "Must be a valid 10-digit number", excludeEmptyString: true }),
  email: yup.string()
    .email("Invalid email format")
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  leadOwner: yup.string().required("Lead Owner is required"),
  leadStage: yup.string().required("Lead Stage is required"),
  leadSource: yup.string().required("Lead Source is required"),
  city: yup.string().nullable(),
  notes: yup.string().nullable(),
  
  // Activity fields (validated manually on click, so they are nullable here)
  activityType: yup.string().nullable(),
  activityAssignTo: yup.string().nullable(),
  activityNotes: yup.string().nullable(),
  activityDate: yup.string().nullable(),
  activityTime: yup.string().nullable(),
  
  sendWhatsApp: yup.boolean().nullable(),
  
  // Initial Address Fields
  addressLabel: yup.string().nullable(),
  flatNo: yup.string().nullable(),
  street: yup.string().nullable(),
  landmark: yup.string().nullable(),
  pincode: yup.string().nullable(),
});