import styles from "./Modal.module.scss";
import CloseIcon from "../../../assets/close_icon.svg";
import type { ReactNode } from "react";

interface ModalType {
  children?: ReactNode;
  isOpen?: boolean;
  isCrossNeeded: boolean;
  toggle: () => void;
}

export function Modal(props: ModalType) {
  return (
    <div
      className={`${styles["modal"]} ${
        props.isOpen ? styles["display-block"] : styles["display-none"]
      }`}
    >
      <div className={styles["modal-main"]}>
        {props.isCrossNeeded && (
          <>
            <button className={styles["close-button"]} onClick={props.toggle}>
              <img src={CloseIcon} className={styles["close-button-img"]} />
            </button>
          </>
        )}
        <div className={styles["modal-box"]}>{props.children}</div>
      </div>
    </div>
  );
}
