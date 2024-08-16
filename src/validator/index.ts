import { get, has, isArray } from "lodash";

class ValidatorCheck {
  required(fieldValue: string | number | any[]): boolean {
    if (Array.isArray(fieldValue)) return fieldValue.length > 0;
    return Boolean(fieldValue);
  }

  minValue(fieldValue: number, minValue: number): boolean {
    return fieldValue >= minValue;
  }

  maxValue(fieldValue: number, maxValue: number): boolean {
    return fieldValue <= maxValue;
  }

  minLength(fieldValue: string, minLength: number): boolean {
    if (!fieldValue) return false;
    return fieldValue.length >= minLength;
  }

  maxLength(fieldValue: string, maxLength: number): boolean {
    if (!fieldValue) return false;
    return fieldValue.length <= maxLength;
  }

  isEmail(fieldValue: string): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fieldValue);
  }

  isUrl(fieldValue: string): boolean {
    return /^((https):\/\/)?(?:www\.)?([a-zA-Z0-9-]+)\.[a-zA-Z]{2,}$/.test(fieldValue);
  }

  isPassword(fieldValue: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return passwordRegex.test(fieldValue);
  }

  isNumber(fieldValue: string): boolean {
    return /^\d+$/.test(fieldValue);
  }

  isString(fieldValue: string): boolean {
    return /^[a-zA-Z]+$/.test(fieldValue);
  }

  isAlphaNumeric(fieldValue: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(fieldValue);
  }

  in(fieldValue: string | number, ruleSet: string[]): boolean {
    return ruleSet.includes(String(fieldValue));
  }

  isBetween(fieldValue: number, ruleSet: string): boolean {
    const [minValue, maxValue] = ruleSet.split(",").map(Number);
    return fieldValue >= minValue && fieldValue <= maxValue;
  }
}

type FieldKeys<T> = T extends object
  ? { [K in keyof T]: T[K] extends Function ? never : `${K & string}` | `${K & string}.${FieldKeys<T[K]>}` }[keyof T]
  : never;

type RuleSet<T> = {
  [Property in FieldKeys<T>]?: string;
};

type CustomFieldKeys<T> = {
  [Property in FieldKeys<T>]?: string;
};
export class Validator<TFormData> {
  private formData: { [P in keyof TFormData]: any };
  private rules: RuleSet<TFormData>;
  private validationErrors: { field: keyof TFormData; messages: string[] }[];
  private validatorCheck: ValidatorCheck;
  private customFieldKeys: CustomFieldKeys<TFormData>;

  constructor(data: {
    formData: { [P in keyof TFormData]: any };
    rules: RuleSet<TFormData>;
    customFieldKeys?: CustomFieldKeys<TFormData>;
  }) {
    this.formData = data.formData;
    this.rules = data.rules;
    this.validationErrors = [];
    this.validatorCheck = new ValidatorCheck();
    this.customFieldKeys = data.customFieldKeys || {};
  }

  private addValidationError(fieldKey: keyof TFormData, message: string): void {
    const errorIndex = this.validationErrors.findIndex((error) => error.field === fieldKey);
    if (errorIndex !== -1) {
      this.validationErrors[errorIndex].messages.push(message);
    } else {
      this.validationErrors.push({
        field: fieldKey,
        messages: [message]
      });
    }
  }

  private getFieldLabel(fieldKey: keyof TFormData): string {
    return this.customFieldKeys[fieldKey] || String(fieldKey);
  }

  private validateField(fieldKey: keyof TFormData, fieldValue: any, fieldLabel: string, rules: string[]) {
    const ruleMapper = rules.map((rule) => {
      const [ruleName, ruleValue] = rule.split(":");
      return { ruleName, ruleValue };
    });

    ruleMapper.forEach((ruleMap) => {
      const { ruleName, ruleValue } = ruleMap;
      switch (ruleName) {
        case "required":
          if (!this.validatorCheck.required(fieldValue)) {
            this.addValidationError(fieldKey, `${fieldLabel} is required`);
          }
          break;
        case "minValue":
          if (!this.validatorCheck.minValue(fieldValue, parseFloat(ruleValue!))) {
            this.addValidationError(fieldKey, `${fieldLabel} must be greater than or equal to ${ruleValue}`);
          }
          break;
        case "maxValue":
          if (!this.validatorCheck.maxValue(fieldValue, parseFloat(ruleValue!))) {
            this.addValidationError(fieldKey, `${fieldLabel} must be less than or equal to ${ruleValue}`);
          }
          break;
        case "minLength":
          if (!this.validatorCheck.minLength(fieldValue, parseInt(ruleValue!))) {
            this.addValidationError(fieldKey, `${fieldLabel} must have a minimum length of ${ruleValue}`);
          }
          break;
        case "maxLength":
          if (!this.validatorCheck.maxLength(fieldValue, parseInt(ruleValue!))) {
            this.addValidationError(fieldKey, `${fieldLabel} must have a maximum length of ${ruleValue}`);
          }
          break;
        case "isEmail":
          if (!this.validatorCheck.isEmail(fieldValue)) {
            this.addValidationError(fieldKey, `The ${fieldLabel} field must be a valid email address`);
          }
          break;
        case "sameAs":
          const sameAsField = ruleValue as keyof TFormData;
          const sameAsValue = get(this.formData, sameAsField as string);
          if (fieldValue !== sameAsValue) {
            this.addValidationError(
              fieldKey,
              `The field ${fieldLabel} must be the same as ${this.getFieldLabel(sameAsField)}`
            );
          }
          break;
        case "isPassword":
          if (!this.validatorCheck.isPassword(fieldValue)) {
            this.addValidationError(
              fieldKey,
              `The field ${fieldLabel} must be a valid password. It should contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.`
            );
          }
          break;
        case "isUrl":
          if (!this.validatorCheck.isUrl(fieldValue)) {
            this.addValidationError(fieldKey, `${fieldLabel} must be a valid URL`);
          }
          break;
        case "isNumber":
          if (!this.validatorCheck.isNumber(fieldValue)) {
            this.addValidationError(fieldKey, `${fieldLabel} must be a valid number`);
          }
          break;
        case "isString":
          if (!this.validatorCheck.isString(fieldValue)) {
            this.addValidationError(fieldKey, `${fieldLabel} must be a valid string`);
          }
          break;
        case "isAlphaNumeric":
          if (!this.validatorCheck.isAlphaNumeric(fieldValue)) {
            this.addValidationError(fieldKey, `${fieldLabel} must be alphanumeric`);
          }
          break;
        case "in":
          if (!this.validatorCheck.in(fieldValue, ruleValue!.split(","))) {
            this.addValidationError(fieldKey, `${fieldLabel} must be one of the specified values`);
          }
          break;
        case "isBetween":
          if (!this.validatorCheck.isBetween(parseFloat(fieldValue), ruleValue!)) {
            this.addValidationError(fieldKey, `${fieldLabel} must be between ${ruleValue}`);
          }
          break;
        case "customValidator":
          if (ruleValue) {
            const passed = JSON.parse(String(ruleValue));
            if (!passed) {
              this.addValidationError(fieldKey, `${fieldLabel} failed the custom validation`);
            }
          } else {
            this.addValidationError(fieldKey, `${fieldLabel} failed the custom validation`);
          }
          break;
        default:
          break;
      }
    });
  }

  private validateArrayField(fieldPath: string, rules: string[], labelPath: string) {
    const arrayFieldValue = get(this.formData, fieldPath);
    if (isArray(arrayFieldValue)) {
      arrayFieldValue.forEach((_, index) => {
        const nestedFieldPath = `${fieldPath}[${index}]`;
        const nestedLabelPath = `${labelPath}[${index}]`;
        rules.forEach((rule) => {
          const [ruleName] = rule.split(":");
          const nestedFieldKey = `${nestedFieldPath}${ruleName ? `.${ruleName}` : ""}`;
          const nestedFieldLabel = this.getFieldLabel(nestedLabelPath as keyof TFormData);
          const nestedFieldValue = get(this.formData, nestedFieldKey);
          this.validateField(nestedFieldKey as keyof TFormData, nestedFieldValue, nestedFieldLabel, [rule]);
        });
      });
    }
  }

  validate(): void {
    for (const fieldKey in this.rules) {
      if (fieldKey.includes("[")) {
        // handle arrays
        const arrayFieldPath = fieldKey.substring(0, fieldKey.indexOf("["));
        const rules = get(this.rules, fieldKey)?.split("|") || [];
        this.validateArrayField(arrayFieldPath, rules, fieldKey);
      } else {
        const fieldValue = get(this.formData, fieldKey);
        const fieldLabel = this.getFieldLabel(fieldKey as keyof TFormData);
        const rules = get(this.rules, fieldKey)?.split("|") || [];
        this.validateField(fieldKey as keyof TFormData, fieldValue, fieldLabel, rules);
      }
    }
  }

  addCustomValidation(data: {
    fieldKey: keyof TFormData;
    fieldPassed: (value?: any) => boolean;
    errorMessage?: string;
  }) {
    const { fieldKey, fieldPassed } = data;
    if (has(this.formData, fieldKey as string)) {
      const passed = fieldPassed(get(this.formData, fieldKey as string));
      this.rules = { ...this.rules, [fieldKey]: `customValidator:${passed}` };
    }
  }

  failed(): boolean {
    return this.validationErrors.length > 0;
  }

  passed(): boolean {
    return !this.failed();
  }

  errors() {
    return this.validationErrors;
  }

  getFieldError(fieldKey: keyof TFormData) {
    return this.errors().find((error) => error.field === fieldKey);
  }

  addError(fieldKey: keyof TFormData, messages: string[]) {
    this.validationErrors.push({ field: fieldKey, messages });
  }

  getValidationErrorsByIndex(index = 0) {
    const errors: { [P in keyof TFormData]?: string } = {};

    this.errors().forEach((err) => {
      errors[err.field] = err.messages[index];
    });
    return errors;
  }
}
