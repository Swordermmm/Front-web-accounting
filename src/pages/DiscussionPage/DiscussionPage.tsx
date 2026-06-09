import { useState } from "react";
import styles from "./DiscussionPage.module.scss";
import {
  Button,
  Sidebar,
  DiscussionCard,
  Input,
  Modal,
} from "../../components/UI";
import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teams from "../../assets/teams_icon.svg";

import type { ProjectForm } from "../ProjectsPage/ProjectsPage";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Discussion {
  likeReactionsCount: number;
  dislikeReactionsCount: number;
  authorFullName: string;
  status: number;
  title: string;
  id?: string;
}

const initialFormState: ProjectForm = {
  title: "",
  shortTitle: "",
  description: "",
  goal: "",
  status: 5,
  tasks: "",
  mvp: "",
};

const fetchDiscussions = async () => {
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/discussion/list",
    {
      method: "POST",
      body: JSON.stringify({
        limit: 100,
        offset: 0,
        search: null,
      }),
      credentials: "include",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) throw new Error("Ошибка загрузки обсуждений");
  return response.json();
};

const createProject = async (project: ProjectForm) => {
  const response = await fetch("https://galacat.xyz/alpha-api/api/project", {
    method: "POST",
    body: JSON.stringify(project),
    credentials: "include",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Неизвестная ошибка");
    throw new Error(errorText || "Ошибка создания проекта");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
};

function DiscussionPage() {
  const queryClient = useQueryClient();

  const { data: discussionsData, isLoading: isdiscussionsLoading } = useQuery({
    queryKey: ["discussions"],
    queryFn: fetchDiscussions,
  });

  const discussions: Discussion[] = discussionsData?.items || [];

  const [showModal, toggleModal] = useState<boolean>(false);
  const [showSidebar, toggleSidebar] = useState<boolean>(true);
  const [showReactions, toggleReactions] = useState<boolean>(true);
  const [project, setProject] = useState<ProjectForm>(initialFormState);

  const handleToggleModal = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
    toggleReactions(!showReactions);
  };

  const updateField = <K extends keyof ProjectForm>(
    field: K,
    value: ProjectForm[K],
  ) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => updateField("title", value);
  const handleShortTitleChange = (value: string) =>
    updateField("shortTitle", value);
  const handleDescChange = (value: string) => updateField("description", value);
  const handleGoalChange = (value: string) => updateField("goal", value);
  const handleTasksChange = (value: string) => updateField("tasks", value);
  const handleMVPChange = (value: string) => updateField("mvp", value);

  const createIdeaMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      console.log(project);
      handleToggleModal();
      setProject(initialFormState);
      alert("Идея создана!");
    },
    onError: (error) => {
      console.error("Failed to create meeting:", error);
      alert("Ошибка при создании встречи");
    },
  });

  const handleSaveForm = () => {
    createIdeaMutation.mutate(project);
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        toggle={handleToggleModal}
        isCrossNeeded={true}
        isProject={true}
      >
        <div className={styles["modal-title"]}>Создание идеи проекта</div>
        <div className={styles.modal_columns}>
          <div className={styles.modal_column_1}>
            <div className={styles["modal-group"]}>
              <div>Название проекта</div>
              <Input
                placeholder="Введите название проекта"
                className={styles.add_input}
                onChange={(e) => handleTitleChange(e.target.value)}
                value={project.title}
              />
            </div>
            <div className={styles["modal-group"]}>
              <div>Краткое название проекта</div>
              <Input
                placeholder="Введите краткое название проекта"
                className={styles.add_input}
                onChange={(e) => handleShortTitleChange(e.target.value)}
                value={project.shortTitle}
              />
            </div>
            <div className={styles["modal-group"]}>
              <div>Описание проекта</div>
              <Input
                placeholder="Введите описание проекта"
                className={styles.add_input}
                onChange={(e) => handleDescChange(e.target.value)}
                value={project.description}
              />
            </div>
            <div className={styles["modal-group"]}>
              <div>Цель проекта</div>
              <Input
                placeholder="Введите цель проекта"
                className={styles.add_input}
                onChange={(e) => handleGoalChange(e.target.value)}
                value={project.goal}
              />
            </div>
            <div className={styles["modal-group"]}>
              <div>Статус проекта</div>
              <select value={5} className={styles.add_input} disabled>
                <option key={5} value={5}>
                  Идея
                </option>
              </select>
            </div>
          </div>
          <div className={styles.modal_column_2}>
            <div className={styles["modal-group"]}>
              <div>Задачи проекта</div>
              <textarea
                className={styles.add_input_2}
                onChange={(e) => handleTasksChange(e.target.value)}
                value={project.tasks}
                placeholder="Введите задачи проекта"
              />
            </div>
            <div className={styles["modal-group"]}>
              <div>MVP</div>
              <textarea
                className={styles.add_input_2}
                onChange={(e) => handleMVPChange(e.target.value)}
                value={project.mvp}
                placeholder="Введите MVP"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleSaveForm}
          className={styles.save_btn}
          disabled={createIdeaMutation.isPending}
        >
          {createIdeaMutation.isPending ? "Создание..." : "Сохранить"}
        </Button>
      </Modal>
      <div className={styles.wrapper}>
        <Sidebar isOpen={showSidebar}>
          <div className={styles.sidebar_nav}>
            <Button
              variant="secondary"
              className={`${styles.sidebar_btn} ${styles.marked}`}
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
              className={styles.sidebar_btn}
              to="/projects"
            >
              <img src={list} alt="list icon" />
              Кейсы
            </Button>
          </div>
        </Sidebar>
        <div className={styles.main}>
          <div>
            <Button className={styles.add_idea_btn} onClick={handleToggleModal}>
              Добавить идею
            </Button>
          </div>
          <div className={styles.cards}>
            {discussions.map((discussion: Discussion) => (
              <DiscussionCard
                like={discussion.likeReactionsCount}
                dislike={discussion.dislikeReactionsCount}
                status={discussion.status}
                author={discussion.authorFullName}
                title={discussion.title}
                showReactions={showReactions}
                id={discussion.id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DiscussionPage;
