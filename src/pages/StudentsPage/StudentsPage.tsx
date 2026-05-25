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

interface Student {
  fullName: string;
  email: string;
  roleInTeam: string;
  teamNames: string[];
}

let body = {
  limit: 4,
  offset: 0,
  search: null,
  filter: 1,
};

const StudentsPage: FC = () => {
  let baseTemplate: Student = {
    fullName: "Игорь",
    email: "igor@gmail.com",
    roleInTeam: "аналитик",
    teamNames: ["команда 1"],
  };

  const [students, setStudents] = useState<Student[]>([]);

  async function getStudents() {
    try {
      const response = await fetch(
        "http://95.163.222.188:4999/api/student/list",
        {
          method: "POST",
          body: JSON.stringify(body),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return [
        baseTemplate,
        {
          fullName: "Катя",
          email: "kat@gmail.com",
          roleInTeam: "дизайнер",
          teamNames: ["команда 1"],
        },
      ];
    }
  }

  useEffect(() => {
    getStudents();
  }, []);

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
          ></Input>{" "}
        </div>
        <div className={styles.cards}>
          {students.map((student: Student) => (
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
