import { HandlerProps } from "@/components/customFields/type";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { Validator } from "@/validator";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EditProductUnitFields from "./EditProductUnitFields";

const CreateProductUnitScreen = () => {
  const buttonTitle = "Create";
  const defaultData = {
    description: "",
    title: "",
    name: ""
  };
  const { addErrors, errors, resetError } = useError<typeof defaultData>();
  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(defaultData);
  // const navigate = useNavigate();
  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "post",
    mutationKey: ["createProductUnit"],
    url: "/product-units"
  });
  const validator = new Validator({
    formData: formValues,
    rules: {
      description: "required|minLength:3",
      name: "required:minLength:3",
      title: "required:minLength:3"
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
            description: "Product unit created"
          });
          // navigate("/product-units");
          setFormValues(defaultData);
        }
      }
    );
  };

  return (
    <EditProductUnitFields
      pageTitle="Create Product Unit"
      buttonTitle={buttonTitle}
      formFields={formValues}
      handleFormFieldChange={handleFormFieldChange}
      onsubmitHandler={onsubmitHandler}
      errors={errors as Record<string, any>}
      isLoading={isPending}
      formTitle="Product Unit information"
      pageDescription="Fill the fields to create a product unit"
    />
  );
};

export default CreateProductUnitScreen;
