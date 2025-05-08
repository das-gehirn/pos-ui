import { HandlerProps } from "@/components/customFields/type";
import DashboardLayout from "@/components/dashboard/Layout";
import { useCreateOrUpdateUserMutation, useFetchUserQuery } from "@/hooks/request/useUserRequest";
import { useNavigate, useParams } from "react-router-dom";
import EditUserFields from "./EditUserFields";
import { useHandlerUserFormFieldValidation } from "@/hooks/useHandlerUserFormFieldValidation";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { useEffect } from "react";
import { objectDifference } from "@/helpers";
import { UserProps } from "@/interfaces/user";
import { toast } from "sonner";

const UpdateUserScreen = () => {
  const params = useParams<{ id: string }>();
  const { isPending, mutate } = useCreateOrUpdateUserMutation(params.id);
  const { data, isFetching } = useFetchUserQuery(params.id as string);
  const { errors, resetError, addErrors } = useError<typeof data>();

  const { validate } = useHandlerUserFormFieldValidation(false);
  const navigate = useNavigate();

  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(data);

  const handleFormFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    if (data.key === "role") {
      if (data.value === "admin") {
        updateFormFieldValue("userPermission", "*");
      }
    }

    updateFormFieldValue(key, value);
  };

  const updateUserHandler = async () => {
    const { errorObj, formIsValid } = validate<typeof formValues>(formValues);
    if (!formIsValid) {
      addErrors(errorObj);
      return;
    } else {
      resetError();
    }
    const payload = objectDifference(data, formValues) as UserProps;
    console.info({ payload });
    if (Object.keys(payload).includes("userPermission")) {
      payload.userPermission = formValues?.userPermission;
    }
    mutate(
      { payload },
      {
        onSuccess: () => {
          toast.success("Success", {
            description: "User updated"
          });
          navigate("/users");
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
    <DashboardLayout pageTitle="Create User" isLoading={isFetching}>
      <EditUserFields
        buttonTitle="Update"
        formFields={formValues as Record<string, any>}
        errors={errors as any}
        handleFormFieldChange={handleFormFieldChange}
        onSubmitHandler={updateUserHandler}
        isLoading={isPending}
        pageTitle="Update User Information"
      />
    </DashboardLayout>
  );
};

export default UpdateUserScreen;
