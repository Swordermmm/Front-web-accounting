import type { FC } from "react";
import styles from "./CuratorPage.module.scss";
import { Button, Sidebar, Input, ProjectCard } from "../../components/UI";
import { useState, useEffect } from "react";

import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students_icon from "../../assets/students_icon.svg";
import teams from "../../assets/teams_icon.svg";

import type { Team } from "../TeamsPage/TeamsPage";

export interface Curator {
  fullName: string;
  email: string;
  systemRole: string[];
  id: string;
  teams: Team[];
}

let body = {
  limit: 10,
  offset: 0,
  search: null,
  filter: 1,
};

const CuratorPage: FC = () => {
  const [curators, setCurators] = useState<Curator[]>([]);
  const [filteredSubjects, setFilters] = useState<Curator[]>([]);
  const [loading, isLoading] = useState<boolean>(true);

  const fetchCurators = async (body: any) => {
    const response = await fetch(
      "https://galacat.xyz/alpha-api/api/student/curator/list",
      {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
        headers: { accept: "*/*", "Content-Type": "application/json" },
      },
    )
      .then((response) => response.json())
      .then((json) => {
        setCurators(json.items);
        setFilters(json.items);
        isLoading(false);
      });

    if (!response.ok) throw new Error("Ошибка загрузки команд");
    return response;
  };

  const [fullName, setName]: [string, (name: string) => void] = useState("");

  useEffect(() => {
    if (loading) {
      fetchCurators(body);
      console.log;
    }
    if (curators.length > 0) {
      let filteredData = [...curators];
      if (fullName) {
        filteredData = filteredData.filter((subject) =>
          subject.fullName.toLowerCase().includes(fullName.toLowerCase()),
        );
      }
      setFilters(filteredData);
    }
  }, [fullName]);

  return (
    <div className={styles.wrapper}>
      <Sidebar isOpen={true}>
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
            <img src={students_icon} alt="Students icon" />
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
            className={`${styles.sidebar_btn} ${styles.marked}`}
            to="/curators"
          >
            <img src={search} alt="Search icon" />
            Кураторы
          </Button>
          <Button
            variant="secondary"
            className={styles.sidebar_btn}
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
        <div className={styles.search}>
          <label className={styles.projects_title}>Поиск</label>
          <Input
            type="text"
            className={styles.searchBar}
            placeholder="Введите ФИО куратора"
            onChange={(e) => setName(e.target.value)}
          ></Input>{" "}
        </div>
        <div className={styles.cards}>
          {filteredSubjects.map((curator: Curator) => (
            <ProjectCard className={styles.curator_card}>
              <label>ФИО: {curator.fullName}</label>
              <label>
                Команды:{" "}
                {curator.teams.map((team: Team) => (
                  <p>{team.name}</p>
                ))}
              </label>
            </ProjectCard>
          ))}
        </div>
        <Button className={styles.more_btn}>Загрузить ещё</Button>
      </div>
    </div>
  );
};

export default CuratorPage;
