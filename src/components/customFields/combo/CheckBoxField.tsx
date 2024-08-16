import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { FC } from "react";
import InputLabel from "../FieldLabel";
import { FormIconProps, HandlerProps } from "../type";

interface CheckBoxFieldProps extends CheckboxProps {
  label?: string | { text: string; icon?: FormIconProps; className?: string };
  isRequired?: boolean;
  value?: any;
  handleFieldChange?: (data: HandlerProps) => void;
  fieldKey?: string;
}

const CheckBoxField: FC<CheckBoxFieldProps> = ({
  value,
  id,
  name,
  isRequired,
  label,
  handleFieldChange,
  fieldKey,
  ...props
}) => {
  const handleOnChange = (checked: boolean) => {
    if (handleFieldChange && fieldKey) {
      handleFieldChange({ key: fieldKey, value: checked });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Checkbox
        id={fieldKey}
        checked={!!value}  // Controlled via the value prop
        name={name}
        {...props}
        onCheckedChange={handleOnChange}
      />
      {label && <InputLabel id={id || fieldKey} required={isRequired || false} label={label} />}
    </div>
  );
};

export default CheckBoxField;
