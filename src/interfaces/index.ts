import { MouseEventHandler } from "react";

export interface DefaultPluginProps {
  _id?: string;
  id?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdBy?: string;
}

export interface PhoneProps {
  prefix: string;
  number: string;
  country: string;
}

export interface AddressProps {
  isGpsAddress?: boolean;
  gpsAddress?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  poBox?: string;
  isPoBox?: boolean;
}

export interface RequestStateProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

export interface AuthProps {
  email: string;
  password: string;
}

export interface ActionButtonProps {
  createButton?: {
    name: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    loading?: boolean;
  };
}

export interface ModalActionButtonProps {
  title: string;
  className?: string;
  action: () => void;
  loading?: boolean;
  disabled?: false;
  type: "cancel" | "action";
}

export interface UploadedFileProps {
  uploadedFile?: File;
  fileURL?: string;
}

export interface OptionsProps {
  label: string;
  value: string;
}

export type FieldKeys<T> = T extends object
  ? { [K in keyof T]: T[K] extends Function ? never : `${K & string}` | `${K & string}.${FieldKeys<T[K]>}` }[keyof T]
  : never;

export type DeepOptional<T> = {
  [K in keyof T]?: T[K] extends object ? DeepOptional<T[K]> : T[K];
};
