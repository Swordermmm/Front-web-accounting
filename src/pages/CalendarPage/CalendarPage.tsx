import type { FC } from "react";
import { useState, useMemo } from "react";
import { useDebounce } from "../../hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Константы

const DAYS_OF_WEEK = [
  { value: 1, label: "пн" },
  { value: 2, label: "вт" },
  { value: 3, label: "ср" },
  { value: 4, label: "чт" },
  { value: 5, label: "пт" },
];

const REPEAT_TYPES = [
  { value: 1, label: "Без повторений" },
  { value: 2, label: "Каждую неделю" },
];

// Типы

export interface Team {
  id: string;
  name: string;
  projectId: string;
  skills: string | null;
}

export interface MeetingForm {
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  teamId: string;
  daysOfWeek: number[];
  repeatType: number;
  occurrencesCount: number;
}

// API функции

const fetchCalendar = async (week: Week) => {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/meeting/calendar",
    {
      method: "POST",
      body: JSON.stringify({
        from: formatDate(week.start),
        to: formatDate(week.end),
      }),
      credentials: "include",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) throw new Error("Ошибка загрузки календаря");
  return response.json();
};

const fetchTeams = async () => {
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
  );

  if (!response.ok) throw new Error("Ошибка загрузки команд");
  return response.json();
};

const createMeeting = async (meeting: MeetingForm) => {
  const response = await fetch("https://galacat.xyz/alpha-api/api/meeting", {
    method: "POST",
    body: JSON.stringify(meeting),
    credentials: "include",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Ошибка создания встречи");
  return response.json();
};

// Вспомогательные функции

const getCurrentWeekRange = (): Week => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  const monday = new Date(today);
  monday.setDate(diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: monday, end: sunday };
};

const getWeekOffset = (week: Week, offset: number): Week => {
  const start = new Date(week.start);
  const end = new Date(week.end);

  start.setDate(start.getDate() + offset * 7);
  end.setDate(end.getDate() + offset * 7);

  return { start, end };
};

// Компонент

const initialMeetingForm: MeetingForm = {
  title: "",
  description: "",
  location: "",
  startAt: "",
  endAt: "",
  teamId: "",
  daysOfWeek: [1],
  repeatType: 1,
  occurrencesCount: 1,
};

const CalendarPage: FC = () => {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [week, setWeek] = useState<Week>(getCurrentWeekRange);
  const [meeting, setMeeting] = useState<MeetingForm>(initialMeetingForm);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamQuery, setTeamQuery] = useState<string>("");

  const debouncedTeamQuery = useDebounce(teamQuery, 300);

  const { data: calendarData, isLoading: isCalendarLoading } = useQuery({
    queryKey: ["calendar", week],
    queryFn: () => fetchCalendar(week),
  });

  const { data: teamsData, isLoading: isTeamsLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  const createMeetingMutation = useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      setShowModal(false);
      setMeeting(initialMeetingForm);
      setSelectedTeam(null);
      setTeamQuery("");
      alert("Встреча создана!");
    },
    onError: (error) => {
      console.error("Failed to create meeting:", error);
      alert("Ошибка при создании встречи");
    },
  });

  const calendar: Day[] = calendarData?.days || [];
  const teams: Team[] = teamsData?.items || [];

  const filteredTeams = useMemo(() => {
    if (!teamQuery) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(debouncedTeamQuery.toLowerCase()),
    );
  }, [teams, debouncedTeamQuery]);

  const handleToggleModal = () => {
    setShowModal(!showModal);
    setShowSidebar(!showSidebar);
  };

  const handlePrevWeek = () => {
    setWeek(getWeekOffset(week, -1));
  };

  const handleNextWeek = () => {
    setWeek(getWeekOffset(week, 1));
  };

  const updateMeetingField = <K extends keyof MeetingForm>(
    field: K,
    value: MeetingForm[K],
  ) => {
    setMeeting((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) =>
    updateMeetingField("title", value);

  const handleDescChange = (value: string) =>
    updateMeetingField("description", value);

  const handlePlaceChange = (value: string) =>
    updateMeetingField("location", value);

  const handleOftenChange = (value: number) =>
    updateMeetingField("repeatType", value);

  const handleAmountChange = (value: number) =>
    updateMeetingField("occurrencesCount", value);

  const handleDaysOfWeekChange = (value: string) =>
    updateMeetingField("daysOfWeek", [Number(value)]);

  const handleTeamSelect = (team: Team | null) => {
    setSelectedTeam(team);
    if (team) {
      updateMeetingField("teamId", team.id);
    } else {
      updateMeetingField("teamId", "");
    }
  };

  const handleStartChange = (value: string) => {
    const date = new Date(`2026-05-26T${value}:00.00+05:00`);
    updateMeetingField("startAt", date.toISOString());

    const endDate = new Date(date.getTime() + 3600000);
    updateMeetingField("endAt", endDate.toISOString());
  };

  const handlePostMeeting = () => {
    console.log(meeting);
    createMeetingMutation.mutate(meeting);
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
              value={meeting.title}
            />
          </div>

          <div
            className={`${styles[`modal-group`]} ${styles[`modal-group-combobox`]}`}
          >
            <div>Выбрать команду</div>
            <ComboBox
              value={selectedTeam}
              onChange={handleTeamSelect}
              options={filteredTeams}
              onQueryChange={setTeamQuery}
              displayValue={(team) => team?.name || ""}
              isLoading={isTeamsLoading}
              placeholder="Введите название команды"
              className={styles.add_input}
            />
          </div>

          <div className={styles["modal-group"]}>
            <div>Выбрать место встречи</div>
            <Input
              placeholder="Введите место встречи"
              className={styles.add_input}
              onChange={(e) => handlePlaceChange(e.target.value)}
              value={meeting.location}
            />
          </div>
          <div className={styles["modal-group"]}>
            <div>Описание</div>
            <Input
              placeholder="Введите описание встречи"
              className={styles.add_input}
              onChange={(e) => handleDescChange(e.target.value)}
              value={meeting.description}
            />
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
                />
              </div>
              <div className={styles["modal-group"]}>
                <div>Как часто</div>
                <select
                  className={styles.add_select}
                  value={meeting.repeatType}
                  onChange={(e) => handleOftenChange(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Выберите частоту
                  </option>
                  {REPEAT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles["modal-group"]}>
                <div>Конечная дата</div>
                <Input
                  placeholder="01.01.2026"
                  className={styles.add_input}
                  type="date"
                  disabled
                />
              </div>
            </div>
            <div className={styles.modal_column}>
              <div className={styles["modal-group"]}>
                <div>Начало встречи</div>
                <Input
                  placeholder="00 : 00"
                  className={styles.add_input}
                  type="time"
                  onChange={(e) => handleStartChange(e.target.value)}
                />
              </div>
              <div className={styles["modal-group"]}>
                <div>День недели</div>
                <div className={styles.modal_columns}>
                  {DAYS_OF_WEEK.map((day) => (
                    <label key={day.value} className={styles.label_dayOfWeek}>
                      <input
                        type="radio"
                        className={styles.btn_dayOfWeek_hidden}
                        value={day.value}
                        name="day"
                        // checked={meeting.daysOfWeek.includes(day.value)}
                        onChange={(e) => handleDaysOfWeekChange(e.target.value)}
                      />
                      <span className={styles.btn_dayOfWeek}>{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles["modal-group"]}>
                <div>Всего встреч</div>
                <Input
                  placeholder="Введите кол-во встреч"
                  type="number"
                  className={styles.add_input}
                  value={meeting.occurrencesCount || ""}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handlePostMeeting}
            className={styles.save_btn}
            disabled={createMeetingMutation.isPending}
          >
            {createMeetingMutation.isPending ? "Создание..." : "Сохранить"}
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
            func1={handlePrevWeek}
            func2={handleNextWeek}
          />
          <div className={styles.container}>
            <div>
              {isCalendarLoading ? (
                <div className={styles.no_meetings}>Загрузка...</div>
              ) : calendar.length > 0 ? (
                calendar.map((dayofweek: Day) => (
                  <CalendarCard
                    key={dayofweek.date}
                    date={dayofweek.date}
                    events={dayofweek.meetings}
                  />
                ))
              ) : (
                <div className={styles.no_meetings}>Нет встреч</div>
              )}
            </div>
            {!isCalendarLoading && (
              <Button
                onClick={handleToggleModal}
                className={
                  calendar.length > 0
                    ? styles.btn_create_event
                    : styles.btn_create_event_2
                }
              >
                Назначить встречу
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
