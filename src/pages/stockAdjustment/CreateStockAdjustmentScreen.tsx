import NumberField from "@/components/customFields/input/NumberField";
import TextAreaField from "@/components/customFields/input/TextAreaField";
import SelectField from "@/components/customFields/Select/SelectField";
import { HandlerProps } from "@/components/customFields/type";
import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import PrimaryButton from "@/components/PrimaryButton";
import { stockAdjustmentDefault } from "@/defaults";
import { objectDifference } from "@/helpers";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { ProductProps } from "@/interfaces/products";
import { StockAdjustmentProps } from "@/interfaces/stockAdjustment";
import { Validator } from "@/validator";
import { useMemo } from "react";
import { toast } from "sonner";

const CreateStockAdjustmentScreen = () => {
  const { addErrors, errors, resetError } = useError<StockAdjustmentProps>();
  const defaultData = stockAdjustmentDefault();
  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(defaultData);

  const handleFormFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    updateFormFieldValue(key, value);
  };

  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "post",
    mutationKey: ["stockAdjustment"],
    url: "/stock-adjustments"
  });
  const { data: productData } = useGeneralQuery<GetManyProps<ProductProps[]>>({
    queryKey: ["products"],
    url: "/products",
    query: { deleted: false, columns: "name" },
    requireAuth: true,
    enabled: true
  });

  const payload = objectDifference(defaultData, formValues);

  const validator = new Validator({
    formData: formValues,
    rules: {
      reason: "required|minLength:3",
      quantity: "required|minValue:1",
      type: "required:in:increment,decrement",
      productId: "required"
    },
    customFieldKeys: {
      type: "Adjustment type",
      reason: "Reason",
      quantity: "Adjustment quantity",
      productId: "Product"
    }
  });
  const onsubmitHandler = () => {
    validator.validate();

    if (validator.failed()) {
      return addErrors(validator.getValidationErrorsByIndex());
    } else {
      resetError();
    }

    mutate(
      { payload },
      {
        onSuccess() {
          toast.success("Success", {
            description: "Stock adjusted created"
          });
          setFormValues(defaultData);
        }
      }
    );
  };

  const productsOptions =
    productData?.data.map((product) => {
      return {
        label: `${product?.productCode?.code ? `${product?.productCode?.code} - ${product.name}` : product.name}`,
        value: product._id
      };
    }) || [];

  const quantityLeft = useMemo(() => {
    const product = productData?.data?.find((product) => product?._id === formValues?.productId);
    return product?.productQuantity?.availableQuantity || 0;
  }, [formValues?.productId]);

  const quantityAfterAdjustment = useMemo(() => {
    let quantity = quantityLeft;
    if (formValues?.type === "addition") {
      quantity += formValues?.quantity;
    }

    if (formValues?.type === "removal") {
      quantity -= formValues?.quantity;
    }

    if (formValues?.type === "correction") {
      quantity = formValues?.quantity;
    }
    return quantity;
  }, [formValues?.productId]);

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="space-y-5">
          <div className="grid md:grid-cols-3 gap-x-3 ">
            <NumberField
              fieldKey="quantity"
              handleInputChange={handleFormFieldChange}
              label="Adjustment quantity"
              isRequired
              errorMessage={errors?.quantity}
              value={formValues?.quantity}
              disabled={isPending}
            />
            <SelectField
              fieldKey="productId"
              onChange={handleFormFieldChange}
              label="Product"
              options={productsOptions}
              closeOnSelect
              errorMessage={errors?.productId}
              selectValue={formValues?.productId}
              isSearchable
              isRequired
              isDisabled={isPending}
            />
            <SelectField
              fieldKey="type"
              options={[
                { label: "Addition", value: "addition" },
                { label: "Removal", value: "removal" },
                { label: "Correction", value: "correction" }
              ]}
              onChange={handleFormFieldChange}
              label="Adjustment type"
              isDisabled={isPending}
              selectValue={formValues?.type}
              isRequired
            />
          </div>
          <TextAreaField
            fieldKey="reason"
            handleInputChange={handleFormFieldChange}
            label="Adjustment reason"
            isRequired
            errorMessage={errors?.reason}
            value={formValues?.reason}
            disabled={isPending}
          />
          <h1>Quantity left: {quantityLeft}</h1>
          <h1>Quantity after adjustments: {quantityAfterAdjustment}</h1>
          <div className="flex items-center justify-end">
            <PrimaryButton
              text={"Create"}
              onClick={onsubmitHandler}
              loading={isPending}
              disabled={isPending || Object.keys(errors).length > 0 || !Object.keys(payload).length}
              className="md:w-[200px]"
            />
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default CreateStockAdjustmentScreen;
