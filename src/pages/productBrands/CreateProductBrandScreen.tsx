import { HandlerProps } from "@/components/customFields/type";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { Validator } from "@/validator";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EditProductBrandFields from "./EditProductBrandFields";

const CreateProductBrandScreen = () => {
  const buttonTitle = "Create";
  const defaultData = {
    description: "",
    name: ""
  };
  const { addErrors, errors, resetError } = useError<typeof defaultData>();
  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(defaultData);
  // const navigate = useNavigate();
  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "post",
    mutationKey: ["createProductBrand"],
    url: "/product-brands"
  });
  const validator = new Validator({
    formData: formValues,
    rules: {
      name: "required:minLength:3",
      description: "required|minLength:3"
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
            description: "Product brand created"
          });
          setFormValues(defaultData);
          // navigate("/product-brands");
        }
      }
    );
  };

  return (
    <EditProductBrandFields
      pageTitle="Create Product Brand"
      buttonTitle={buttonTitle}
      formFields={formValues}
      handleFormFieldChange={handleFormFieldChange}
      onsubmitHandler={onsubmitHandler}
      errors={errors as Record<string, any>}
      isLoading={isPending}
    />
  );
};

export default CreateProductBrandScreen;
