import { HandlerProps } from "@/components/customFields/type";
import DashboardLayout from "@/components/dashboard/Layout";
import { useCreateOrUpdateUserMutation } from "@/hooks/request/useUserRequest";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EditUserFields from "./EditUserFields";
import { useHandlerUserFormFieldValidation } from "@/hooks/useHandlerUserFormFieldValidation";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { UserProps } from "@/interfaces/user";
import { createDefaultUser } from "@/defaults";
import { objectDifference } from "@/helpers";

const CreateUserScreen = () => {
  const { isPending, mutate } = useCreateOrUpdateUserMutation();
  const { validate } = useHandlerUserFormFieldValidation();
  const navigate = useNavigate();
  const { errors, resetError, addErrors } = useError<UserProps>();
  const { formValues, updateFormFieldValue } = useFormFieldUpdate<Partial<UserProps>>(createDefaultUser());

  const handleFormFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    if (data.key === "role") {
      if (data.value === "admin") {
        updateFormFieldValue("userPermission", "*");
      }
    }
    updateFormFieldValue(key, value);
  };
  const createUserHandler = async () => {
    const { errorObj, formIsValid } = validate<UserProps>(formValues);
    if (!formIsValid) {
      return addErrors(errorObj);
    } else {
      resetError();
    }

    const payload = objectDifference(createDefaultUser(), formValues);
    mutate(
      { payload: payload as UserProps },
      {
        onSuccess: () => {
          toast.success("Success", {
            description: "User created"
          });
          navigate("/users");
        }
      }
    );
  };
  return (
    <DashboardLayout pageTitle="Create User">
      <EditUserFields
        buttonTitle="Create"
        formFields={formValues}
        handleFormFieldChange={handleFormFieldChange}
        onSubmitHandler={createUserHandler}
        errors={errors}
        isLoading={isPending}
        isNew
        pageTitle="Create user information"
      />
    </DashboardLayout>
  );
};

export default CreateUserScreen;
