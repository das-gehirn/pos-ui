import PrimaryButton from "@/components/PrimaryButton";
import InputField from "@/components/customFields/input/InputField";
import { HandlerProps } from "@/components/customFields/type";
import { useAuthForgotPasswordPassword } from "@/hooks/request/useAuthRequest";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { Validator } from "@/validator";
import { Key } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordScreen = () => {
  const initialData = {
    email: ""
  };
  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate(initialData);
  const { addErrors, errors, resetError } = useError<typeof initialData>();
  const { isPending, mutate } = useAuthForgotPasswordPassword();
  const formFieldHandler = (data: HandlerProps) => {
    const { key, value } = data;
    updateFormFieldValue(key, value);
  };
  const handleForgotPassword = () => {
    const validator = new Validator<typeof initialData>({
      formData: { email: formValues.email },
      rules: {
        email: "required|isEmail"
      }
    });

    validator.validate();

    if (validator.failed()) {
      return addErrors(validator.getValidationErrorsByIndex());
    } else {
      resetError();
    }

    mutate(
      { email: formValues.email },
      {
        onSuccess() {
          setFormValues(initialData);
        }
      }
    );
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="md:min-w-[450px] m-auto p-5">
        <div className="relative">
          <div className="heading my-4 space-y-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 border rounded-full bg-primary flex justify-center items-center">
                <Key className="text-white" size={18} />
              </span>
              <h1 className="text-xl font-medium">Forgot Password</h1>
            </div>
            <p className="text-sm font-light ">Enter your email to and receive a password reset link</p>
          </div>
          <div>
            <InputField
              fieldKey="email"
              handleInputChange={formFieldHandler}
              value={formValues?.email}
              isRequired
              label={{ text: "Email" }}
              errorMessage={errors?.email}
            />
          </div>
          <div className="mt-4">
            <PrimaryButton text="Submit" loading={isPending} disabled={isPending} onClick={handleForgotPassword} />
          </div>
          <div className="mt-6 text-center text-sm">
            <p>
              <span className="text-gray-500">Already have an account?</span>{" "}
              <Link to="/auth/login" className="underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
