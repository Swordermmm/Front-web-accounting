import type { FC } from "react";
import styles from "./CalendarPage.module.scss";
import { Button, Sidebar, Modal, Input, ComboBox } from "../../components/UI";
import { CalendarSwitch, CalendarCard } from "../../components/Calendar";
import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teams from "../../assets/teams_icon.svg";

import type { Day, Week, Event } from "../../types";

import { useState } from "react";

const CalendarPage: FC = () => {
  const [showModal, toggleModal] = useState<boolean>(false);
  const [showSidebar, toggleSidebar] = useState<boolean>(true);

  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const diffToMonday =
      today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    const monday = new Date(today.setDate(diffToMonday));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { start: monday, end: sunday };
  };

  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  var days: Day[] = [
    {
      day: new Date(),
      events: [
        {
          title: "Встреча",
          desc: "Описание",
          place: "Место встречи",
          start: "13:00",
          end: "14:00",
        },
        {
          title: "Встреча",
          desc: "Описание",
          place: "Место встречи",
          start: "13:00",
          end: "14:00",
        },
      ],
    },
    {
      day: new Date(),
      events: [
        {
          title: "Встреча",
          desc: "Описание",
          place: "Место встречи",
          start: "13:00",
          end: "14:00",
        },
        {
          title: "Встреча",
          desc: "Описание",
          place: "Место встречи",
          start: "13:00",
          end: "14:00",
        },
      ],
    },
    {
      day: new Date(),
      events: [
        {
          title: "Встреча",
          desc: "Описание",
          place: "Место встречи",
          start: "13:00",
          end: "14:00",
        },
        {
          title: "Встреча",
          desc: "Описание",
          place: "Место встречи",
          start: "13:00",
          end: "14:00",
        },
      ],
    },
  ];

  const [week, setWeek] = useState<Week>(getCurrentWeekRange);

  function getLastWeekRange() {
    setWeek({
      start: new Date(week.start.setDate(week.start.getDate() - 7)),
      end: new Date(week.end.setDate(week.end.getDate() - 7)),
    });
  }

  function getNextWeekRange() {
    setWeek({
      start: new Date(week.start.setDate(week.start.getDate() + 7)),
      end: new Date(week.end.setDate(week.end.getDate() + 7)),
    });
  }

  const handleToggleModal = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
  };

  const handleSaveForm = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
  };

  const dataset: string[] = ["Durrell", "Hellen", "Therese", "Theresewrewer"];

  return (
    <>
      <Modal isOpen={showModal} toggle={handleToggleModal} isCrossNeeded={true}>
        <div className={styles["modal-title"]}>Добавление встречи</div>
        <div>
          <div className={styles["modal-group"]}>
            <div>Выбрать проект</div>
            <ComboBox
              placeholder="Введите название проекта"
              className={styles.add_input}
              dataset={dataset}
            ></ComboBox>
          </div>
          <div className={styles["modal-group"]}>
            <div>Выбрать команду</div>
            <ComboBox
              placeholder="Введите название команды"
              className={styles.add_input}
              dataset={dataset}
            ></ComboBox>
          </div>
          <div className={styles["modal-group"]}>
            <div>Выбрать место встречи</div>
            <Input
              placeholder="Введите место встречи"
              className={styles.add_input}
            ></Input>
          </div>
          <div className={styles.modal_columns}>
            <div className={styles.modal_column}>
              <div className={styles["modal-group"]}>
                <div>Начальная дата</div>
                <Input
                  placeholder="01.01.2026"
                  className={styles.add_input}
                  type="date"
                ></Input>
              </div>
              <div className={styles["modal-group"]}>
                <div>Как часто</div>
                <select
                  // value={project.status}
                  className={styles.add_input}
                  // onChange={(e) => handleStatusChange(Number(e.target.value))}
                >
                  <option value="" disabled selected>
                    Выберите частоту
                  </option>
                  <option value={1}>Каждую неделю</option>
                  <option value={2}>Каждые 2 недели</option>
                  <option value={3}>Каждый месяц</option>
                </select>
              </div>
              <div className={styles["modal-group"]}>
                <div>Конечная дата</div>
                <Input
                  placeholder="01.01.2026"
                  className={styles.add_input}
                  type="date"
                ></Input>
              </div>
            </div>
            <div className={styles.modal_column}>
              {" "}
              <div className={styles["modal-group"]}>
                <div>Начало встречи</div>
                <Input
                  placeholder="00 : 00"
                  className={styles.add_input}
                ></Input>
              </div>
              <div className={styles["modal-group"]}>
                <div>День недели</div>
                <div className={styles.modal_columns}>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={"пн"}
                    />
                    <span className={styles.btn_dayOfWeek}>пн</span>
                  </label>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={"вт"}
                    />
                    <span className={styles.btn_dayOfWeek}>вт</span>
                  </label>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={"ср"}
                    />
                    <span className={styles.btn_dayOfWeek}>ср</span>
                  </label>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={"чт"}
                    />
                    <span className={styles.btn_dayOfWeek}>чт</span>
                  </label>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={"пт"}
                    />
                    <span className={styles.btn_dayOfWeek}>пт</span>
                  </label>
                </div>
              </div>
              <div className={styles["modal-group"]}>
                <div>Всего встреч</div>
                <Input
                  placeholder="Введите кол-во встреч"
                  className={styles.add_input}
                ></Input>
              </div>
            </div>
          </div>
          <Button onClick={() => handleSaveForm()} className={styles.save_btn}>
            Сохранить
          </Button>
        </div>
      </Modal>
      <div className={styles.wrapper}>
        <Sidebar isOpen={showSidebar}>
          <div className={styles.sidebar_nav}>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/discussion"
            >
              <img src={chat} alt="Chat icon" />
              Обсуждения
            </Button>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/students"
            >
              <img src={students} alt="Students icon" />
              Студенты
            </Button>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/teams"
            >
              <img src={teams} alt="Teams icon" />
              Команды
            </Button>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/curators"
            >
              <img src={search} alt="Search icon" />
              Кураторы
            </Button>
            <Button
              variant="secondary"
              className={`${styles.sidebar_btn} ${styles.marked}`}
              to="/calendar"
            >
              <img src={calendar} alt="Calendar icon" />
              Календарь
            </Button>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/projects"
            >
              <img src={list} alt="list icon" />
              Кейсы
            </Button>
          </div>
        </Sidebar>
        <div className={styles.main}>
          <CalendarSwitch
            className={`btn ${!showModal ? "active" : styles.disabled}`}
            monday={week.start}
            sunday={week.end}
            func1={getLastWeekRange}
            func2={getNextWeekRange}
          ></CalendarSwitch>
          <div className={styles.container}>
            <div>
              {days.length != 0 ? (
                days.map((dayofweek: Day) => (
                  <CalendarCard
                    date={dayofweek.day}
                    events={dayofweek.events}
                  ></CalendarCard>
                ))
              ) : (
                <div className={styles.no_meetings}>Нет встреч </div>
              )}
            </div>
            <Button
              onClick={handleToggleModal}
              className={
                days.length != 0
                  ? styles.btn_create_event
                  : styles.btn_create_event_2
              }
            >
              Назначить встречу
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
