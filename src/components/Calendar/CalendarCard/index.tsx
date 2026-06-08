import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./CalendarCard.module.scss";
import type { Event } from "../../../types";
import { useNavigate } from "react-router-dom";

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
    case 1:
      return "Понедельник";
    case 2:
      return "Вторник";
    case 3:
      return "Среда";
    case 4:
      return "Четверг";
    case 5:
      return "Пятница";
    case 6:
      return "Суббота";
    case 7:
      return "Воскресенье";
  }
}

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  date: Date;
  events: Event[];
}

const newTimeFormat = (time: Date) => {
  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(time);
  return formattedTime;
};

export const CalendarCard: FC<ContainerProps> = ({
  className,
  id,
  date,
  events,
  ...props
}) => {
  const navigate = useNavigate();

  const handleMeetingClick = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  return (
    <div className={classNames(className)} {...props}>
      <div className={styles.calendar_day_card}>
        <div className={styles.dayOfWeek_title}>
          {getDayOfWeek(new Date(date).getDay())} - {new Date(date).getDate()}{" "}
          {setMonth(new Date(date))}
          <hr />
        </div>
        <div>
          {events.map((event: Event) => (
            <div
              className={styles.flex_container}
              key={event.id}
              onClick={() => handleMeetingClick(event.id)}
              style={{ cursor: "pointer" }}
            >
              <div>
                {" "}
                <label className={styles.event_title}>{event.title}</label>
                <label className={styles.event_desc}>{event.description}</label>
                <label className={styles.event_place}>{event.location}</label>
              </div>
              <div>
                {" "}
                <label className={styles.event_start}>
                  {newTimeFormat(new Date(event.startAt))}
                </label>
                <label className={styles.event_end}>
                  {newTimeFormat(new Date(event.endAt))}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
