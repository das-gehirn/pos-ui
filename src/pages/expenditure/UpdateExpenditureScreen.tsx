import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import ExpenditureEditFields from "./components/ExpenditureEditFields";
import { OptionsProps } from "@/interfaces";
import { useEffect, useState } from "react";
import { expenditureDefault } from "@/defaults";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { HandlerProps } from "@/components/customFields/type";
import { ExpenditureProps } from "@/interfaces/expenditure";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { objectDifference } from "@/helpers";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const UpdateExpenditureScreen = () => {
  const params = useParams<{ id: string }>();
  const expenditureId = params.id;
  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(expenditureDefault());
  const [subExpenseType, setSubExpenseType] = useState<any[]>([]);
  const { data, isFetching } = useGeneralQuery<any>({
    queryKey: ["expenseTypes"],
    url: "/expense-types",
    enabled: true,
    query: { deleted: false },
    staleTime: 300000
  });

  const { isPending, mutate } = useGeneralMutation<ExpenditureProps>({
    mutationKey: ["updateExpenditure"],
    url: `/expenditures/${expenditureId}`,
    httpMethod: "put"
  });
  const { data: expenditureData } = useGeneralQuery<ExpenditureProps>({
    queryKey: ["expenditure", expenditureId],
    url: `/expenditures/${expenditureId}`,
    enabled: !!expenditureId
  });

  const resetKeys = (keys: string[]) => {
    for (const key of keys) {
      updateFormFieldValue(key, undefined);
    }
  };
  const formFieldChangeHandler = (props: HandlerProps) => {
    const { key, value } = props;
    if (key === "expenseHead") {
      const expenseHead = data?.data.find((d: any) => d._id === value) || {};
      setSubExpenseType(expenseHead?.subExpenses);
    }

    if (key === "modeOfPayment") {
      switch (value) {
        case "cash":
          resetKeys([
            "mobileMoneyNumber",
            "chequeNumber",
            "bankName",
            "bankAccountNumber",
            "transactionId",
            "networkType",
            "bankBranch"
          ]);
          break;
        case "mobile money":
          resetKeys(["chequeNumber", "bankName", "bankAccountNumber", "bankBranch", "transactionNumber"]);
          break;
        case "bank":
          resetKeys(["chequeNumber", "mobileMoneyNumber", "transactionId", "networkType"]);
          break;
        case "cheque":
          resetKeys(["mobileMoneyNumber", "bankAccountNumber", "transactionId", "networkType", "transactionNumber"]);
          break;

        default:
          break;
      }
    }
    if(key === "hasDiscount" && !value){
        updateFormFieldValue("discount", undefined);
    }
    updateFormFieldValue(key, value);
  };

  const expenseOptions: OptionsProps[] =
    data?.data.map((d: any) => {
      return {
        label: d.title,
        value: d._id
      };
    }) || [];
  const subExpenseOptions: OptionsProps[] =
    subExpenseType.map((d: any) => {
      return {
        label: d.title,
        value: d._id
      };
    }) || [];

  const payload = objectDifference(expenditureData, formValues) as ExpenditureProps;
  const handleExpenditureSubmit = () => {
    console.log(payload);
    
    mutate(
      { payload },
      {
        onSuccess() {
          toast.success("Success", {
            description: "Expenditure updated"
          });
        }
      }
    );
  };
  useEffect(() => {
    if (expenditureData) {
      setFormValues(expenditureData);
    }
  }, [params.id, expenditureData]);
  return (
    <ExpenditureEditFields
      buttonTitle="Update"
      expenseOptions={expenseOptions}
      subExpenseOptions={subExpenseOptions}
      formFieldChangeHandler={formFieldChangeHandler}
      onsubmitHandler={handleExpenditureSubmit}
      pageDescription="Fill the form to update the expenditure"
      pageTitle="Update Expenditure"
      disabledButton={!Object.keys(payload).length || isPending}
      formValues={formValues}
      isLoading={isFetching}
      isSubmitting={isPending}
    />
  );
};

export default UpdateExpenditureScreen;
