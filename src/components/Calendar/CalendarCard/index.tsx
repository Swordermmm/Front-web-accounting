import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./CalendarCard.module.scss";
import type { Event } from "../../../types";

// import { Button } from "../../UI/Button";

function setMonth(month: Date) {
  const stringMonth = month.getMonth();
  switch (stringMonth) {
    case 0:
      return "Янв";
    case 1:
      return "Фев";
    case 2:
      return "Мар";
    case 3:
      return "Апр";
    case 4:
      return "Мая";
    case 5:
      return "Июн";
    case 6:
      return "Июл";
    case 7:
      return "Авг";
    case 8:
      return "Сен";
    case 9:
      return "Окт";
    case 10:
      return "Нояб";
    case 11:
      return "Дек";
  }
}

function getDayOfWeek(number: number) {
  switch (number) {
    case 0:
      return "Понедельник";
    case 1:
      return "Вторник";
    case 2:
      return "Среда";
    case 3:
      return "Четверг";
    case 4:
      return "Пятница";
    case 5:
      return "Суббота";
    case 6:
      return "Воскресенье";
  }
}

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  date: Date;
  events: Event[];
}

export const CalendarCard: FC<ContainerProps> = ({
  className,
  id,
  date,
  events,
  ...props
}) => {
  return (
    <div className={classNames(className)} {...props}>
      <div className={styles.calendar_day_card}>
        <div className={styles.dayOfWeek_title}>
          {getDayOfWeek(date.getDay())} - {date.getDate()} {setMonth(date)}
          <hr />
        </div>
        <div>
          {events.map((event: Event) => (
            <div className={styles.flex_container}>
              <div>
                {" "}
                <label className={styles.event_title}>{event.title}</label>
                <label className={styles.event_desc}>{event.desc}</label>
                <label className={styles.event_place}>{event.place}</label>
              </div>
              <div>
                {" "}
                <label className={styles.event_start}>{event.start}</label>
                <label className={styles.event_end}>{event.end}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
