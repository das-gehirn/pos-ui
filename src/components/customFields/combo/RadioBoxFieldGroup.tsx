import { FC } from "react";
import { HandlerProps } from "../type";
import InputLabel from "../FieldLabel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OptionsProps } from "@/interfaces";
import InputError from "../input/InputError";

interface RadioBoxFieldGroupProps {
  isRequired?: boolean;
  id?: string;
  description?: string;
  fieldKey: string;
  handleFieldChange: (data: HandlerProps) => void;
  value?: string;
  options: OptionsProps[];
  errorMessage?: string;
  disabled?: boolean;
}
const RadioBoxFieldGroup: FC<RadioBoxFieldGroupProps> = ({
  value,
  isRequired,
  id,
  description,
  handleFieldChange,
  fieldKey,
  options,
  errorMessage,
  disabled
}) => {
  const handleOnChange = (value: any) => {
    handleFieldChange({ key: fieldKey, value });
  };
  return (
    <div>
      <RadioGroup
        id={id}
        aria-describedby="helper-radio-text"
        value={value}
        onValueChange={handleOnChange}
        disabled={disabled}
      >
        {options &&
          options.length > 0 &&
          options.map((option, index) => {
            return (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  defaultValue={option.value}
                  disabled={disabled}
                />
                <InputLabel id={option.value} required={isRequired || false} label={option.label} />
              </div>
            );
          })}
      </RadioGroup>
      {errorMessage && <InputError message={errorMessage} />}
      <div className="ms-2 text-sm">
        <p id="helper-radio-text" className="text-xs font-normal text-gray-500 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default RadioBoxFieldGroup;
