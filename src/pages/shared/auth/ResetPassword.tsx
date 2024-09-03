import PrimaryButton from "@/components/PrimaryButton";
import PasswordInput from "@/components/customFields/input/Password";
import { HandlerProps } from "@/components/customFields/type";
import { useAuthResetPassword } from "@/hooks/request/useAuthRequest";
import { useError } from "@/hooks/useError";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { Validator } from "@/validator";
import { LockKeyhole } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResetPasswordScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, token] = location.search.split("=");
  const initialData = {
    password: "",
    confirmPassword: ""
  };
  const { isPending, mutate } = useAuthResetPassword();
  const { addErrors, errors, resetError } = useError<typeof initialData>();
  const { formValues, updateFormFieldValue, setFormValues } = useFormFieldUpdate<typeof initialData>(initialData);

  const formFieldHandler = (data: HandlerProps) => {
    const { key, value } = data;
    updateFormFieldValue(key, value);
  };

  const handleForgotPassword = () => {
    const validator = new Validator<typeof initialData>({
      formData: formValues,
      rules: {
        password: "required|isPassword",
        confirmPassword: "required|sameAs:password"
      }
    });

    validator.validate();

    if (validator.failed()) {
      return addErrors(validator.getValidationErrorsByIndex());
    } else {
      resetError();
    }
    mutate(
      { ...formValues, token },
      {
        onSuccess() {
          setFormValues(initialData);
          navigate("/auth/login");
        }
      }
    );
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="md:min-w-[450px] m-auto p-5 space-y-3">
        <div className="heading my-4 space-y-1">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 border rounded-full bg-primary flex justify-center items-center">
              <LockKeyhole className="text-white" size={18} />
            </span>
            <h1 className="text-xl font-medium">Reset Password</h1>
          </div>
          <p className="text-sm font-light">Enter your new password to reset the password</p>
        </div>
        <div>
          <PasswordInput
            fieldKey="password"
            handleInputChange={formFieldHandler}
            value={formValues?.password}
            isRequired
            label={{ text: "New Password" }}
            errorMessage={errors?.password}
          />
        </div>
        <div>
          <PasswordInput
            fieldKey="confirmPassword"
            handleInputChange={formFieldHandler}
            value={formValues?.confirmPassword}
            isRequired
            label={{ text: "Confirm password" }}
            errorMessage={errors?.confirmPassword}
          />
        </div>
        <div className="mt-4">
          <PrimaryButton
            onClick={handleForgotPassword}
            className="w-full"
            loading={isPending}
            disabled={isPending}
            text="Submit"
          />
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
  );
};

export default ResetPasswordScreen;
