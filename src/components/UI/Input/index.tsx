import { forwardRef } from "react";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "secondary";
}

interface AdditionalProps extends InputProps {
  dataset?: string[];
  id?: string;
  type?: string;
}

export const Input = forwardRef<HTMLInputElement, AdditionalProps>(
  ({ className, variant = "primary", dataset, id, type, ...props }, ref) => {
    const classes = classNames(
      className,
      styles.input,
      styles[`input-${variant}`],
    );
    return (
      <>
        <input className={classes} ref={ref} {...props} list={id} type={type} />
        {dataset != undefined ? (
          <datalist id={id}>
            {dataset.map((op) => (
              <option>{op}</option>
            ))}
          </datalist>
        ) : (
          <></>
        )}
      </>
    );
  },
);
