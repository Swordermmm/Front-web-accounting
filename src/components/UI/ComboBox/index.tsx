import styles from "./ComboBox.module.scss";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

export interface ComboBoxProps<T> {
  value: T | null;
  onChange: (item: T | null) => void;
  options: T[];
  onQueryChange: (query: string) => void;
  displayValue: (item: T | null) => string;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function ComboBox<T>({
  value,
  onChange,
  options,
  onQueryChange,
  displayValue,
  isLoading = false,
  placeholder,
  className,
}: ComboBoxProps<T>) {
  // Скрываем дропдаун, если нет данных и нет загрузки
  const isOptionsVisible = options.length > 0 || isLoading;

  return (
    <Combobox value={value} onChange={onChange} immediate>
      <div className={styles.combobox_wrapper}>
        <ComboboxInput
          className={`${styles.combobox} ${className || ""}`}
          placeholder={placeholder}
          displayValue={displayValue}
          onChange={(event) => onQueryChange(event.target.value)}
        />

        <ComboboxOptions
          anchor="bottom start"
          className={`${styles.options} ${!isOptionsVisible ? styles.none : ""}`}
        >
          {isLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : options.length === 0 ? (
            <div className={styles.empty}>Ничего не найдено</div>
          ) : (
            options.map((item, index) => (
              <ComboboxOption
                key={index}
                value={item}
                className={styles.option}
              >
                {displayValue(item)}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
