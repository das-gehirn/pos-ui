import { HandlerProps } from "@/components/customFields/type";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { Validator } from "@/validator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EditProductCodeFields from "./EditProductCodeFields";

const CreateProductCodeScreen = () => {
  const buttonTitle = "Create";
  const defaultData = {
    description: "",
    code: ""
  };
  const { addErrors, errors, resetError } = useError<typeof defaultData>();
  const { formValues, updateFormFieldValue } = useFormFieldUpdate(defaultData);
  const navigate = useNavigate();
  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "post",
    mutationKey: ["createProductCode"],
    url: "/product-codes"
  });
  const validator = new Validator({
    formData: formValues,
    rules: {
      description: "required|minLength:10",
      code: "required:minLength:5"
    }
  });

  const handleFormFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    updateFormFieldValue(key, value);
  };

  const onsubmitHandler = () => {
    validator.validate();

    if (validator.failed()) {
      return addErrors(validator.getValidationErrorsByIndex());
    } else {
      resetError();
    }

    mutate(
      { payload: formValues },
      {
        onSuccess() {
          toast.success("Success", {
            description: "Product code created"
          });
          navigate("/product-codes");
        }
      }
    );
  };

  return (
    <EditProductCodeFields
      pageTitle="Create Product Code"
      buttonTitle={buttonTitle}
      formFields={formValues}
      handleFormFieldChange={handleFormFieldChange}
      onsubmitHandler={onsubmitHandler}
      errors={errors as Record<string, any>}
      isLoading={isPending}
    />
  );
};

export default CreateProductCodeScreen;
