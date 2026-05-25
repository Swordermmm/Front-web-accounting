import type { CheckboxProps as AntDCheckboxProps } from "antd";
import type { FC } from "react";

import styles from "./Checkbox.module.scss";

interface CheckboxProps extends AntDCheckboxProps {
  label?: string;
}

export const Checkbox: FC<CheckboxProps> = ({ label }) => {
  return (
    <>
      <label className={styles.custom_checkbox}>
        <input type="checkbox" className={styles.check} />
        <span className={styles.checkbox}></span>
        {label}
      </label>
    </>
  );
};
