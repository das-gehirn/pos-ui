import { useNavigate, useParams } from "react-router-dom";
import { HandlerProps } from "@/components/customFields/type";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { addMonths } from "date-fns";
import { objectDifference } from "@/helpers";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { toast } from "sonner";
import InvoiceEditFields from "./components/InvoiceEditFields";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { InvoiceProps } from "@/interfaces/invoice";
import { useEffect } from "react";

const EditInvoiceScreen = () => {
  const params = useParams<{ id: string }>();
  const invoiceId = params.id;
  const navigate = useNavigate();
  const { data } = useGeneralQuery<InvoiceProps>({
    queryKey: ["invoice", invoiceId],
    url: `/invoices/${invoiceId}`,
    enabled: !!invoiceId
  });

  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(data);

  const handleFormFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    if (key && key === "invoiceDate") {
      updateFormFieldValue("dueDate", addMonths(value, 1));
    }
    if (key === "hasDiscount" && !value) {
      updateFormFieldValue("discount", undefined);
    }
    if (key === "discount.value" && value > 100) {
      updateFormFieldValue(key, 0);
    } else updateFormFieldValue(key, value);
  };

  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "put",
    mutationKey: ["updateInvoice"],
    url: `/invoices/${invoiceId}`
  });
  const payload = objectDifference(data, formValues);

  const handleItemSubmit = () => {
    mutate(
      { payload },
      {
        onSuccess() {
          toast.success("Success", {
            description: "Invoice updated"
          });
          navigate("/invoices");
        }
      }
    );
  };
  useEffect(() => {
    if (data) {
      setFormValues(data);
    }
  }, [params.id, data]);
  return (
    <InvoiceEditFields
      buttonTitle="Edit invoice"
      handleFormFieldChange={handleFormFieldChange}
      onsubmitHandler={handleItemSubmit}
      pageDescription="Edit the form to update the invoice"
      pageTitle="Edit invoice"
      disabledButton={isPending || Object.keys(payload).length < 1}
      formFields={formValues}
      disableFields={isPending}
    />
  );
};

export default EditInvoiceScreen;
