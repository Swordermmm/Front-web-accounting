import type { FC } from "react";
import { useState, useEffect } from "react";

import {
  Button,
  Sidebar,
  TeamsCard,
  Modal,
  Input,
  ComboBox,
} from "../../components/UI";
import type { Student } from "../StudentsPage/StudentsPage";
import type { Project } from "../ProjectsPage/ProjectsPage";

import styles from "./TeamsPage.module.scss";

import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teamsIcon from "../../assets/teams_icon.svg";
import enter from "../../assets/enter.svg";

interface Team {
  name: string;
  projectId: string;
  studentProfileIds: string[];
  skills: string;
}

const TeamsPage: FC = () => {
  const [showModal, toggleModal] = useState<boolean>(false);
  const [showSidebar, toggleSidebar] = useState<boolean>(true);
  const [teams, setTeams] = useState<[]>([]);

  const handleToggleModal = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
  };

  const [team, setTeam] = useState<Team>({
    name: "",
    projectId: "",
    studentProfileIds: [],
    skills: "",
  });

  function getRandomInt(): number {
    return Math.floor(Math.random() * (1000000 - 2 + 1));
  }

  const [student, setStudent] = useState<Student>({
    fullName: "",
    email: `example${getRandomInt()}@example.email`,
    roleInTeam: "",
  });

  let body = {
    limit: 6,
    offset: 0,
    search: null,
    projectId: null,
    filter: 1,
  };

  async function getTeams() {
    try {
      const response = await fetch(
        "https://galacat.xyz/alpha-api/api/student/team/list",
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
          setTeams(json.items);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const [projects, setDataset] = useState<Project[]>([]);

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
          setDataset(json.items);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTeams();
    getProjects();
  }, []);

  const handleTeamNameChange = (value: string) => {
    setTeam(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          name: value,
        }),
    );
  };

  const handleProjectChange = (value: string) => {
    const project = projects.find((project) => project.title === value);
    if (project != undefined) {
      setTeam(
        (prevForms) =>
          (prevForms = {
            ...prevForms,
            projectId: project.id,
          }),
      );
    }
  };

  const handleSkillsChange = (value: string) => {
    setTeam(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          skills: value,
        }),
    );
  };

  const handleStudentName = (value: string) => {
    setStudent(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          fullName: value,
        }),
    );
  };

  const handleStudentRole = (value: string) => {
    setStudent(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          roleInTeam: value,
        }),
    );
  };

  async function createStudent() {
    try {
      const response = await fetch(
        "https://galacat.xyz/alpha-api/api/student",
        {
          method: "POST",
          body: JSON.stringify(student),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      )
        .then((response) => response.json())
        .then((json) => {
          setStudent({
            fullName: "",
            email: "example@example.email",
            roleInTeam: "",
          });
          handleMemberChange(json.id);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateStudent = () => {
    createStudent();
  };

  const handleMemberChange = (value: string) => {
    setTeam(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          studentProfileIds: [value],
        }),
    );
    console.log(team);
  };

  async function CreateTeam(team: Team) {
    try {
      const response = await fetch(
        "https://galacat.xyz/alpha-api/api/student/team",
        {
          method: "POST",
          body: JSON.stringify(team),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response);
      window.location.reload();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateTeam = () => {
    CreateTeam(team);
  };

  return (
    <>
      <Modal isOpen={showModal} toggle={handleToggleModal} isCrossNeeded={true}>
        <div className={styles["modal-title"]}>Добавление команды</div>
        <div className={styles["modal-group"]}>
          <div>Название команды</div>
          <Input
            placeholder="Введите название команды"
            className={styles.add_input}
            onChange={(e) => handleTeamNameChange(e.target.value)}
          ></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div>Добавление проекта</div>
          <Input
            placeholder="Название проекта"
            className={styles.add_input}
            onChange={(e) => handleProjectChange(e.target.value)}
          ></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div>Добавить стек</div>
          <Input
            placeholder="Введите стек"
            className={styles.add_input}
            onChange={(e) => handleSkillsChange(e.target.value)}
          ></Input>
        </div>
        <div className={`${styles["modal-group"]}`}>
          <div>{team.studentProfileIds.length} участников</div>
          <div className={styles["flex-group"]}>
            <Input
              placeholder="Введите ФИО участника"
              className={styles.add_input}
              onChange={(e) => handleStudentName(e.target.value)}
              value={student.fullName}
            ></Input>
            <Button
              onClick={() => handleCreateStudent()}
              className={styles.btn_create}
            >
              {" "}
              <img src={enter}></img>
            </Button>
          </div>
        </div>
        <div className={styles["modal-group"]}>
          <div>Роль участника</div>
          <Input
            placeholder="Введите роль"
            className={styles.add_input}
            onChange={(e) => handleStudentRole(e.target.value)}
            value={student.roleInTeam}
          ></Input>
        </div>
        <Button onClick={() => handleCreateTeam()}>Сохранить</Button>
      </Modal>
      <div className={styles.wrapper}>
        <Sidebar isOpen={showSidebar}>
          <div className={styles.sidebar_nav}>
            {" "}
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
              className={`${styles.sidebar_btn} ${styles.marked}`}
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
          <div className={styles.cards}>
            <div className={styles.teams_title}>
              <label className={styles.projects_title}>Поиск</label>
              <div className={styles.search}>
                <Input
                  type="text"
                  className={styles.searchBar}
                  placeholder="Введите ФИО студента"
                ></Input>{" "}
                <Button
                  className={styles.sidebar_btn_2}
                  onClick={handleToggleModal}
                >
                  Добавить команду
                </Button>
              </div>
            </div>
            <div className={styles.cards_container}>
              {teams.map((team: any) => (
                <TeamsCard
                  projectTitle={team.projectTitle}
                  name={team.name}
                  skills={team.skills}
                  members={team.members}
                ></TeamsCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamsPage;
