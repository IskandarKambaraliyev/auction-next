"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { CustomInput } from "@/components/custom";
import { Button } from "@/components/ui/button";

import { authCheck, authLogin, authRegister } from "@/actions/auth";

type EmailError = {
  emailError: string | null;
};
type FormError = {
  formError: string | null;
  success: boolean;
};

export default function AuthPage() {
  const [step, setStep] = useState<"check" | "login" | "register">("check");
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex-center py-28">
      <AnimatePresence mode="wait">
        {step === "check" ? (
          <CheckForm
            email={email}
            setEmail={setEmail}
            setStep={setStep}
            key="check"
          />
        ) : step === "login" ? (
          <LoginForm
            email={email}
            setStep={setStep}
            key="login"
            redirectUrl={redirectUrl}
          />
        ) : (
          <RegisterForm
            email={email}
            setStep={setStep}
            key="register"
            redirectUrl={redirectUrl}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type CheckErrors = EmailError &
  FormError & {
    isRegistered: boolean | null;
  };
const checkInitialState: CheckErrors = {
  emailError: null,
  formError: null,
  success: false,
  isRegistered: null,
};
type CheckFormProps = {
  email: string;
  setEmail: (email: string) => void;
  setStep: (step: "check" | "login" | "register") => void;
};
const CheckForm = ({ email, setEmail, setStep }: CheckFormProps) => {
  const [state, formAction] = useActionState(authCheck, checkInitialState);

  useEffect(() => {
    if (state.success) {
      setStep(state.isRegistered ? "login" : "register");
    }
  }, [state.success]);
  return (
    <Form
      title="Welcome"
      subtitle="Log in or Register with your email"
      error={state.formError}
      action={formAction}
    >
      <CustomInput
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="username"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        error={state.emailError}
      />
    </Form>
  );
};

type LoginErrors = FormError & {
  passwordError: string | null;
};
const loginInitialState: LoginErrors = {
  passwordError: null,
  formError: null,
  success: false,
};
type LoginFormProps = {
  redirectUrl: string | null;
  email: string;
  setStep: (step: "check" | "login" | "register") => void;
};
const LoginForm = ({ redirectUrl, email, setStep }: LoginFormProps) => {
  const [state, formAction] = useActionState(authLogin, loginInitialState);
  const [password, setPassword] = useState("");

  const handleBack = () => {
    setStep("check");
  };
  return (
    <Form
      title="Welcome back!"
      subtitle="Enter your password to log in"
      onBack={handleBack}
      action={formAction}
      error={state.formError}
    >
      <CustomInput
        id="login-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        minLength={8}
        maxLength={30}
        required
        error={state.passwordError}
      />
      <input type="hidden" name="email" value={email} />
      {redirectUrl && (
        <input type="hidden" name="redirect" value={redirectUrl} />
      )}
    </Form>
  );
};

type RegisterErrors = FormError & {
  nameError: string | null;
  passwordError: string | null;
  confirmError: string | null;
};
const registerInitialState: RegisterErrors = {
  nameError: null,
  passwordError: null,
  confirmError: null,
  formError: null,
  success: false,
};
type RegisterFormProps = {
  redirectUrl: string | null;
  email: string;
  setStep: (step: "check" | "login" | "register") => void;
};
const RegisterForm = ({ redirectUrl, email, setStep }: RegisterFormProps) => {
  const [state, formAction] = useActionState(
    authRegister,
    registerInitialState
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");

  const handleBack = () => {
    setStep("check");
  };
  return (
    <Form
      title="Register"
      subtitle="Enter your details to create an account"
      onBack={handleBack}
      action={formAction}
      error={state.formError}
    >
      <CustomInput
        id="register-name"
        name="name"
        label="Your Name"
        type="text"
        autoComplete="name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        minLength={3}
        maxLength={50}
        required
        error={state.nameError}
      />
      <CustomInput
        id="register-password"
        name="password"
        label="Enter Password"
        type="password"
        autoComplete="new-password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        minLength={8}
        maxLength={30}
        required
        error={state.passwordError}
      />
      <CustomInput
        id="register-confirm-password"
        name="confirm"
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        onChange={(e) => setConfirm(e.target.value)}
        value={confirm}
        minLength={8}
        maxLength={30}
        required
        error={state.confirmError}
      />
      <input type="hidden" name="email" value={email} />
      {redirectUrl && (
        <input type="hidden" name="redirect" value={redirectUrl} />
      )}
    </Form>
  );
};

type FormProps = {
  title: string;
  subtitle: string;
  action?: (payload: FormData) => void;
  error?: string | null;
  children: React.ReactNode;
  onBack?: () => void;
};
const Form = ({
  title,
  subtitle,
  action,
  error,
  children,
  onBack,
}: FormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const input = formRef.current?.querySelector("input");

    if (input) {
      input.focus();
    }
  }, []);

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  return (
    <motion.form
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="relative max-w-sm w-[calc(100%-2rem)] p-4 rounded-2xl bg-white flex flex-col gap-4"
      action={action}
      ref={formRef}
    >
      {onBack && (
        <button
          type="button"
          className="absolute bottom-[calc(100%+1rem)] left-0 bg-white rounded-full size-10 flex-center hover:opacity-80"
          onClick={onBack}
        >
          <ArrowLeftIcon className="size-5" />
        </button>
      )}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>

        {error && <p className="text-red-500">{error}</p>}
      </div>

      {children}

      <FormButton />
    </motion.form>
  );
};

const FormButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending && <Loader2Icon className="animate-spin" />}
      Continue
    </Button>
  );
};
