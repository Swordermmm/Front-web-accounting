import type { FC, ChangeEvent } from "react";
import styles from "./CalendarPage.module.scss";
import { Button, Sidebar, Modal, Input, ComboBox } from "../../components/UI";
import { CalendarSwitch, CalendarCard } from "../../components/Calendar";
import chat from "../../assets/chat_bubble.svg";
import calendarIcon from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teamsIcon from "../../assets/teams_icon.svg";

import type { Day, Week } from "../../types";
import { useEffect, useState } from "react";

const CalendarPage: FC = () => {
  const [showModal, toggleModal] = useState<boolean>(false);
  const [showSidebar, toggleSidebar] = useState<boolean>(true);
  const [calendar, setCalendar] = useState<[]>([]);
  const [loading, isLoading] = useState<boolean>(true);

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

  const [week, setWeek] = useState<Week>(getCurrentWeekRange);

  function getLastWeekRange() {
    setWeek({
      start: new Date(week.start.setDate(week.start.getDate() - 7)),
      end: new Date(week.end.setDate(week.end.getDate() - 7)),
    });
    getCalendar();
  }

  function getNextWeekRange() {
    setWeek({
      start: new Date(week.start.setDate(week.start.getDate() + 7)),
      end: new Date(week.end.setDate(week.end.getDate() + 7)),
    });
    getCalendar();
  }

  const handleToggleModal = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
  };

  const [meeting, setMeeting] = useState({
    title: "",
    description: "",
    location: "",
    startAt: "",
    endAt: "",
    teamId: "",
    daysOfWeek: [1],
    repeatType: 1,
    occurrencesCount: 0,
  });

  const [teams, setTeams] = useState<[]>([]);
  const [projects, setProjects] = useState<[]>([]);

  async function getTeams() {
    try {
      const response = await fetch(
        "https://galacat.xyz/alpha-api/api/student/team/list",
        {
          method: "POST",
          body: JSON.stringify({
            limit: 100,
            offset: 0,
            search: null,
            projectId: null,
            filter: 1,
          }),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => response.json())
        .then((json) => {
          setTeams(json.items);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function getProjects() {
    try {
      const response = await fetch(
        "https://galacat.xyz/alpha-api/api/project/list",
        {
          method: "POST",
          body: JSON.stringify({
            limit: 100,
            offset: 0,
            search: null,
            statuses: [1],
          }),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => response.json())
        .then((json) => {
          setProjects(json.items);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function getCalendar() {
    let body = {
      from: `${week.start.getFullYear()}-${(week.start.getMonth() + 1).toString().padStart(2, "0")}-${week.start.getDate().toString().padStart(2, "0")}`,
      to: `${week.end.getFullYear()}-${(week.end.getMonth() + 1).toString().padStart(2, "0")}-${week.end.getDate().toString().padStart(2, "0")}`,
    };
    try {
      const response = await fetch(
        "https://galacat.xyz/alpha-api/api/meeting/calendar",
        {
          method: "POST",
          body: JSON.stringify(body),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json.days);
          setCalendar(json.days);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (loading) {
      getCalendar();
      getTeams();
      getProjects();
      isLoading(false);
    }
  }, [meeting]);

  const handleTitleChange = (value: string) => {
    setMeeting(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          title: value,
        }),
    );
    console.log(meeting.title);
  };

  const handleTeamChange = (value: string) => {
    const team = teams.find((team) => team.name === value);
    console.log(team);
    if (team != undefined) {
      setMeeting(
        (prevForms) =>
          (prevForms = {
            ...prevForms,
            teamId: team.id,
          }),
      );
    }
  };

  const handlePlaceChange = (value: string) => {
    setMeeting(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          location: value,
        }),
    );
  };

  const handleStartChange = (value: string) => {
    const date = new Date(`2026-05-26T${value}:00.00+05:00`);
    setMeeting(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          startAt: date.toISOString(),
        }),
    );
    console.log(date.toISOString());
    handleEndChange(date);
  };

  const handleEndChange = (value: Date) => {
    const date = new Date(`2026-05-26T${value}:00.00+05:00` + 3600000);
    setMeeting(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          endAt: date.toISOString(),
        }),
    );
  };

  const handleOftenChange = (value: number) => {
    setMeeting(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          repeatType: value,
        }),
    );
  };

  const handleDaysOfWeekChange = (value: string) => {
    setMeeting(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          daysOfWeek: [Number(value)],
        }),
    );
  };

  async function PostMeeting() {
    try {
      const response = await fetch(
        "https://galacat.xyz/alpha-api/api/meeting",
        {
          method: "POST",
          body: JSON.stringify(meeting),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => response.json())
        .then(() => {
          window.location.reload();
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const handlePostMeeting = () => {
    PostMeeting();
  };

  const handleAmountChange = (value: number) => {
    setMeeting(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          occurrencesCount: value,
        }),
    );
  };

  return (
    <>
      <Modal isOpen={showModal} toggle={handleToggleModal} isCrossNeeded={true}>
        <div className={styles["modal-title"]}>Добавление встречи</div>
        <div>
          <div className={styles["modal-group"]}>
            <div>Название встречи</div>
            <Input
              placeholder="Введите название встречи"
              className={styles.add_input}
              onChange={(e) => handleTitleChange(e.target.value)}
            ></Input>
          </div>
          <div className={styles["modal-group"]}>
            <div>Выбрать команду</div>
            <Input
              placeholder="Введите название команды"
              className={styles.add_input}
              onChange={(e) => handleTeamChange(e.target.value)}
            ></Input>
          </div>
          <div className={styles["modal-group"]}>
            <div>Выбрать место встречи</div>
            <Input
              placeholder="Введите место встречи"
              className={styles.add_input}
              onChange={(e) => handlePlaceChange(e.target.value)}
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
                  disabled
                ></Input>
              </div>
              <div className={styles["modal-group"]}>
                <div>Как часто</div>
                <select
                  className={styles.add_input}
                  onChange={(e) => handleOftenChange(Number(e.target.value))}
                >
                  <option value="" disabled selected>
                    Выберите частоту
                  </option>
                  <option value={1}>Без повторений</option>
                  <option value={2}>Каждую неделю</option>
                </select>
              </div>
              <div className={styles["modal-group"]}>
                <div>Конечная дата</div>
                <Input
                  placeholder="01.01.2026"
                  className={styles.add_input}
                  type="date"
                  disabled
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
                  onChange={(e) => handleStartChange(e.target.value)}
                ></Input>
              </div>
              <div className={styles["modal-group"]}>
                <div>День недели</div>
                <div className={styles.modal_columns}>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={0}
                      name="day"
                      onChange={(e) => handleDaysOfWeekChange(e.target.value)}
                    />
                    <span className={styles.btn_dayOfWeek}>пн</span>
                  </label>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={1}
                      name="day"
                      onChange={(e) => handleDaysOfWeekChange(e.target.value)}
                    />
                    <span className={styles.btn_dayOfWeek}>вт</span>
                  </label>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={2}
                      name="day"
                      onChange={(e) => handleDaysOfWeekChange(e.target.value)}
                    />
                    <span className={styles.btn_dayOfWeek}>ср</span>
                  </label>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={3}
                      name="day"
                      onChange={(e) => handleDaysOfWeekChange(e.target.value)}
                    />
                    <span className={styles.btn_dayOfWeek}>чт</span>
                  </label>
                  <label className={styles.label_dayOfWeek}>
                    <input
                      type="radio"
                      className={styles.btn_dayOfWeek_hidden}
                      value={4}
                      name="day"
                      onChange={(e) => handleDaysOfWeekChange(e.target.value)}
                    />
                    <span className={styles.btn_dayOfWeek}>пт</span>
                  </label>
                </div>
              </div>
              <div className={styles["modal-group"]}>
                <div>Всего встреч</div>
                <Input
                  placeholder="Введите кол-во встреч"
                  type="number"
                  className={styles.add_input}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                ></Input>
              </div>
            </div>
          </div>
          <Button
            onClick={() => handlePostMeeting()}
            className={styles.save_btn}
          >
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
              <img src={teamsIcon} alt="Teams icon" />
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
              <img src={calendarIcon} alt="Calendar icon" />
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
              {calendar.length != 0 ? (
                calendar.map((dayofweek: Day) => (
                  <CalendarCard
                    date={dayofweek.date}
                    events={dayofweek.meetings}
                  ></CalendarCard>
                ))
              ) : (
                <div className={styles.no_meetings}>Нет встреч </div>
              )}
            </div>
            <Button
              onClick={handleToggleModal}
              className={
                calendar.length != 0
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
