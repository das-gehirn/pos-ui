import Container from "@/components/Container";
import PrimaryButton from "@/components/PrimaryButton";
import SelectField from "@/components/customFields/Select/SelectField";
import InputField from "@/components/customFields/input/InputField";
import PasswordInput from "@/components/customFields/input/Password";
import PhoneInputField from "@/components/customFields/input/Phone";
import Permission from "@/components/customFields/permission/Permission";
import { HandlerProps } from "@/components/customFields/type";
import { GENDER_OPTIONS, ROLE_OPTIONS, USER_STATUS_OPTIONS, permissionResources } from "@/utils";
import { FC } from "react";
interface EditUserFieldsProps {
  buttonTitle: string;
  formFields: Record<string, any>;
  onSubmitHandler: () => void;
  handleFormFieldChange: (data: HandlerProps) => void;
  errors?: Record<string, string>;
  isLoading?: boolean;
  isNew?: boolean;
  pageTitle?: string;
}
const EditUserFields: FC<EditUserFieldsProps> = ({
  handleFormFieldChange,
  onSubmitHandler,
  formFields,
  errors,
  isLoading,
  buttonTitle,
  isNew,
  pageTitle
}) => {
  return (
    <Container className="border border-gray-100">
      {pageTitle && <h1>{pageTitle}</h1>}
      <div className="relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <InputField
            fieldKey="firstName"
            handleInputChange={handleFormFieldChange}
            label={"First Name"}
            placeholder="First Name"
            id="firstName"
            isRequired
            value={formFields?.firstName}
            errorMessage={errors?.firstName}
            disabled={isLoading}
          />
          <InputField
            fieldKey="lastName"
            handleInputChange={handleFormFieldChange}
            label={"Last Name"}
            placeholder="Last Name"
            id="lastName"
            isRequired
            value={formFields?.lastName}
            errorMessage={errors?.lastName}
            disabled={isLoading}
          />
          <InputField
            fieldKey="email"
            handleInputChange={handleFormFieldChange}
            label={"Email"}
            placeholder="Email"
            id="email"
            isRequired
            value={formFields?.email}
            errorMessage={errors?.email}
            disabled={isLoading}
          />
          <PhoneInputField
            fieldKey="phone"
            handleInputChange={handleFormFieldChange}
            label={"Phone"}
            id="phone"
            value={formFields?.phone}
            errorMessage={errors?.phone}
            disabled={isLoading}
          />
          <SelectField
            options={ROLE_OPTIONS}
            closeOnSelect
            isRequired
            onChange={handleFormFieldChange}
            label={"Role"}
            fieldKey={"role"}
            selectValue={formFields?.role}
            errorMessage={errors?.role}
            isDisabled={isLoading}
            key={formFields?.role}
          />

          <SelectField
            options={GENDER_OPTIONS}
            closeOnSelect
            isRequired
            onChange={handleFormFieldChange}
            label={"Gender"}
            fieldKey={"gender"}
            selectValue={formFields?.gender}
            errorMessage={errors?.gender}
            isDisabled={isLoading}
            key={formFields?.gender}
          />
          <SelectField
            options={USER_STATUS_OPTIONS}
            closeOnSelect
            isRequired
            onChange={handleFormFieldChange}
            label={"Status"}
            fieldKey={"status"}
            selectValue={formFields?.status}
            errorMessage={errors?.status}
            isDisabled={isLoading}
            key={formFields?.status}
          />
          {isNew && (
            <>
              <PasswordInput
                handleInputChange={handleFormFieldChange}
                fieldKey="password"
                placeholder="Password"
                label={"Password"}
                value={formFields?.password}
                errorMessage={errors?.password}
                disabled={isLoading}
              />
              <PasswordInput
                handleInputChange={handleFormFieldChange}
                fieldKey="confirmPassword"
                placeholder="Confirm Password"
                label={"Confirm Password"}
                value={formFields?.confirmPassword}
                errorMessage={errors?.confirmPassword}
                disabled={isLoading}
              />
            </>
          )}
        </div>
        {formFields?.role !== "admin" && (
          <Permission
            onChange={handleFormFieldChange}
            fieldKey="userPermission"
            permissionResources={permissionResources}
            userPermission={formFields?.userPermission}
          />
        )}
        <div className="flex items-center justify-end">
          <PrimaryButton
            text={buttonTitle}
            onClick={onSubmitHandler}
            loading={isLoading}
            disabled={isLoading}
            className="md:w-[200px]"
          />
        </div>
      </div>
    </Container>
  );
};

export default EditUserFields;
