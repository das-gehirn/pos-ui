import { AddressProps, PhoneProps, UploadedFileProps } from "@/interfaces";
import { UserRole, specialRoles } from "@/interfaces/user";
import { parseISO, format, formatDistanceToNow } from "date-fns";
import { isEmpty, transform } from "lodash";
import { capitalize, words } from "lodash";

export const formatCurrency = (data: {
  value: number;
  currency?: string;
  minifyFormat?: boolean;
  showCurrencySign?: boolean;
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
}) => {
  const { value, currency = "GHS", minifyFormat = false, showCurrencySign = true, currencyDisplay = "symbol" } = data;

  let currencyFormatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    currencyDisplay
  };

  if (minifyFormat) {
    currencyFormatOptions = { ...currencyFormatOptions, notation: "compact", compactDisplay: "short" };
  }

  if (!showCurrencySign) {
    // Change style to "decimal" if showCurrencySign is false
    currencyFormatOptions = {
      style: "decimal", // Remove currency symbol and display just the number
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
  }

  return new Intl.NumberFormat("en-GH", currencyFormatOptions).format(!value ? 0 : value);
};

export function formatQueryParams(params?: Record<string, any>): string {
  let formattedQueryString: string = "";
  const query = new URLSearchParams(params as any);
  if (params && Object.keys(params).length) {
    formattedQueryString = `?${query}`;
  }
  return formattedQueryString;
}
export function objectToQueryString(obj: Record<string, any>) {
  const keys = obj ? Object.keys(obj) : [];
  const keyValuePairs = keys.map((key) => {
    const value = obj[key];

    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.length > 0) {
        // If the value is an array with elements, join them with ","
        return encodeURIComponent(key) + "=" + encodeURIComponent(value.join(","));
      } else if ((typeof value === "string" && value !== "") || typeof value === "number") {
        // If the value is a non-empty string or a number, include it in the query string
        return encodeURIComponent(key) + "=" + encodeURIComponent(value.toString());
      }
    }

    return ""; // Skip keys with empty or undefined values
  });

  return keyValuePairs.filter((pair) => pair !== "").join("&");
}

export function cleanObject(obj: Record<string, any>) {
  return transform(
    obj,
    (result: Record<string, any>, value, key) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          // Convert non-empty arrays to a comma-separated string
          result[key] = value.join(",");
        } else if (typeof value === "string" && value !== "") {
          // Include non-empty strings
          result[key] = value;
        } else if (typeof value === "number") {
          // Include numbers
          result[key] = value;
        }
      }
    },
    {}
  );
}

export function objectDifference(
  baseObject?: Record<string, any>,
  objectToCompare?: Record<string, any>
): Record<string, any> {
  const diff: Record<string, any> = {};

  if (!objectToCompare || !baseObject) return diff;

  const baseKeys = Object.keys(baseObject);
  const compareKeys = Object.keys(objectToCompare);

  // Helper function to find array differences
  const arrayDifference = (baseArray: any[], compareArray: any[]) => {
    return JSON.stringify(compareArray) !== JSON.stringify(baseArray);
  };

  // Iterate over the keys of baseObject
  for (const key of baseKeys) {
    const baseValue = baseObject[key];
    const compareValue = objectToCompare[key];

    if (compareKeys.includes(key)) {
      if (Array.isArray(baseValue) && Array.isArray(compareValue)) {
        // Handle arrays with more granular comparison
        const diffArray = arrayDifference(baseValue, compareValue);
        if (diffArray) {
          diff[key] = compareValue;
        }
      } else if (
        typeof baseValue === "object" &&
        baseValue !== null &&
        typeof compareValue === "object" &&
        compareValue !== null
      ) {
        // Recursively compare nested objects
        const nestedDiff = objectDifference(baseValue, compareValue);
        if (!isEmpty(nestedDiff)) {
          diff[key] = nestedDiff;
        }
      } else if (baseValue !== compareValue) {
        // Handle primitive values, null, NaN, etc.
        if (
          !(baseValue === "" && compareValue === "") &&
          !(baseValue == null && compareValue == null) &&
          !(
            typeof baseValue === "number" &&
            typeof compareValue === "number" &&
            isNaN(baseValue) &&
            isNaN(compareValue)
          )
        ) {
          diff[key] = compareValue;
        }
      }
    } else {
      // If the key is missing in `objectToCompare`, keep the original value
      diff[key] = baseValue;
    }
  }

  // Add keys from objectToCompare that are not in baseObject
  for (const key of compareKeys) {
    if (!baseKeys.includes(key)) {
      diff[key] = objectToCompare[key];
    }
  }

  return diff;
}

type SizeUnit = "B" | "KB" | "MB" | "GB" | "TB";

const sizeMap: Record<SizeUnit, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024
};

export function formatFileSize(sizeInBytes: number): string {
  for (const unit of ["B", "KB", "MB", "GB", "TB"] as SizeUnit[]) {
    if (sizeInBytes < sizeMap[unit]) {
      return `${(sizeInBytes / sizeMap[unit]).toFixed(2)} ${unit}`;
    }
  }
  return `${sizeInBytes} B`;
}

export function combineWithOr(strings: string[]) {
  if (strings.length === 0) {
    return "";
  } else if (strings.length === 1) {
    return strings[0];
  } else {
    const lastString = strings.pop();
    return `${strings.join(", ")} or ${lastString}`;
  }
}

export function validateFile(uploadedFile: UploadedFileProps) {
  return !!(uploadedFile.fileURL && Object.keys(uploadedFile).length);
}
export const formatDate = (date: string, formatType = "MMM dd yyyy") => {
  if (!date) return "";
  return format(parseISO(date), formatType);
};

export const camelCaseToSentence = (word: string) => {
  if (!word) return "";
  const wordsArr = words(word).join(" ");
  return capitalize(wordsArr);
};

export const getTimeAgo = (dateToCompare: string) => {
  if (!dateToCompare) return "N/A";
  return formatDistanceToNow(parseISO(dateToCompare), { addSuffix: true });
};

export function formatAddressToString(address: AddressProps) {
  if (!address) return "N/A";

  const { zipCode = "", country, city, street, state } = address;

  const formattedAddress = `${street}, ${city}, ${state} ${zipCode}, ${country}`;

  return formattedAddress.trim();
}
export const formatPhoneToString = (phone?: PhoneProps) => {
  if (!phone) return "N/A";
  const { number = "", prefix = "" } = phone;
  return `(+${prefix}) ${number}`;
};

export const isSpecialRole = (role: UserRole): boolean => {
  return specialRoles.includes(role);
};

export const addressValidationProps = {
  validation: {
    "address.city": "required",
    "address.country": "required",
    "address.poBox": "required",
    "address.state": "required"
  },
  customFields: {
    "address.city": "City",
    "address.country": "Country",
    "address.poBox": "po Box",
    "address.state": "State"
  }
};
export const BANK_NAME_OPTIONS = [
  { label: "Absa Bank Ghana Ltd", value: "Absa Bank Ghana Ltd" },
  { label: "Access Bank", value: "Access Bank" },
  { label: "ADB Bank Limited", value: "ADB Bank Limited" },
  { label: "ARB Apex Bank", value: "ARB Apex Bank" },
  { label: "Bank of Africa Ghana", value: "Bank of Africa Ghana" },
  { label: "Bank of Ghana", value: "Bank of Ghana" },
  { label: "Best Point Savings & Loans", value: "Best Point Savings & Loans" },
  { label: "BSIC Ghana Limited", value: "BSIC Ghana Limited" },
  { label: "CAL Bank Limited", value: "CAL Bank Limited" },
  { label: "Consolidated Bank Ghana Limited", value: "Consolidated Bank Ghana Limited" },
  { label: "Ecobank Ghana Limited", value: "Ecobank Ghana Limited" },
  { label: "FBNBank Ghana Limited", value: "FBNBank Ghana Limited" },
  { label: "Fidelity Bank Ghana Limited", value: "Fidelity Bank Ghana Limited" },
  { label: "First Atlantic Bank Limited", value: "First Atlantic Bank Limited" },
  { label: "First National Bank Ghana Limited", value: "First National Bank Ghana Limited" },
  { label: "GCB Bank Limited", value: "GCB Bank Limited" },
  { label: "Guaranty Trust Bank (Ghana) Limited", value: "Guaranty Trust Bank (Ghana) Limited" },
  { label: "National Investment Bank Limited", value: "National Investment Bank Limited" },
  { label: "OmniBank Ghana Limited", value: "OmniBank Ghana Limited" },
  { label: "Prudential Bank Limited", value: "Prudential Bank Limited" },
  { label: "Republic Bank (GH) Limited", value: "Republic Bank (GH) Limited" },
  { label: "Services Integrity Savings and Loans", value: "Services Integrity Savings and Loans" },
  { label: "Société Générale Ghana Limited", value: "Société Générale Ghana Limited" },
  { label: "Stanbic Bank Ghana Limited", value: "Stanbic Bank Ghana Limited" },
  { label: "Standard Chartered Bank Ghana Limited", value: "Standard Chartered Bank Ghana Limited" },
  { label: "United Bank for Africa Ghana Limited", value: "United Bank for Africa Ghana Limited" },
  { label: "Universal Merchant Bank Ghana Limited", value: "Universal Merchant Bank Ghana Limited" },
  { label: "Zenith Bank Ghana", value: "Zenith Bank Ghana" }
];

export const TELECOM_NAME_OPTIONS = [
  { label: "MTN", value: "MTN" },
  { label: "VODAFONE", value: "VODAFONE" },
  { label: "AIRTEL TIGO", value: "AIRTEL TIGO" }
];
