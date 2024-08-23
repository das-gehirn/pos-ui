import { FC } from "react";
import { Banknote, Landmark, NotepadText, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SelectField from "@/components/customFields/Select/SelectField";
import InputField from "@/components/customFields/input/InputField";
import { HandlerProps } from "@/components/customFields/type";
import { BANK_NAME_OPTIONS, TELECOM_NAME_OPTIONS } from "@/helpers";

interface PaymentComponentProps {
  formValues: any;
  formFieldChangeHandler: (data: HandlerProps) => void;
  spaceSize: "sm" | "lg";
  disabled?: boolean;
}

const ModeOfPaymentForm: FC<PaymentComponentProps> = ({
  formValues,
  formFieldChangeHandler,
  spaceSize = "lg",
  disabled
}) => {
  const handleCheckBoxValueChange = (value: string) => {
    const resetFields: Record<string, any> = {
      cash: {
        networkType: null,
        mobileMoneyNumber: "",
        transactionId: "",
        bankName: "",
        bankBranch: "",
        bankAccountNumber: "",
        transactionNumber: "",
        chequeNumber: ""
      },
      "mobile money": {
        bankName: "",
        bankBranch: "",
        bankAccountNumber: "",
        transactionNumber: "",
        chequeNumber: ""
      },
      bank: {
        networkType: "",
        mobileMoneyNumber: "",
        transactionId: "",
        chequeNumber: ""
      },
      cheque: {
        networkType: undefined,
        mobileMoneyNumber: "",
        transactionId: "",
        bankAccountNumber: "",
        transactionNumber: ""
      }
    };

    formFieldChangeHandler({ value, key: "modeOfPayment" });
    Object.entries(resetFields[value]).forEach(([key, resetValue]) => {
      formFieldChangeHandler({ key, value: resetValue });
    });
  };

  // Adjust column count based on spaceSize prop
  const gridColumns = spaceSize === "sm" ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <Card className="border-none shadow-none p-0">
      <CardHeader className="px-0">
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Select a new payment method.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 p-0">
        <RadioGroup
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          onValueChange={handleCheckBoxValueChange}
          value={formValues?.modeOfPayment}
        >
          <div>
            <RadioGroupItem value="cash" id="cash" className="peer sr-only" aria-label="Cash" disabled={disabled} />
            <Label
              htmlFor="cash"
              className="flex flex-col items-center gap-y-2 justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-16"
            >
              <Banknote />
              <span className="text-center">Cash</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="mobile money"
              id="mobile-money"
              className="peer sr-only"
              aria-label="Mobile Money"
              disabled={disabled}
            />
            <Label
              htmlFor="mobile-money"
              className="flex flex-col items-center gap-y-2 justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-16"
            >
              <Smartphone />
              <span className="text-center">{spaceSize === "sm" ? "Momo" : "Mobile Money"}</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="bank" id="bank" className="peer sr-only" aria-label="Bank" disabled={disabled} />
            <Label
              htmlFor="bank"
              className="flex flex-col items-center gap-y-2 justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-16"
            >
              <Landmark />
              <span className="text-center">Bank</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="cheque"
              id="cheque"
              className="peer sr-only"
              aria-label="Cheque"
              disabled={disabled}
            />
            <Label
              htmlFor="cheque"
              className="flex flex-col items-center gap-y-2 justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-16"
            >
              <NotepadText />
              <span className="text-center">Cheque</span>
            </Label>
          </div>
        </RadioGroup>

        <div className={`grid ${gridColumns} md:grid-cols-2 gap-x-5 gap-y-5 md:gap-y-0`}>
          {formValues?.modeOfPayment === "mobile money" && (
            <>
              <SelectField
                fieldKey="networkType"
                options={TELECOM_NAME_OPTIONS}
                onChange={formFieldChangeHandler}
                label="Network type"
                selectValue={formValues?.networkType}
                isDisabled={disabled}
              />
              <InputField
                fieldKey="mobileMoneyNumber"
                handleInputChange={formFieldChangeHandler}
                label="Mobile money number"
                value={formValues?.mobileMoneyNumber}
                disabled={disabled}
              />
              <InputField
                fieldKey="transactionId"
                handleInputChange={formFieldChangeHandler}
                label="Transaction ID"
                value={formValues?.transactionId}
                disabled={disabled}
              />
            </>
          )}
          {formValues?.modeOfPayment === "bank" && (
            <>
              <SelectField
                fieldKey="bankName"
                options={BANK_NAME_OPTIONS}
                onChange={formFieldChangeHandler}
                label="Bank name"
                selectValue={formValues?.bankName}
                isDisabled={disabled}
              />
              <InputField
                fieldKey="bankBranch"
                handleInputChange={formFieldChangeHandler}
                label="Bank branch"
                value={formValues?.bankBranch}
                disabled={disabled}
              />
              <InputField
                fieldKey="bankAccountNumber"
                handleInputChange={formFieldChangeHandler}
                label="Bank account number"
                value={formValues?.bankAccountNumber}
                disabled={disabled}
              />

              <InputField
                fieldKey="transactionNumber"
                handleInputChange={formFieldChangeHandler}
                label="Bank transaction number"
                value={formValues?.transactionNumber}
                disabled={disabled}
              />
            </>
          )}

          {formValues?.modeOfPayment === "cheque" && (
            <>
              <InputField
                fieldKey="chequeNumber"
                handleInputChange={formFieldChangeHandler}
                label="Cheque Number"
                value={formValues?.chequeNumber}
                disabled={disabled}
              />
              <SelectField
                fieldKey="bankName"
                options={BANK_NAME_OPTIONS}
                onChange={formFieldChangeHandler}
                label="Bank name"
                selectValue={formValues?.bankName}
                isDisabled={disabled}
              />
              <InputField
                fieldKey="bankBranch"
                handleInputChange={formFieldChangeHandler}
                label="Bank branch"
                value={formValues?.bankBranch}
                disabled={disabled}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeOfPaymentForm;
