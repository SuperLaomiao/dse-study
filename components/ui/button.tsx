import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    // Map to our existing CSS variables
    const variantClasses =
      variant === "default"
        ? "bg-[var(--brand)] text-[var(--cream)] hover:bg-[var(--brand-strong)]"
        : variant === "secondary"
          ? "bg-[var(--cream)] border border-[rgba(35,64,43,0.16)] text-[var(--brand)] hover:bg-white"
          : variant === "destructive"
            ? "bg-red-500 text-white hover:bg-red-600"
            : variant === "outline"
              ? "border border-[rgba(114,95,63,0.08)] bg-background hover:bg-accent"
              : "bg-transparent hover:bg-[rgba(35,64,43,0.08)]";

    const sizeClasses =
      size === "default"
        ? "h-10 px-4 py-2 rounded-full"
        : size === "sm"
          ? "h-8 px-3 rounded-full text-sm"
          : size === "lg"
            ? "h-12 px-6 rounded-full"
            : size === "icon"
              ? "h-9 w-9 rounded-full p-0"
              : "";

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
