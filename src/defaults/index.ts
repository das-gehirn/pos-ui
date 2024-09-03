import { UserProps } from "@/interfaces/user";
import { AddressProps, DefaultPluginProps, PhoneProps, RequestStateProps } from "../interfaces";
import {
  BarcodeSymbology,
  ProductProps,
  ProductStatus,
  productBarcodeSymbology,
  productStatus
} from "@/interfaces/products";
import { startCase } from "lodash";
import { SupplierProps } from "@/interfaces/supplier";
import { StockDataProps, StockProps } from "@/interfaces/stock";
import { CustomerProps } from "@/interfaces/customer";
import { MOP } from "@/interfaces/sales";
import {
  AccountingSoftwareIntegrationProps,
  AdvancedSettingsProps,
  CashManagementProps,
  Channels,
  CustomerInformationProps,
  CustomerManagementProps,
  DataManagementProps,
  EmployeeManagementProps,
  GeneralSettings,
  IntegrationSettingsProps,
  InvoiceSettingsProps,
  NotificationPreferencesProps,
  NotificationScheduleProps,
  NotificationSettingsProps,
  PasswordPolicyProps,
  PaymentGatewayIntegrationProps,
  PaymentSettingsProps,
  RequiredFieldsProps,
  SalesReportsProps,
  SecuritySettingsProps,
  SettingsProps,
  StoreInformationProps
} from "@/interfaces/settings";
import { InvoiceProps } from "@/interfaces/invoice";
import { ExpenditureProps } from "@/interfaces/expenditure";
import { StockCreditorPaymentProps } from "@/interfaces/stockPayments";

export const mopArr: MOP[] = ["cash", "mobile money", "bank", "cheque"];
export const defaultPlugin: DefaultPluginProps = {
  createdAt: new Date(),
  updatedBy: "",
  updatedAt: new Date(),
  deleted: false,
  deletedAt: new Date(),
  deletedBy: "",
  createdBy: "",
  _id: "",
  id: ""
};

export const address: AddressProps = {
  zipCode: "",
  country: "GH",
  city: "",
  street: "",
  state: "",
  gpsAddress: "",
  isGpsAddress: false,
  isPoBox: false,
  poBox: ""
};

export const phone: PhoneProps = {
  prefix: "",
  number: "",
  country: ""
};

export const initialRequestState: RequestStateProps = {
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: ""
};

export const createDefaultUser: () => UserProps = () => ({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  address,
  phone,
  permission: null,
  isLoggedIn: false,
  status: "pending",
  ...defaultPlugin,
  fullName: "",
  accountId: "",
  warehouseId: [],
  currentWarehouse: ""
});

export const barCodeOptions: { label: string; value: BarcodeSymbology }[] = productBarcodeSymbology.map((code) => {
  return {
    label: startCase(code),
    value: code
  };
});
export const productStatusOptions: { label: string; value: ProductStatus }[] = productStatus.map(
  (status: ProductStatus) => {
    return {
      label: startCase(status),
      value: status
    };
  }
);
export const productDefaults = (): ProductProps => {
  return {
    name: "",
    brandId: "",
    alertQuantity: 0,
    barcodeSymbology: "code128",
    categoryId: "",
    productCodeId: "",
    productSellingPrice: 0,
    productUnitPrice: 0,
    status: "active",
    supplierId: "",
    unitId: "",
    accountId: "",
    availability: "offlineOnly",
    canExpire: false,
    expirationDate: null,
    createdAt: new Date(),
    createdBy: "",
    deleted: false,
    deletedAt: new Date(),
    deletedBy: "",
    description: "",
    dimensions: {
      height: 0,
      length: 0,
      width: 0
    },
    isFeatured: false,
    primaryImageId: "",
    secondaryImages: [],
    SKU: "",
    tags: [],
    taxId: "",
    taxType: undefined,
    updatedAt: new Date(),
    updatedBy: "",
    warehouseIds: [],
    weight: 0
  };
};
export const supplierDefaults = (): SupplierProps => {
  return {
    email: "",
    name: "",
    phone: {
      country: "gh",
      number: "",
      prefix: "233"
    },
    ...defaultPlugin,
    address,
    accountId: "",
    warehouseId: "",
    status: "active"
  };
};

export const stockDataDefault = (): StockDataProps => {
  return {
    productId: "",
    quantityExpected: 0,
    quantityReceived: 0,
    remarks: "",
    section: "",
    status: "partially received",
    batchId: ""
  };
};
export const stockDefault = (): StockProps => {
  return {
    accountId: "",
    deliveryId: "",
    stockData: [stockDataDefault()],
    supplierId: "",
    warehouseId: "",
    truckNumber: "",
    ...defaultPlugin,
    receivedDate: new Date(),
    status: "pending"
  };
};

export const defaultCustomer = (): CustomerProps => {
  return {
    ...defaultPlugin,
    accountId: "",
    warehouseId: "",
    email: "",
    firstName: "",
    gender: undefined,
    lastName: "",
    address,
    phone,
    dateOfBirth: undefined
  };
};

export const defaultStockCreditorPayment = (): StockCreditorPaymentProps => {
  return {
    ...defaultPlugin,
    _id: undefined,
    amountPaid: 0,
    modeOfPayment: undefined,
    stockId: "",
    supplierId: "",
    accountId: "",
    warehouseId: "",
    receiptNumber: "",
    transactionNumber: "",
    bankAccountNumber: "",
    bankName: "",
    bankBranch: "",
    mobileMoneyNumber: "",
    chequeNumber: "",
    transactionId: "",
    networkType: undefined,
    supplier: "",
    remarks: "",
    hasReceipt: false,
    creditorId: ""
  };
};
// Default values for nested interfaces
const defaultPasswordPolicy: PasswordPolicyProps = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialCharacters: true
};

export const channels: Channels[] = ["Email", "In-App", "SMS"];
const defaultSecuritySettings: SecuritySettingsProps = {
  enableMFA: true,
  enableBiometrics: false,
  passwordPolicy: defaultPasswordPolicy
};

const defaultNotificationSchedule: NotificationScheduleProps = {
  startHour: 9,
  endHour: 17,
  timeZone: "UTC"
};

const defaultNotificationPreferences: NotificationPreferencesProps = {
  sendClientBirthdayMessages: {
    channels: {
      "In-App": {
        enabled: false
      },
      Email: {
        enabled: false
      },
      SMS: {
        enabled: false
      }
    },
    roles: []
  },
  sendDebitAlert: {
    channels: {
      "In-App": {
        enabled: false
      },
      Email: {
        enabled: false
      },
      SMS: {
        enabled: false
      }
    },
    roles: []
  },
  sendInvoiceNotification: {
    channels: {
      "In-App": {
        enabled: false
      },
      Email: {
        enabled: false
      },
      SMS: {
        enabled: false
      }
    },
    roles: []
  },
  sendInvoiceReminder: {
    channels: {
      "In-App": {
        enabled: false
      },
      Email: {
        enabled: false
      },
      SMS: {
        enabled: false
      }
    },
    roles: []
  },
  sendProductSaleReminder: {
    channels: {
      "In-App": {
        enabled: false
      },
      Email: {
        enabled: false
      },
      SMS: {
        enabled: false
      }
    },
    roles: []
  }
};

const defaultNotificationSettings: NotificationSettingsProps = {
  enableNotifications: true,
  notificationChannels: [
    {
      enabled: false,
      type: "Email"
    },
    {
      enabled: false,
      type: "SMS"
    },
    {
      enabled: false,
      type: "In-App"
    }
  ],
  notificationSchedule: defaultNotificationSchedule,
  notificationPreferences: defaultNotificationPreferences
};

const defaultPaymentGatewayIntegration: PaymentGatewayIntegrationProps = {
  provider: "Stripe",
  apiKey: "",
  sandboxMode: true
};

const defaultAccountingSoftwareIntegration: AccountingSoftwareIntegrationProps = {
  provider: "QuickBooks",
  apiKey: "",
  syncFrequency: "daily"
};

const defaultIntegrationSettings: IntegrationSettingsProps = {
  paymentGateway: defaultPaymentGatewayIntegration,
  accountingSoftware: defaultAccountingSoftwareIntegration
};

const defaultAddress: AddressProps = {
  isGpsAddress: false,
  gpsAddress: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  poBox: "",
  isPoBox: false
};

const defaultStoreInformation: StoreInformationProps = {
  storeName: "",
  storeAddress: defaultAddress,
  taxSettings: {
    taxType: "percentage",
    taxRate: 0
  },
  storeEmail: "",
  storePhone: phone
};

const defaultRequiredFields: RequiredFieldsProps = {
  name: true,
  email: true,
  phone: true,
  address: true
};

const defaultCustomerInformation: CustomerInformationProps = {
  takeClientInformation: true,
  requiredFields: defaultRequiredFields
};

const defaultCashManagement: CashManagementProps = {
  enableCashDrawer: true,
  enableCashCount: true,
  cashFloatAmount: 0
};

const defaultPaymentSettings: PaymentSettingsProps = {
  acceptedPaymentMethods: ["cash", "credit card"],
  defaultPaymentMethod: "cash",
  cashManagement: defaultCashManagement
};

const defaultInvoiceSettings: InvoiceSettingsProps = {
  invoiceFormat: "standard",
  includeTaxBreakdown: true,
  includeDiscounts: true,
  includeProductDetails: true,
  receiptFooter: ""
};

const defaultGeneralSettings: GeneralSettings = {
  storeInformation: defaultStoreInformation,
  customerInformation: defaultCustomerInformation,
  paymentSettings: defaultPaymentSettings,
  invoiceSettings: defaultInvoiceSettings
};

const defaultEmployeeManagement: EmployeeManagementProps = {
  enableEmployeeManagement: true,
  enableTimeTracking: true,
  enableShiftManagement: true,
  roles: ["admin", "employee"]
};

const defaultSalesReports: SalesReportsProps = {
  enableSalesReports: true,
  reportType: "summary",
  reportFrequency: "monthly",
  enableInventoryReports: true
};

const defaultDataManagement: DataManagementProps = {
  enableDataRetention: true,
  retentionPeriod: 365,
  enableDataBackup: true,
  backupFrequency: "daily"
};

const defaultCustomerManagement: CustomerManagementProps = {
  enableCustomerManagement: true,
  enableCustomerGroups: true,
  enableLoyaltyProgram: true,
  loyaltyProgramType: "points"
};

const defaultAdvancedSettings: AdvancedSettingsProps = {
  employeeManagement: defaultEmployeeManagement,
  salesReports: defaultSalesReports,
  dataManagement: defaultDataManagement,
  customerManagement: defaultCustomerManagement
};

export const defaultSettings: () => SettingsProps = () => ({
  security: defaultSecuritySettings,
  notification: defaultNotificationSettings,
  integrations: defaultIntegrationSettings,
  general: defaultGeneralSettings,
  advanced: defaultAdvancedSettings,
  accountId: "",
  warehouseId: ""
});

export const invoiceDefault: () => InvoiceProps = () => {
  return {
    ...defaultPlugin,
    warehouseId: "",
    accountId: "",
    items: [],
    customerId: "",
    invoiceNumber: "",
    invoiceDate: undefined,
    dueDate: undefined,
    totalAmount: 0,
    discount: undefined,
    status: "not paid",
    isRecurring: false,
    recurrence: undefined,
    description: "",
    termsAndCondition: "",
    note: "",
    customerData: undefined,
    createdByData: undefined
  };
};
export const expenditureDefault: () => ExpenditureProps = () => {
  return {
    ...defaultPlugin,
    item: "",
    itemId: undefined,
    quantity: 0,
    discount: undefined,
    hasDiscount: false,
    pricePerQuantity: 0,
    description: "",
    modeOfPayment: undefined,
    expenseHead: undefined,
    subExpense: undefined,
    receiptNumber: "",
    hasReceipt: false,
    bankAccountNumber: undefined,
    type: undefined,
    bankBranch: undefined,
    bankName: undefined,
    warehouseId: "",
    chequeNumber: undefined,
    mobileMoneyNumber: undefined,
    networkType: undefined,
    transactionId: undefined,
    transactionNumber: undefined,
    accountId: ""
  };
};
