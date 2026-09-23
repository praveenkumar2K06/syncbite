import type { FormHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "./field";

function Form({ className, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  return <form className={cn("flex flex-col gap-6", className)} {...props} />;
}

function FormField({ className, ...props }: React.ComponentProps<typeof Field>) {
  return <Field className={cn("gap-2", className)} {...props} />;
}

function FormLabel(props: React.ComponentProps<typeof FieldLabel>) {
  return <FieldLabel className="text-xs font-medium text-foreground" {...props} />;
}

function FormDescription(props: React.ComponentProps<typeof FieldDescription>) {
  return <FieldDescription className="text-[11px] text-muted-foreground" {...props} />;
}

function FormError(props: React.ComponentProps<typeof FieldError>) {
  return <FieldError className="text-xs" {...props} />;
}

function FormEndIcon({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export {
  Form,
  FormField,
  FormLabel,
  FormDescription,
  FormError,
  FormEndIcon,
  FieldGroup,
  FieldSet,
};
