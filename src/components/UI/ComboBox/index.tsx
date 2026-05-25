import { forwardRef } from "react";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import classNames from "classnames";
import styles from "./ComboBox.module.scss";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "secondary";
}

interface AdditionalProps extends InputProps {
  dataset: string[];
}

interface Data {
  name: string;
}

export const ComboBox = forwardRef<HTMLInputElement, AdditionalProps>(
  ({ className, variant = "primary", dataset, placeholder, ...props }, ref) => {
    const classes = classNames(
      className,
      styles.input,
      styles[`input-${variant}`],
    );

    const [selectedData, setSelectedData] = useState<Data | null>(null);
    const [query, setQuery] = useState("");

    const filteredData =
      query === ""
        ? dataset
        : dataset.filter((data: string) =>
            data.toLowerCase().includes(query.toLowerCase()),
          );

    const displayData = filteredData.slice(0, 3);

    return (
      <Combobox value={selectedData} onChange={setSelectedData}>
        <ComboboxInput
          displayValue={(data: string) => data}
          onChange={(event) => setQuery(event.target.value)}
          className={styles.combobox}
          placeholder={placeholder}
        />
        <ComboboxOptions
          anchor="bottom start"
          className={`${filteredData.length != 0 ? styles.options : styles.none}`}
        >
          {displayData.map((data: string) => (
            <ComboboxOption value={data} className={styles.option}>
              {data}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    );
  },
);
