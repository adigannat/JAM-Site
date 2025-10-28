import { FormEvent, useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { useAuth } from "@lib/auth";
import { useToast } from "@components/ui/Toast";
import { MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH } from "@lib/constants";

type AuthMode = "login" | "signup";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
});

const signupSchema = loginSchema.extend({
  name: z.string().min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters`)
});

type LoginSchema = z.infer<typeof loginSchema>;
type SignupSchema = z.infer<typeof signupSchema>;

interface AuthFormProps {
  defaultMode?: AuthMode;
}

export function AuthForm({ defaultMode = "login" }: AuthFormProps): JSX.Element {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const { login, signup, loading } = useAuth();
  const { notify } = useToast();
  const [errors, setErrors] = useState<Partial<Record<keyof SignupSchema, string>>>(
    {}
  );
  const [touched, setTouched] = useState<Partial<Record<keyof SignupSchema, boolean>>>(
    {}
  );

  const title = mode === "login" ? "Log in" : "Create an account";
  const description =
    mode === "login"
      ? "Sign in to scan stickers and build your collection."
      : "Create your event account to start collecting stickers.";

  const toggleCopy =
    mode === "login"
      ? "Need an account? Sign up"
      : "Already registered? Log in";

  const activeSchema = useMemo(
    () => (mode === "login" ? loginSchema : signupSchema),
    [mode]
  );

  const toggleMode = () => {
    setErrors({});
    setTouched({});
    setMode((current) => (current === "login" ? "signup" : "login"));
  };

  const validateField = (field: keyof SignupSchema, value: string) => {
    try {
      activeSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0]?.message }));
      }
    }
  };

  const handleBlur = (field: keyof SignupSchema, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData.entries());
    const parsed = activeSchema.safeParse(raw);
    if (!parsed.success) {
      const formErrors = parsed.error.formErrors.fieldErrors;
      setErrors({
        email: formErrors.email?.[0],
        password: formErrors.password?.[0],
        name: formErrors.name?.[0]
      });
      return;
    }

    setErrors({});

    try {
      if (mode === "login") {
        const { email, password } = parsed.data as LoginSchema;
        await login(email, password);
        notify({ title: "Welcome back!", variant: "success" });
      } else {
        const { email, password, name } = parsed.data as SignupSchema;
        await signup(email, password, name);
        notify({
          title: "Account created",
          description: "You are signed in and ready to scan stickers.",
          variant: "success"
        });
      }
    } catch (error) {
      console.error(error);
      notify({
        title: "Authentication failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to complete the request. Try again.",
        variant: "error"
      });
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-surface-muted/80 p-8 shadow-card backdrop-blur">
      <div className="mb-8 space-y-2 text-left">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-brand-200">
          Access
        </p>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/60">{description}</p>
      </div>

      <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
        <Input
          name="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          error={touched.email ? errors.email : undefined}
          onBlur={(e) => handleBlur("email", e.target.value)}
          onChange={(e) => {
            if (touched.email) validateField("email", e.target.value);
          }}
        />
        {mode === "signup" ? (
          <Input
            name="name"
            label="Display name"
            placeholder="JAM Explorer"
            autoComplete="name"
            error={touched.name ? errors.name : undefined}
            onBlur={(e) => handleBlur("name", e.target.value)}
            onChange={(e) => {
              if (touched.name) validateField("name", e.target.value);
            }}
          />
        ) : null}
        <Input
          name="password"
          label="Password"
          placeholder="••••••••"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          error={touched.password ? errors.password : undefined}
          onBlur={(e) => handleBlur("password", e.target.value)}
          onChange={(e) => {
            if (touched.password) validateField("password", e.target.value);
          }}
        />

        <Button type="submit" fullWidth loading={loading}>
          {mode === "login" ? "Log in" : "Sign up"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-6 text-sm font-medium text-brand-200 transition hover:text-brand-100"
        onClick={toggleMode}
      >
        {toggleCopy}
      </button>
    </div>
  );
}
