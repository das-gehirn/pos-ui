import { Input, InputProps } from "@/components/ui/input";
import { ChangeEvent, FC } from "react";
import { FormIconProps, HandlerProps } from "../type";
import InputLabel from "../FieldLabel";
import InputError from "./InputError";

interface NumberFieldProps extends InputProps {
  label?: string | { text: string; icon?: FormIconProps; className?: string };
  isRequired?: boolean;
  handleInputChange: (data: HandlerProps) => void;
  errorMessage?: string;
  fieldKey: string;
  value?: number;
}

const NumberField: FC<NumberFieldProps> = ({
  value = "",
  onBlur,
  handleInputChange,
  disabled,
  label,
  id,
  errorMessage,
  isRequired,
  fieldKey,
  ...props
}) => {
  const handleInputFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { value }
    } = event;

    const numericValue = value === "" ? "" : parseFloat(value);

    if (handleInputChange) {
      handleInputChange({ key: fieldKey, value: numericValue });
    }
  };

  return (
    <div className="w-full">
      <div className="my-1.5">{label && <InputLabel id={id} required={isRequired || false} label={label} />}</div>
      <Input
        type="number"
        name={fieldKey}
        value={value}
        onBlur={onBlur}
        onChange={handleInputFieldChange}
        disabled={disabled}
        {...props}
        id={id}
      />
      {errorMessage && <InputError message={errorMessage} />}
    </div>
  );
};

export default NumberField;
