import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProjectsPage.module.scss";
import {
  Button,
  Sidebar,
  Checkbox,
  Input,
  ProjectCard,
} from "../../components/UI";
import chat from "../../assets/chat_bubble.svg";

const ProjectsPage: FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <Sidebar>
        <ul>
          <label className={styles.title}> Статус проекта :</label>
          <Checkbox label="Активные"></Checkbox>
          <Checkbox label="Отклоненные"></Checkbox>
          <Checkbox label="Архивные"></Checkbox>
        </ul>
        <Button variant="secondary">
          <img src={chat} alt="Chat logo" />
          Обсуждения
        </Button>
      </Sidebar>
      <div className={styles.main}>
        <div className={styles.search}>
          <label className={styles.projects_title}>Поиск</label>
          <Input
            type="text"
            className={styles.searchBar}
            placeholder="Введите название проекта"
          ></Input>
        </div>
        <label className={styles.projects_title}>Всего проектов : 500 </label>
        <div className={styles.cards}>
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
        <Button>Загрузить ещё</Button>
      </div>
    </div>
  );
};

export default ProjectsPage;
