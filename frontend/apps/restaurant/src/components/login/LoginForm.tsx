import { useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { C } from "@/constants";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === "" ? "Please enter your email." : undefined),
  }),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(7, "Password must be at least 7 characters long."),
});

interface AuthFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function RestaurantAuthForm({ onSubmit: onSubmitProp }: AuthFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [errors, setErrors] = useState<string>("");
  const [busy, setBusy] = useState(false);

  function onSubmit(data: z.infer<typeof formSchema>) {
    setBusy(true);
    setErrors("");

    toast.promise(onSubmitProp(data.email, data.password), {
      loading: "Signing in…",
      success: () => {
        setBusy(false);
        return "Signed in successfully!";
      },
      error: (err) => {
        setBusy(false);
        setErrors(err.message);
        return err.message || "Could not sign in. Please try again.";
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@restaurant.com"
                required
                autoComplete="username"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {errors && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <p style={{ fontSize: 12, color: C.red, margin: 0 }}>{errors}</p>
          </div>
        )}
      </FieldGroup>
      <Field>
        <Button type="submit" disabled={busy} className="w-full mt-1 h-10 text-sm font-semibold">
          {busy ? "Signing in…" : "Sign In"}
        </Button>
      </Field>
    </form>
  );
}
