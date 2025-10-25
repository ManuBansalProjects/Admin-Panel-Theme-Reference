import { PHONE_NO_LENGTH } from "./Constants";
import * as Yup from "yup";


export const PHONE_VALIDATION = Yup.string()
  .test('phone_required', 'label_phone_number_required_error', (value) => {
    const phoneNumber = (value && value.length ? value.split(" ")[1] : "");
    return phoneNumber && phoneNumber.length;
  }
  )
  .test('phone_digit_error', 'label_phone_number_digits_error', (value) => {
    const phoneNumber = (value && value.length ? value.split(" ")[1] : "");
    return phoneNumber && /^\d+$/.test(phoneNumber);
  }
  )
  .test('phone_min_length', 'label_phone_number_min_length_error', (value) => {
    const phoneNumber = (value && value.length ? value.split(" ")[1] : "");
    return phoneNumber && phoneNumber.length >= PHONE_NO_LENGTH.min;
  }
  )
  .test('phone_max_length', 'label_phone_number_max_length_error', (value) => {
    const phoneNumber = (value && value.length ? value.split(" ")[1] : "");
    return phoneNumber && phoneNumber.length <= PHONE_NO_LENGTH.max;
  }
  );

export const COMMON_INPUT_VALIDATION = Yup.string().trim()
  .matches(/^[A-Za-zÀ-ÿ0-9\s\.,'"-]*$/, "valid_format_error")
  // .test('no-html-tags', "error_html_tag", (value) => {
  //   const htmlTagsRegex = /<[^>]*>/g;
  //   if (htmlTagsRegex.test(value)) {
  //     return false;
  //   }
  //   return true;
  // })
  .test("not-only-numbers", ("valid_format_error"), value => {
    return /[A-Za-z]/.test(value);
  });

export const NO_HTML_TAG = Yup.string().trim()
  .test('no-html-tags', "error_html_tag", (value) => {
    const htmlTagsRegex = /<[^>]*>/g;
    if (htmlTagsRegex.test(value)) {
      return false;
    }
    return true;
  });

// export const EMAIL_VALIDATION = Yup.string()
//   .trim()
//   .required('Email is required')
//   .test('custom-email', 'Invalid email format', (value) => {
//     const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
//     return value && regex.test(value);
//   });
// export const EMAIL_VALIDATION = Yup.string()
//   .trim()
//   .required('label_email_error')
//   .test('custom-email', 'label_email_invalid_format_error', (value) => {
//     const regex = new RegExp('^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
//     return value && regex.test(value);
//   });
export const EMAIL_VALIDATION = Yup.string()
  .trim()
  .required('label_email_error')
  .test('custom-email', 'label_email_invalid_format_error', (value) => {
    if (!value) return false;

    // Standard-ish email regex (covers most real-world use cases)
    const regex = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

    if (!regex.test(value)) return false;

    const [localPart, domain] = value.split('@');

    // Additional standard checks:
    if (!localPart || !domain) return false;
    if (localPart.includes('..')) return false;            // no consecutive dots
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false; // no leading/trailing dots
    if (domain.includes('..')) return false;               // no consecutive dots in domain
    if (domain.startsWith('-') || domain.endsWith('-')) return false; // domain shouldn't start/end with hyphen

    return true;
  });

