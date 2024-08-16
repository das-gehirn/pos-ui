import { HandlerProps } from "@/components/customFields/type";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { Validator } from "@/validator";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { objectDifference } from "@/helpers";
import { useEffect, useState } from "react";
import ProductEditFields from "./ProductEditFields";
import { ProductProps } from "@/interfaces/products";
import { isObject } from "lodash";
import { UploadedFileProps } from "@/components/FileDropzone";

interface ValidatorProps {
  name: string;
  description: string;
}
const UpdateProductScreen = () => {
  const params = useParams<{ id: string }>();
  const [productImage, setProductImage] = useState<File>();
  const productId = params.id;
  const buttonTitle = "Update";
  const { addErrors, errors, resetError } = useError<ValidatorProps>();
  const { data, isFetching } = useGeneralQuery<ProductProps>({
    queryKey: ["product", productId],
    url: `/products/${productId}`
  });

  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(data);
  const navigate = useNavigate();
  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "put",
    mutationKey: ["updateProduct", productId as string],
    url: `/products/${productId}`
  });
  const validator = new Validator<ProductProps>({
    formData: formValues as any,
    rules: {
      brandId: "required",
      availability: "required",
      categoryId: "required",
      description: "required|minLength:5",
      name: "required|minLength:5",
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

  const handleFormFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    updateFormFieldValue(key, value);
  };

  const payload = objectDifference(data, formValues);

  const onsubmitHandler = () => {
    validator.validate();

    if (validator.failed()) {
      return addErrors(validator.getValidationErrorsByIndex());
    } else {
      resetError();
    }
    // if (!productImage) {
    //   return toast.error("Error", {
    //     description: "Product image is required"
    //   });
    // }
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
            description: "Product updated"
          });
          navigate("/products");
        }
      }
    );
  };
  useEffect(() => {
    if (data) {
      setFormValues(data);
    }
  }, [params.id, data]);
  const fileUploadHandler = (data: UploadedFileProps) => {
    setProductImage(data.uploadedFile);
  };
  return (
    <ProductEditFields
      pageTitle="Update Product"
      buttonTitle={buttonTitle}
      formFields={formValues as Record<string, any>}
      handleFormFieldChange={handleFormFieldChange}
      onsubmitHandler={onsubmitHandler}
      errors={errors as Record<string, any>}
      isLoading={isFetching}
      disabledButton={!Object.keys(payload).length || isPending}
      formTitle="Product information"
      pageDescription="Update product information"
      handleImageUpload={fileUploadHandler}
    />
  );
};

export default UpdateProductScreen;
