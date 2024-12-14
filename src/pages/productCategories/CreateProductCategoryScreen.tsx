import { HandlerProps } from "@/components/customFields/type";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { Validator } from "@/validator";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EditProductCategoryFields from "./EditProductCategoryFields";

const CreateProductCategoryScreen = () => {
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
    mutationKey: ["createProductCategory"],
    url: "/product-categories"
  });
  const validator = new Validator({
    formData: formValues,
    rules: {
      description: "required|minLength:5",
      name: "required:minLength:3"
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
            description: "Product category created"
          });
          // navigate("/product-categories");
          setFormValues(defaultData);
        }
      }
    );
  };

  return (
    <EditProductCategoryFields
      pageTitle="Create Product Category"
      buttonTitle={buttonTitle}
      formFields={formValues}
      handleFormFieldChange={handleFormFieldChange}
      onsubmitHandler={onsubmitHandler}
      errors={errors as Record<string, any>}
      isLoading={isPending}
      formTitle="Product Category Information"
      pageDescription="Fill the form to create a product category"
    />
  );
};

export default CreateProductCategoryScreen;
