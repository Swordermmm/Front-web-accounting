import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "secondary";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const classes = classNames(
      className,
      styles.input,
      styles[`input-${variant}`],
    );
    return <input className={classes} ref={ref} {...props} />;
  },
);
