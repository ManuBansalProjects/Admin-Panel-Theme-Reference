import flagEn from "./../assets/website/images/language-flag.png"
import flagSpain from "./../assets/website/images/spain.png"
import flagGermany from "./../assets/website/images/germany.png"
import flagHungary from "./../assets/website/images/Hungarian.png"

export const EDITOR_TOOLBAR = [
  {
    name: "clipboard",
    groups: [
      "Cut",
      "Copy",
      "Paste",
      "PasteText",
      "PasteFromWord",
      "-",
      "Undo",
      "Redo",
    ],
  },
  {
    name: "basicStyles",
    groups: [
      "Bold",
      "Italic",
      "Underline",
      "Strike",
      "Subscript",
      "Superscript",
    ],
  },
  {
    name: "paragraph",
    groups: ["NumberedList", "BulletedList", "Outdent", "Indent", "Blockquote"],
  },
  {
    name: "alignment",
    groups: [
      "JustifyLeft",
      "JustifyCenter",
      "JustifyRight",
      "JustifyBlock",
      "BidiLtr",
      "BidiRtl",
    ],
  },
  { name: "links", groups: ["Link", "Unlink", "Image"] },
  { name: "table", groups: ["Table", "TableToolbar"] },
  {
    name: "styles",
    groups: ["Font", "FontSize", "Format", "TextColor", "BGColor"],
  },
  { name: "miscellaneous", groups: ["Find", "Replace", "Source"] },
  { name: "insert", groups: ["cstButton2"] },
];
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const DEVMODE = {
  USERNAME: "DEV@ADMIN",
  PASSWORD: "Dev@1234",
  SESSION_TIME: 300000 /** 5 MINUTES */,
};
export const SWAL_SETTINGS = {
  customClass: "swal-wide",
  position: "top-right",
  showConfirmButton: false,
  timer: 7000,
  toast: true,
  showClass: {
    popup: "animate__animated animate__bounceInRight",
  },
  hideClass: {
    popup: "animate__animated animate__bounceOutRight",
  },
  showCloseButton: true,
  // timerProgressBar: true,
};
export const FONTOPTIONS = [
  { value: "Arial(sans - serif)", label: "Arial(sans - serif)" },
  { value: " Verdana(sans - serif)", label: " Verdana(sans - serif)" },
  { value: "Tahoma(sans - serif)", label: "Tahoma(sans - serif)" },
  { value: "Trebuchet MS(sans - serif)", label: "Trebuchet MS(sans - serif)" },
  { value: "Times New Roman(serif)", label: "Times New Roman(serif)" },
  { value: "Georgia(serif)", label: "Georgia(serif)" },
  { value: "Garamond(serif)", label: "Garamond(serif)" },
  { value: "Courier New(monospace)", label: "Courier New(monospace)" },
  { value: "Brush Script MT(cursive)", label: "Brush Script MT(cursive)" },
];
export const showFilterlist = [
  { name: "list_heading_status", status__id: "" },
  { name: "btn_active", status__id: "1" },
  { name: "btn_inactive", status__id: "0" },
];

export const languageSpoken = [
  { name: "English", code: "en", flag: flagEn },
  { name: "German", code: "de", flag: flagGermany },
  { name: "Spanish", code: "es", flag: flagSpain },
  { name: "Hungarian", code: "hu", flag: flagHungary }
];

export const questionType = [
  { name: "Single Choice", value: "single_choice" },
  { name: "Multiple Choice", value: "multiple_choice" }
];
export const subscriptionType = [
  { name: "Free", value: "free" },
  { name: "Premium", value: "premium" },
  { name: "Credit Base", value: "credit_base" }
];
// export const subscriptionPlanType = [
//   { name: "Monthly", value: "monthly" },
//   { name: "Quarterly", value: "quarterly" },
//   { name: "Yearly", value: "yearly" },
// ];
export const subscriptionPlanType = [
  { name: "Question", value: "question" },
  { name: "Report", value: "report" },
];
export const subscriptionPlanTypeObj = {
  question: 'Question',
  report: 'Report'
}

export const discountType = [
  { name: "FLAT AMOUNT", value: "flat_amount" },
  { name: "PERCENTAGE", value: "percentage" },
];
export const discountTypeObj = {
  flat_amount: 'FLAT AMOUNT',
  percentage: 'PERCENTAGE'
}


export const earningType = [
  { name: "Question", value: "question" },
  { name: "Report", value: "report" },
  { name: "Discount", value: "discount" },
];



export const showFilterOfInvitations = [
  { name: "Type", status__id: "" },
  { name: "Schedule", status__id: "schedule" },
  { name: "Sent", status__id: "send_now" },
  { name: "Send Later", status__id: "send_later" },
];
export const categoryList = [
  { key: "cat1", label: "Category1" },
  { key: "cat2", label: "Category2" },
];
export const filterOfInvitations = [
  { name: "Status", status__id: "" },
  { name: "No Reply", status__id: 0 },
  { name: "Will Attend", status__id: 1 },
  { name: "Declined", status__id: 2 },
];
export const TICKET_TYPES = {
  EVENT: "event",
  AGENDA: "agenda",
  HOTEL: "hotel",
};
export const SURVEY_TYPES = {
  SURVEY: "survey",
  QUESTION_SET: "question-set",
};
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  SINGLE_CHOICE: "single_choice",
  SHORT_ANS: "short_ans",
  LONG_ANS: "long_ans",
  SLIDER: "slider",
  EMOJI: "emoji",
  DROPDOWN: "dropdown",
  RATING: "rating",
  LIKE_DISLIKE: "likeStatus",
  TIME: "time",
  CALENDAR: "calendar",
  SIGNATURE: "signature",
  FREE_HAND_DRAWING: "free_hand_drawing",
  VOICE_MEMO: "voice_memo",
  PHOTO_UPLOAD: "photo_upload",
  VIDEO_UPLOAD: "video_upload",
  EXTRA_INFORMATION: "extra_information",
};

export const GENDER = [ "Male", "Female" ];

export const ROLE = {
  SUPER_ADMIN: "super_admin",
  PSYCHIC: "psychic",
};

export const USER_TYPE = {
  Primary: "primary",
  Guest: "secondary",
};

export const REGISTRATION_TYPE = {
  DEACTIVE: 0,
  ACTIVE: 1,
  CANCELLED: 2,
};

export const EMAIL_TEMPLATE_TYPES = {
  DEFAULT: "default",
  PROMOTIONAL: "promotional",
};

export const EMAIL_STATUS = {
  PENDING: 0,
  IN_PROGRESS: 1,
  SUCCESS: 2,
  FAILED: 3,
};

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

export const TRANSACTION_TYPES = {
  PAYMENT: "payment",
  REFUND: "refund",
};

// export const INVITATION_STATUS = {
//     PENDING : 0,
//     ACCESPTED : 1,
//     REJECTED : 2
// }

export const CMS_PAGES_TYPES = {
  DEFAULT: "default",
  CUSTOM: "custom",
};

export const CMS_PAGES_POSITIONS = {
  HEADER: "header",
  FOOTER: "footer",
  OTHER: "other",
  // NONE: "none"
};

export const FOOTER_MENUS = {
  COMPANY: "company",
  IMPORTANT_LINKS: "important_links",
};

export const DEFAULT_EMAIL_OPTIONS = [
  "web_url",
  "name",
  "title",
  "first_name",
  "middle_name",
  "last_name",
  "email",
  "salutation",
  "role",
  "phone_number",
  "work_phone_number",
];

export const INVITATION_STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
};

export const DYNAMIC_VARIABLES = {
  SERVER_URL: process.env.REACT_APP_API_URL.replace("/webservice/api/v1", ""),
};

export const EXPERTISE = [
  { name: "Tarot Reading", value: "tarot_reading" },
  { name: "Astrologer", value: "astrologer" }
]
export const SERVICES = {
  tarot_reading: "Tarot Reading",
  astrologer: "Astrologer"
}
export const OTP_LENGTH = 6;
export const NUMBER_CHARACTER_ONLY = /^\d+$/;
export const MOBILE_NUMBER_REGEX = /^[0-9]+$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const ATLEAST_ONE_SMALL_REGEX = /[a-z]/g;
export const ATLEAST_ONE_CAPITAL_REGEX = /[A-Z]/g;
export const ATLEAST_ONE_NUMBER_REGEX = /[0-9]/g;
export const ATLEAST_ONE_SPECIAL_CHARACTER_REGEX = /[^\w\s]/;
export const URL_REGEX = /^(ftp|http|https):\/\/[^ "]+$/;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;
export const INPUT_MAX_25 = 25;
export const INPUT_LENGTH_15 = 15
export const INPUT_LENGTH_20 = 20
export const INPUT_LENGTH_25 = 25;
export const INPUT_LENGTH_30 = 30;
export const INPUT_LENGTH_40 = 40;
export const INPUT_LENGTH_50 = 50;
export const INPUT_LENGTH_100 = 100;
export const INPUT_LENGTH_500 = 500;
export const TEXTAREA_MAX_LENGTH = 150;
export const TEXTAREA_MAX_LENGTH_200 = 200;

export const ROOM_TYPE = {
  Single_Room: "single_room",
  Double_Room: "double_room",
};
export const DEFAULT_SELECT_FIELD = [
  "Title",
  "Email",
  "Firstname",
  "Lastname",
  "Middlename",
];

export const INVITATION_TYPES = {
  SCHEDULE: "schedule",
  SEND_LATER: "send_later",
  SEND_NOW: "send_now",
};

export const CKEDITOR_CONFIG = {
  filebrowserUploadUrl: `${process.env.REACT_APP_API_URL}/admin/ckeditor/upload-ck-image`,
  allowedContent: true,
  fileTools_requestHeaders: {
    Authorization: `Bearer ${localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : ""}`,
  },
  extraAllowedContent: '*[*]',
  toolbar: [
    { name: 'source', items: ['Source'] },
    { name: 'functions', items: ['NewPage', 'ExportPdf', 'Print', 'Preview',] },
    { name: 'clipboard', items: ["Cut", "Copy", "Paste", "CopyFormatting"] },
    { name: 'miscellaneous', items: ["Undo", "Redo"] },
    { name: 'text-corrections', items: ['Find', 'Replace', 'SelectAll', 'Scayt'] },
    { name: 'basic-styles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote'] },
    { name: 'alignment', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'BidiLtr', 'BidiRtl'] },
    { name: 'links', items: ['Link', 'Unlink', 'Anchor', 'Image'] },
    { name: 'table', items: ['Table', 'TableToolbar'] },
    { name: 'styles', items: ['Font', 'FontSize', 'Format', 'TextColor', 'BGColor', 'PageBreak'] },
    { name: 'forms', items: ['Form', "Radio", "Checkbox", "TextField", "Textarea", "Select", 'MediaButton'] },
    { name: 'configs', items: ['Smiley', 'SpecialChar', 'Iframe', 'Maximize'] }
  ]
};

export const ANNOUNCEMENT_TYPES = {
  GENERAL: "general",
  EVENT: "event",
};

export const CURRENCY = [
  {
    name: "Dollar",
    code: "USD",
    sign: "$",
  },
  {
    name: "Euro",
    code: "EUR",
    sign: "€",
  },
  {
    name: "Pound",
    code: "GBP",
    sign: "£",
  },
];

export const EMAIL_TYPE = {
  Automatic: "automatic",
  Regular: "regular",
};
export const DEFAULT_MESSAGE_LIMIT = 10;

export const NOTIFICATIONS_TYPES = {
  DEFAULT: "default",
  UNREAD_CHAT_MESSAGE: "unread_chat_message",
};

export const REFUND_TYPES = {
  PARTIAL: "partial",
  FULL: "full",
};
export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  EMOJI: "emoji",
  FILE: "file",
};

export const COMMENT_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

export const VIDEO_UPLOAD = {
  CHUNK_SIZE: 1048576,
};

export const EXPORT_EXTENSION_TYPE = "csv";

export const WEB_LANGUAGES = [
  { name: "English", file_name: "en.json", code: "en" },
  { name: "Deutsch", file_name: "de.json", code: "de" },
];

export const getLangName = (fileName) => {
  let result = WEB_LANGUAGES.filter((item) => fileName === item.file_name);
  if (result.length) {
    return result[0].name;
  }
  return "";
};

export const getType = (type) => {
  if (type === TRANSACTION_TYPES.PAYMENT) {
    return <span className="badge badge-info">Payment</span>;
  } else if (type === TRANSACTION_TYPES.REFUND) {
    return <span className="badge badge-dark">Refund</span>;
  }
};
export const COOKIES_EXPIRATION = 7; /** In Days */
export const MAX_VOICE_MEMO_SECONDS = 30; /** In Seconds */
export const FILE_UPLOAD = {
  CHUNK_SIZE: 1048576 /** 1 MB */,
};

export const isProfileRequired = [
  { label: "Title", value: "title" },
  { label: "Salutation", value: "gender" },
  { label: "First Name", value: "first_name" },
  { label: "Middle Name", value: "middle_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Function", value: "event_function" },
  { label: "Phone Number", value: "phone_number" },
  { label: "Phone Number Work", value: "phone_number_work" },
  { label: "Files", value: "files" },
  { label: "Extra Info", value: "extra_info" },
];

export const PHONE_NO_LENGTH = {
  min: 8,
  max: 13
}

export const MENU_LOCATION = {
  menu_of_page_header: "header",
  menu_of_page_footer: "footer",
  menu_of_page_custom: "custom",
}

export const FOOTER_LOCATION = {
  main_location_of_page_footer: "main",
  base_location_of_page_footer: "base",
};


export const amountRegex = /^\d{1,9}(\.\d{1,2})?$/;
export const phoneRegExp = /^(\+?\d{1,4}[\s-]?)?(?!0+\s+,?$)\d{10,14}$/;

export const LOADER_TIMEOUT_TIME = 500;

export const SOCKET_EVENTS = {
  NEW_BOOKING:"new-booking",
  CANCEL_BOOKING:"cancel-booking",
  SESSION_REMINDER: "session-reminder",
  NEW_CHAT: "new-chat"
};

export const EVENT_TYPE = {
  "new-booking": "New Booking",
  "cancel-booking": "Cancle Booking",
  "session-reminder": "Session Reminder",
  "new-chat": "New Chat"
}

export const STATUS_CLASS = {
  booked: "text-success",     // green
  cancelled: "text-danger",   // red
  completed: "text-primary",  // blue
  pending: "text-warning",    // yellow/orange
  refunded: "text-info",        // light blue or cyan
  default: "text-muted"       // fallback color (gray)
};

export const ONE_HOUR_MS = 3600000; // 1 hour in milliseconds
export const ONE_HOUR_SECONDS = 3600; // 1 hour in seconds
export const ONE_MINUTE_MS = 60000; // 1 minute in milliseconds
export const ONE_MINUTE_SECONDS = 60; // 1 minute in seconds
export const ONE_SECOND_MS = 1000; // 1 second in milliseconds
export const ONE_SECOND_SECONDS = 1; // 1 second in seconds

export const SUBSCRIPTION_PRODUCT_IDS = {
  ONE_MONTH_SUBSCRIPTION: '1_month_subscription',
  THREE_MONTH_SUBSCRIPTION: '3_month_subscription',
  TWELVE_MONTH_SUBSCRIPTION:'12_month_subscription'
}

export const SUBSCRIPTION_NAMES = {
  '1_month_subscription' : 'Monthly',
  '3_month_subscription' : 'Quarterly',
  '12_month_subscription' : 'Yearly'
}
