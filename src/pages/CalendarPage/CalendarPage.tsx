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
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
};

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

const calculateOccurrencesCount = (
  startAt: string,
  endAt: string,
  repeatType: number,
): number => {
  if (repeatType === 1) {
    return 1;
  }

  if (!startAt || !endAt) {
    return 1;
  }

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (endDate < startDate) {
    return 1;
  }

  const diffTime = endDate.getTime() - startDate.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

  return Math.max(1, diffWeeks);
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
      setShowSidebar(true);
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

  const filterMeetingsByWeek = (days: Day[], week: Week): Day[] => {
    const weekStart = new Date(week.start);
    const weekEnd = new Date(week.end);

    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);

    return days
      .filter((day: Day) => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate >= weekStart && dayDate <= weekEnd;
      })
      .map((day: Day) => {
        const filteredMeetings = (day.meetings || []).filter((meeting: any) => {
          const meetingDate = new Date(meeting.startAt);
          return meetingDate >= weekStart && meetingDate <= weekEnd;
        });

        const uniqueMeetings = Array.from(
          new Map(filteredMeetings.map((m: any) => [m.id, m])).values(),
        );

        return {
          ...day,
          meetings: uniqueMeetings,
        };
      });
  };

  const calendar: Day[] = useMemo(() => {
    const days = calendarData?.days || [];
    return filterMeetingsByWeek(days, week);
  }, [calendarData, week]);

  const teams: Team[] = teamsData?.items || [];

  const filteredTeams = useMemo(() => {
    if (!debouncedTeamQuery) return teams;
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

  const handleOftenChange = (value: number) => {
    updateMeetingField("repeatType", value);
    const occurrencesCount = calculateOccurrencesCount(
      meeting.startAt,
      meeting.endAt,
      value,
    );
    updateMeetingField("occurrencesCount", occurrencesCount);
  };

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
    if (!meeting.startAt) return;
    const timePart = meeting.startAt.slice(10);
    const date = new Date(value + timePart);

    const endDate = new Date(date.getTime() + 3600000);
    console.log(value);

    updateMeetingField("startAt", date.toISOString());
    updateMeetingField("endAt", endDate.toISOString());

    const occurrencesCount = calculateOccurrencesCount(
      date.toISOString(),
      endDate.toISOString(),
      meeting.repeatType,
    );
    updateMeetingField("occurrencesCount", occurrencesCount);
  };
  const handleEndChange = (value: string) => {
    if (!meeting.endAt) return;
    const timePart = meeting.endAt.slice(10);
    const date = new Date(value + timePart);

    updateMeetingField("endAt", date.toISOString());

    const occurrencesCount = calculateOccurrencesCount(
      meeting.startAt,
      date.toISOString(),
      meeting.repeatType,
    );
    updateMeetingField("occurrencesCount", occurrencesCount);
  };

  const handleStartTimeChange = (value: string) => {
    if (!meeting.startAt) {
      const now = new Date();
      const [hours, minutes] = value.split(":").map(Number);
      now.setHours(hours, minutes, 0, 0);

      const endDate = new Date(now.getTime() + 3600000);

      updateMeetingField("startAt", now.toISOString());
      updateMeetingField("endAt", endDate.toISOString());
      return;
    }

    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date(meeting.startAt);
    date.setHours(hours, minutes, 0, 0);

    const endDate = new Date(date.getTime() + 3600000);

    updateMeetingField("startAt", date.toISOString());
    updateMeetingField("endAt", endDate.toISOString());
  };

  const handlePostMeeting = () => {
    if (!meeting.startAt || !meeting.endAt) {
      alert("Укажите дату и время встречи");
      return;
    }

    const meetingToSend: MeetingForm = {
      ...meeting,
      startAt: meeting.startAt.endsWith("Z")
        ? meeting.startAt.slice(0, -1)
        : meeting.startAt,
      endAt: meeting.endAt.endsWith("Z")
        ? meeting.endAt.slice(0, -1)
        : meeting.endAt,
    };

    createMeetingMutation.mutate(meetingToSend);
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
                  value={meeting.startAt ? meeting.startAt.slice(0, 10) : ""}
                  disabled={meeting.startAt == ""}
                  className={styles.add_input}
                  type="date"
                  onChange={(e) => handleStartChange(e.target.value)}
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
                  onChange={(e) => handleEndChange(e.target.value)}
                  value={meeting.endAt ? meeting.endAt.slice(0, 10) : ""}
                  className={styles.add_input}
                  type="date"
                  disabled={meeting.repeatType === 1}
                />
              </div>
            </div>
            <div className={styles.modal_column}>
              <div className={styles["modal-group"]}>
                <div>Начало встречи</div>
                <Input
                  placeholder="00:00"
                  className={styles.add_input}
                  type="time"
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  value={
                    meeting.startAt
                      ? new Date(meeting.startAt).toTimeString().slice(0, 5)
                      : ""
                  }
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
                        checked={meeting.daysOfWeek.includes(day.value)}
                        onChange={(e) => handleDaysOfWeekChange(e.target.value)}
                      />
                      <span
                        className={`${styles.btn_dayOfWeek} ${
                          meeting.daysOfWeek.includes(day.value)
                            ? styles.btn_dayOfWeek_active
                            : ""
                        }`}
                      >
                        {day.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles["modal-group"]}>
                <div>Всего встреч</div>
                <div className={styles.occurrencesCount}>
                  {meeting.occurrencesCount || 1}
                </div>
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
