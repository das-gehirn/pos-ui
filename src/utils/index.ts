import { PERMISSIONS_LIST, PermissionString } from "@/helpers/permission";
import { PhoneProps } from "@/interfaces";
import { Discount, InvoiceItem } from "@/interfaces/invoice";

import { format, isValid, parseISO } from "date-fns";
import { toLower, trim } from "lodash";

export const getErrorMessageFromApi = (error: any) => {
  return error?.response?.data?.response?.message || error.message;
};

// Define action types
type ActionType = { type: "UPDATE_FIELD"; fieldName: string; value: any } | { type: "RESET_FIELDS" };

// Define initial state
type FormState = {
  [P in string]: any;
};

// Reducer function
export const formReducer =
  (initialData: FormState) =>
  (state: FormState, action: ActionType): FormState => {
    const data = { ...initialData };
    switch (action.type) {
      case "UPDATE_FIELD":
        return { ...state, [action.fieldName]: action.value };
      case "RESET_FIELDS":
        return data;
      default:
        return state;
    }
  };

export const ROLE_OPTIONS = [
  {
    label: "Admin",
    value: "admin"
  },
  {
    label: "Manager",
    value: "manager"
  },
  {
    label: "Sales Personnel",
    value: "sales-personnel"
  },
  {
    label: "Warehouse Manager",
    value: "warehouse-manager"
  }
];

export const GENDER_OPTIONS = [
  {
    label: "Male",
    value: "male"
  },
  {
    label: "Female",
    value: "female"
  }
];

export const USER_STATUS_OPTIONS = [
  {
    label: "Active",
    value: "active"
  },
  {
    label: "Suspended",
    value: "suspended"
  },
  {
    label: "Pending",
    value: "pending"
  },
  {
    label: "Inactive",
    value: "inactive"
  }
];
// type ServiceType = "product";
export const SERVICES_OPTIONS = [
  {
    label: "product",
    value: "product"
  }
];

const notValidPermission = ["settings", "faqs", "calendar"];
export const permissionResources: PermissionString[] = PERMISSIONS_LIST.filter((resource) => {
  return !notValidPermission.includes(resource);
});
export const isActualObject = (obj: Record<string, any>): boolean =>
  !!(!Array.isArray(obj) && obj && Object.keys(obj).length);

export const hasValidPhone = (phone: PhoneProps): boolean => {
  return !!(
    isActualObject(phone) &&
    phone.number &&
    phone.number.length === 9 &&
    phone.prefix &&
    phone.prefix.length === 3 &&
    ["233"].includes(phone.prefix)
  );
};

export const createSlug = (str: string) => {
  let lowerStr = toLower(str);

  // Remove non-alphanumeric characters (excluding hyphens and spaces)
  let cleanedStr = lowerStr.replace(/[^a-z0-9\s-]/g, "");

  // Replace spaces and consecutive hyphens with a single hyphen
  let hyphenatedStr = cleanedStr.replace(/[\s-]+/g, "-");

  // Trim any leading or trailing hyphens
  let slug = trim(hyphenatedStr, "-");

  return slug;
};
export function formatQueryParams(params?: Record<string, any>): string {
  let formattedQueryString: string = "";
  const query = new URLSearchParams(params as any);
  if (params && Object.keys(params).length) {
    formattedQueryString = `?${query}`;
  }
  return formattedQueryString;
}
export const printPDF = async (base64: any) => {
  // Decode base64 string to binary data
  const { atob, URL, open } = window;
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the binary data
  const blob = new Blob([bytes], { type: "application/pdf" });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Open a new tab and display the PDF
  const newTab = open(url, "_blank");
  if (!newTab) {
    // Handle the case where popups are blocked
    alert("Please allow popups for this website");
  }
};
export function downloadDocument(pdf: string, fileName: string) {
  const linkSource = `data:application/pdf;base64,${pdf}`;

  // Create a link element for downloading the PDF
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;

  // // Trigger the download
  downloadLink.click();
}
export function formatDate(date: string, formatType: string) {
  return isValid(parseISO(date)) ? format(parseISO(date), formatType) : date;
}

export const calculateDiscountAmount = function (totalItemAmount: number, discount?: Discount): number {
  if (discount) {
    const invoiceValue = discount.value || 0;
    if (discount.type === "fixed") {
      return invoiceValue;
    } else if (discount.type === "percentage") {
      return (invoiceValue / 100) * totalItemAmount;
    }
  }

  return 0;
};
export const computeInvoiceAmounts = (invoiceData: { items: InvoiceItem[]; discount?: Discount }) => {
  const invoiceSubTotal = invoiceData.items.reduce((inc, item) => item.price * item.quantity + inc, 0);
  const invoiceDiscountTotal = calculateDiscountAmount(invoiceSubTotal, invoiceData?.discount);
  const invoiceTotal = invoiceSubTotal - invoiceDiscountTotal;
  return {
    invoiceSubTotal,
    invoiceDiscountTotal,
    invoiceTotal
  };
};
