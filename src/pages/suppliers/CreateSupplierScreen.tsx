import { HandlerProps } from "@/components/customFields/type";
import { supplierDefaults } from "@/defaults";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { SupplierProps } from "@/interfaces/supplier";
import { hasValidPhone } from "@/utils";
import { Validator } from "@/validator";
import { PhoneProps } from "@/interfaces";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { addressValidationProps } from "@/helpers";
import { toast } from "sonner";
import { pick } from "lodash";
import { useNavigate } from "react-router-dom";
import SupplierEditFields from "./SupplierEditFields";
const CreateSupplierScreen = () => {
  const { formValues, updateFormFieldValue } = useFormFieldUpdate(supplierDefaults());
  const { errors, resetError, addErrors } = useError<any>();
  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "post",
    mutationKey: ["createSupplier"],
    url: "/suppliers"
  });
  const navigate = useNavigate();
  const handleChange = (data: HandlerProps) => {
    updateFormFieldValue(data.key, data.value);
  };
  const onsubmitHandler = () => {
    const validator = new Validator<SupplierProps>({
      formData: formValues,
      rules: {
        ...addressValidationProps.validation,
        name: "required|minLength:3",
        email: "required|isEmail",
        phone: "required|customValidator"
      },
      customFieldKeys: {
        ...addressValidationProps.customFields
      }
    });
    validator.addCustomValidation({
      fieldKey: "phone",
      fieldPassed(value: PhoneProps) {
        return !!hasValidPhone(value);
      }
    });
    validator.validate();

    if (validator.failed()) {
      return addErrors(validator.getValidationErrorsByIndex());
    }
    resetError();

    const payload = pick(formValues, ["address", "email", "name", "phone", "status"]);
    mutate(
      { payload },
      {
        onSuccess() {
          toast.success("Success", {
            description: "Supplier created"
          });
          navigate("/suppliers");
        }
      }
    );
  };
  return (
    <SupplierEditFields
      buttonTitle="Create Supplier"
      formFields={formValues}
      handleFormFieldChange={handleChange}
      onsubmitHandler={onsubmitHandler}
      disabledButton={isPending}
      errors={errors as any}
      pageTitle="Create Supplier"
    />
  );
};

export default CreateSupplierScreen;
