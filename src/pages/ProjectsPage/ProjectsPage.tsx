import { useState } from "react";

import {
  Button,
  Sidebar,
  Checkbox,
  Input,
  ProjectCard,
  Modal,
} from "../../components/UI";

import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teams from "../../assets/teams_icon.svg";

import styles from "./ProjectsPage.module.scss";

interface Project {
  title: string;
  shortTitle?: string;
  description?: string;
  goal?: string;
  status: number;
  teamsCount: number;
  tasks?: string;
  mvp?: string;
}

function ProjectsPage() {
  const [showModal, toggleModal] = useState<boolean>(false);
  const [showSidebar, toggleSidebar] = useState<boolean>(true);

  const handleToggleModal = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
  };

  const dataTemplate: Project = {
    title: "проект2",
    description: "проект описание",
    shortTitle: "1",
    goal: "1",
    status: 1,
    teamsCount: 0,
    tasks: "1",
    mvp: "1",
  };

  let sproject = localStorage.getItem("project");

  var projects = [dataTemplate];

  var num_projects = projects.length;

  console.log(projects);

  let projectData: Project = dataTemplate;

  const [project, setForms] = useState<Project>({
    title: projectData.title,
    description: projectData.description,
    shortTitle: projectData.shortTitle,
    goal: projectData.goal,
    teamsCount: projectData.teamsCount,
    status: 1,
    tasks: projectData.tasks,
    mvp: projectData.mvp,
  });

  const typeStatus = (value: number) => {
    switch (value) {
      case 1:
        return "Активный";
      case 2:
        return "Отклонённый";
      case 3:
        return "Архивный";
      case 4:
        return "Завершённый";
    }
  };

  const handleTitleTextChange = (value: string) => {
    setForms(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          title: value,
        }),
    );
  };

  const handleDescTextChange = (value: string) => {
    setForms(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          description: value,
        }),
    );
  };

  const handleShortTitleChange = (value: string) => {
    setForms(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          shortTitle: value,
        }),
    );
  };

  const handleStatusChange = (value: number) => {
    setForms(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          status: value,
        }),
    );
  };

  const handleGoalChange = (value: string) => {
    setForms(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          goal: value,
        }),
    );
  };

  const handleTasksChange = (value: string) => {
    setForms(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          tasks: value,
        }),
    );
  };

  const handleMVPChange = (value: string) => {
    setForms(
      (prevForms) =>
        (prevForms = {
          ...prevForms,
          mvp: value,
        }),
    );
  };

  const handleSaveForm = () => {
    const newProject = {
      title: project.title,
      description: project.description,
      shortTitle: project.shortTitle,
      goal: project.goal,
      teamsCount: project.teamsCount,
      status: project.status,
      tasks: project.tasks,
      mvp: project.mvp,
    };
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
    projects.push(newProject);
    postProject(newProject);
  };

  async function postProject(newProject: Project) {
    try {
      const response = await fetch(
        "http://95.163.222.188:4999/scalar/#tag/projects/POST/api/project",
        {
          method: "POST",
          body: JSON.stringify(newProject),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );
      return response;
    } catch (error) {
      return "";
    }
  }

  return (
    <>
      <Modal
        isOpen={showModal}
        toggle={handleToggleModal}
        isCrossNeeded={true}
        isProject={true}
      >
        <div className={styles["modal-title"]}>Добавление проекта</div>
        <div className={styles.modal_columns}>
          <div className={styles.modal_column_1}>
            <div className={styles["modal-group"]}>
              <div>Название проекта</div>
              <Input
                placeholder="Введите название проекта"
                className={styles.add_input}
                onChange={(e) => handleTitleTextChange(e.target.value)}
              ></Input>
            </div>
            <div className={styles["modal-group"]}>
              <div>Краткое название проекта</div>
              <Input
                placeholder="Введите краткое название проекта"
                className={styles.add_input}
                onChange={(e) => handleShortTitleChange(e.target.value)}
              ></Input>
            </div>
            <div className={styles["modal-group"]}>
              <div>Описание проекта</div>
              <Input
                placeholder="Введите описание проекта"
                className={styles.add_input}
                onChange={(e) => handleDescTextChange(e.target.value)}
              ></Input>
            </div>
            <div className={styles["modal-group"]}>
              <div>Цель проекта</div>
              <Input
                placeholder="Введите цель проекта"
                className={styles.add_input}
                onChange={(e) => handleGoalChange(e.target.value)}
              ></Input>
            </div>
            <div className={styles["modal-group"]}>
              <div>Статус проекта</div>
              <select
                value={project.status}
                className={styles.add_input}
                onChange={(e) => handleStatusChange(Number(e.target.value))}
              >
                <option value="" disabled selected>
                  Статус
                </option>
                <option value={1}>Активный</option>
                <option value={2}>Отклонённый</option>
                <option value={3}>Архивный</option>
                <option value={4}>Завершённый</option>
              </select>
            </div>
          </div>
          <div className={styles.modal_column_2}>
            {" "}
            <div className={styles["modal-group"]}>
              <div>Задачи проекта</div>
              <textarea
                className={styles.add_input_2}
                onChange={(e) => handleTasksChange(e.target.value)}
              ></textarea>
            </div>
            <div className={styles["modal-group"]}>
              <div>MVP</div>
              <textarea
                className={styles.add_input_2}
                onChange={(e) => handleMVPChange(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <Button onClick={() => handleSaveForm()} className={styles.save_btn}>
          Сохранить
        </Button>
      </Modal>
      <div className={styles.wrapper}>
        <Sidebar isOpen={showSidebar}>
          <ul>
            <label className={styles.title}> Статус проекта :</label>
            <Checkbox label="Активные"></Checkbox>
            <Checkbox label="Отклоненные"></Checkbox>
            <Checkbox label="Архивные"></Checkbox>
            <Checkbox label="Завершенные"></Checkbox>
          </ul>
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
            className={styles.sidebar_btn}
            to="/calendar"
          >
            <img src={calendar} alt="Calendar icon" />
            Календарь
          </Button>
          <Button
            variant="secondary"
            className={`${styles.sidebar_btn} ${styles.marked}`}
            to="/projects"
          >
            <img src={list} alt="list icon" />
            Кейсы
          </Button>
        </Sidebar>
        <div className={styles.main}>
          <div className={styles.search}>
            <label className={styles.projects_title}>Поиск</label>
            <div className={styles.projects_essentials}>
              {" "}
              <Input
                type="text"
                className={styles.searchBar}
                placeholder="Введите название проекта"
              ></Input>{" "}
              <Button
                className={styles.sidebar_btn_2}
                onClick={handleToggleModal}
              >
                Добавить проект
              </Button>
            </div>
          </div>
          <label className={styles.projects_title}>
            Всего проектов : {num_projects}
          </label>
          <div className={styles.cards}>
            {projects.map((dproject) => (
              <ProjectCard>
                Название проекта: {dproject.title} <br />
                Краткое название проекта: {dproject.shortTitle}
                <br />
                Описание проекта: {dproject.description} <br />
                Задачи: {dproject.tasks} <br />
                Цель проекта: {dproject.goal}
                <br />
                Количество команд: {dproject.teamsCount}
                <br />
                Статус: {typeStatus(dproject.status)} <br />
              </ProjectCard>
            ))}
          </div>

          <Button className={styles.new_button}>Загрузить ещё</Button>
        </div>
      </div>
    </>
  );
}

export default ProjectsPage;
