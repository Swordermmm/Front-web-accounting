import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./CalendarSwitch.module.scss";
import forward from "../../../assets/forward.svg";
import back from "../../../assets/back.svg";

import { Button } from "../../UI/Button";

function setMonth(month: Date) {
  const stringMonth = month.getMonth();
  switch (stringMonth) {
    case 0:
      return "Января";
    case 1:
      return "Февраля";
    case 2:
      return "Марта";
    case 3:
      return "Апреля";
    case 4:
      return "Мая";
    case 5:
      return "Июня";
    case 6:
      return "Июля";
    case 7:
      return "Августа";
    case 8:
      return "Сентября";
    case 9:
      return "Октября";
    case 10:
      return "Ноября";
    case 11:
      return "Декабря";
  }
}

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  monday: Date;
  sunday: Date;
  func1: any;
  func2: any;
}

export const CalendarSwitch: FC<ContainerProps> = ({
  className,
  id,
  monday,
  sunday,
  func1,
  func2,
  ...props
}) => {
  return (
    <div className={classNames(className)} {...props}>
      <div className={styles.calendar_container}>
        <Button className={styles.arrow_button} onClick={func1}>
          <img src={back}></img>
        </Button>
        <label className={styles.calendar_switch_title}>
          {" "}
          {monday.getDate()} {setMonth(monday)} - {sunday.getDate()}{" "}
          {setMonth(sunday)}
        </label>
        <Button className={styles.arrow_button} onClick={func2}>
          <img src={forward}></img>
        </Button>
      </div>
    </div>
  );
};
