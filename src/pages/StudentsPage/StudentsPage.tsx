import type { FC } from "react";
import { useState, useEffect } from "react";
import styles from "./StudentsPage.module.scss";
import { Button, Sidebar, Input, ProjectCard } from "../../components/UI";
import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import studentsIcon from "../../assets/students_icon.svg";
import teams from "../../assets/teams_icon.svg";

export interface Student {
  updatedAt?: string;
  fullName: string;
  email: string;
  roleInTeam: string;
  teamNames?: string[];
  id?: string;
}

let body = {
  limit: 10,
  offset: 0,
  search: null,
  filter: 1,
};

const StudentsPage: FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredSubjects, setFilters] = useState<Student[]>([]);
  const [loading, isLoading] = useState<boolean>(true);

  async function getStudents() {
    try {
      const response = await fetch(
        "https://galacat.xyz/alpha-api/api/student/list",
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
          setStudents(json.items);
          setFilters(json.items);
          isLoading(false);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const [fullName, setName]: [string, (name: string) => void] = useState("");

  useEffect(() => {
    if (loading) {
      getStudents();
    }
    if (students.length > 0) {
      let filteredData = [...students];
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
            className={`${styles.sidebar_btn} ${styles.marked}`}
            to="/students"
          >
            <img src={studentsIcon} alt="Students icon" />
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
            placeholder="Введите ФИО студента"
            onChange={(e) => setName(e.target.value)}
          ></Input>{" "}
        </div>
        <div className={styles.cards}>
          {filteredSubjects.map((student: Student) => (
            <ProjectCard className={styles.student_card}>
              <label>ФИО: {student.fullName}</label>
              <label>Роль: {student.roleInTeam}</label>

              <label>Команда: {student.teamNames.join(", ")}</label>
            </ProjectCard>
          ))}
        </div>
        <Button>Загрузить ещё</Button>
      </div>
    </div>
  );
};

export default StudentsPage;
