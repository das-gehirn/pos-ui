import { useState, useCallback } from "react";
import { cloneDeep, set } from "lodash";

export const useFormFieldUpdate = <T>(defaultData: T) => {
  const [formValues, setFormValues] = useState<T>(defaultData);

  const updateFormFieldValue = useCallback((key: string, value: any) => {
    setFormValues((prev) => {
      const updatedFormValues = cloneDeep(prev);
      set(updatedFormValues as Record<string, any>, key, value);
      return { ...updatedFormValues };
    });
  }, []);

  return {
    formValues,
    updateFormFieldValue,
    setFormValues
  };
};
