import type { FC } from "react";
import styles from "./CuratorPage.module.scss";
import { Button, Sidebar, Input, ProjectCard } from "../../components/UI";
import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teams from "../../assets/teams_icon.svg";

const CuratorPage: FC = () => {
  var num_projects = 500;

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
          ></Input>{" "}
        </div>
        <label className={styles.projects_title}>
          Всего проектов : {num_projects}{" "}
        </label>
        <div className={styles.cards}>
          <ProjectCard className={styles.curator_card}>
            <label>ФИО:</label>
            <label>Команды:</label>
          </ProjectCard>
          <ProjectCard className={styles.curator_card}>
            <label>ФИО:</label>
            <label>Команды:</label>
          </ProjectCard>
        </div>
        <Button className={styles.more_btn}>Загрузить ещё</Button>
      </div>
    </div>
  );
};

export default CuratorPage;
