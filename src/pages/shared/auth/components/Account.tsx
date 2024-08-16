import PrimaryButton from "@/components/PrimaryButton";
import InputField from "@/components/customFields/input/InputField";
import PhoneInputField from "@/components/customFields/input/Phone";
import { HandlerProps } from "@/components/customFields/type";
import { objectDifference } from "@/helpers";
import { BaseResponse } from "@/helpers/baseResponse";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { UserProps } from "@/interfaces/user";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { FC, useCallback, useEffect } from "react";

interface AccountProps {
  isLoading: boolean;
  user: Partial<UserProps>;
  mutate: UseMutateFunction<
    AxiosResponse<BaseResponse<Partial<UserProps>>, any>,
    Error,
    {
      payload: Partial<UserProps>;
    },
    void
  >;
}
const Account: FC<AccountProps> = ({ user, isLoading, mutate }) => {
  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(user);
  const payload = objectDifference(user, formValues);
  const onsubmitHandler = () => {

    mutate({ payload });
  };
  const handleFieldChange = useCallback((data: HandlerProps) => {
    updateFormFieldValue(data.key, data.value);
  }, []);

  useEffect(() => {
    setFormValues({ ...user });
  }, []);
  return (
    <>
      <div className="grid grid-cols-2 gap-x-3">
        <InputField
          fieldKey="firstName"
          handleInputChange={handleFieldChange}
          label="First Name"
          placeholder="First Name"
          value={formValues?.firstName}
          disabled={isLoading}
        />
        <InputField
          fieldKey="lastName"
          handleInputChange={handleFieldChange}
          label="Last Name"
          placeholder="Last Name"
          value={formValues?.lastName}
          disabled={isLoading}
        />
        <InputField
          fieldKey="email"
          handleInputChange={handleFieldChange}
          label="Email"
          placeholder="Email"
          value={formValues?.email}
          disabled={isLoading}
        />
        <PhoneInputField
          fieldKey="phone"
          handleInputChange={handleFieldChange}
          label="Phone"
          placeholder="Phone"
          value={formValues?.phone}
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center justify-end">
        <PrimaryButton
          text="Update Account"
          onClick={onsubmitHandler}
          loading={isLoading}
          disabled={isLoading || !(Object.keys(payload).length > 0)}
          className="md:w-[200px]"
        />
      </div>
    </>
  );
};

export default Account;
