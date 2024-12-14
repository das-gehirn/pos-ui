import { HandlerProps } from "@/components/customFields/type";
import { productDefaults } from "@/defaults";
import { objectDifference } from "@/helpers";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { ProductProps } from "@/interfaces/products";
import { Validator } from "@/validator";
// import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductEditFields from "./ProductEditFields";
import { UploadedFileProps } from "@/components/FileDropzone";
import { useState } from "react";
import { isObject } from "lodash";

const CreateProductScreen = () => {
  // const navigate = useNavigate();
  const [productImage, setProductImage] = useState<File>();
  const handleFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    if (key && key === "canExpire" && !value) {
      updateFormFieldValue("expirationDate", null);
    }
    updateFormFieldValue(key, value);
  };
  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "post",
    mutationKey: ["createProduct"],
    url: "/products",
    requireAuth: true
  });
  const { addErrors, errors, resetError } = useError<ProductProps>();
  const defaultData = productDefaults();
  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(defaultData);

  const handleSubmit = () => {
    const validator = new Validator<ProductProps>({
      formData: formValues as any,
      rules: {
        brandId: "required",
        availability: "required",
        categoryId: "required",
        description: "required|minLength:3",
        name: "required|minLength:3",
        barcodeSymbology: "required",
        productCodeId: "required",
        productSellingPrice: "required|isNumber|minValue:0.1",
        productUnitPrice: "required|isNumber|minValue:0.1",
        unitId: "required",
        status: "required|in:active,inactive,draft",
        supplierId: "required",
        weight: "required|isNumber"
      },
      customFieldKeys: {
        brandId: "Product brand",
        availability: "Availability",
        categoryId: "Product category",
        description: "Product description",
        name: "Product name",
        barcodeSymbology: "Barcode symbology",
        productCodeId: "Product code",
        productSellingPrice: "Selling price",
        productUnitPrice: "Unit price",
        unitId: "Product unit",
        status: "Status",
        supplierId: "Product Supplier",
        weight: "Weight"
      }
    });

    validator.validate();
    if (validator.failed()) {
      return addErrors(validator.getValidationErrorsByIndex());
    }
    resetError();

    // if (!productImage) {
    //   return toast.error("Error", {
    //     description: "Product image is required"
    //   });
    // }
    const payload = objectDifference(productDefaults(), formValues);
    let formData = new FormData();

    if (productImage) {
      formData.append("product_image", productImage || "");
      for (const data in payload) {
        if (isObject(payload[data])) {
          formData.append(data, JSON.stringify(payload[data]));
        } else {
          formData.append(data, payload[data]);
        }
      }
    }
    mutate(
      { payload: productImage ? formData : payload },
      {
        onSuccess() {
          toast.success("Success", {
            description: "Product created"
          });
          // navigate("/products");
          setFormValues(defaultData);
        }
      }
    );
  };
  const fileUploadHandler = (data: UploadedFileProps) => {
    setProductImage(data.uploadedFile);
  };
  return (
    <ProductEditFields
      buttonTitle="Create Product"
      formFields={formValues}
      handleFormFieldChange={handleFieldChange}
      onsubmitHandler={handleSubmit}
      errors={errors}
      isLoading={isPending}
      pageTitle="Create Product"
      formTitle="Product Information"
      pageDescription="Fill the form to create a product"
      handleImageUpload={fileUploadHandler}
    />
  );
};

export default CreateProductScreen;
