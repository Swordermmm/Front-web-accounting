import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
import studentsIcon from "../../assets/students_icon.svg";
import teamsIcon from "../../assets/teams_icon.svg";

import styles from "./ProjectsPage.module.scss";

export interface Project {
  id: string;
  title: string;
  shortTitle?: string;
  description?: string;
  goal?: string;
  status: number;
  teamsCount: number;
  tasks?: string;
  mvp?: string;
}

export interface ProjectForm {
  title: string;
  shortTitle: string;
  description: string;
  goal: string;
  status: number;
  tasks: string;
  mvp: string;
}

const STATUS_OPTIONS = [
  { value: 1, label: "Активный" },
  { value: 2, label: "Отклонённый" },
  { value: 3, label: "Архивный" },
  { value: 4, label: "Завершённый" },
];

const STATUS_MAP: Record<number, string> = {
  1: "Активный",
  2: "Отклонённый",
  3: "Архивный",
  4: "Завершённый",
};

const PAGE_SIZE = 6;

const initialFormState: ProjectForm = {
  title: "",
  shortTitle: "",
  description: "",
  goal: "",
  status: 1,
  tasks: "",
  mvp: "",
};

const fetchProjects = async (params: {
  offset: number;
  statuses: number[];
}) => {
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/project/list",
    {
      method: "POST",
      body: JSON.stringify({
        limit: PAGE_SIZE,
        offset: params.offset,
        search: null,
        statuses: params.statuses,
      }),
      credentials: "include",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Ошибка загрузки проектов");
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

function ProjectsPage() {
  const queryClient = useQueryClient();

  // UI States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [statusFilters, setStatusFilters] = useState<number[]>([1]);

  const [project, setProject] = useState<ProjectForm>(initialFormState);

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["projects", offset, statusFilters],
    queryFn: () => fetchProjects({ offset, statuses: statusFilters }),
    keepPreviousData: true,
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowModal(false);
      setShowSidebar(true);
      setProject(initialFormState);
      alert("Проект успешно создан!");
    },
    onError: (error: Error) => {
      console.error("Failed to create project:", error);
      alert(`Ошибка при создании проекта: ${error.message}`);
    },
  });

  const newProjects: Project[] = projectsData?.items || [];

  useEffect(() => {
    if (offset === 0) {
      setAllProjects(newProjects);
      setHasMore(newProjects.length === PAGE_SIZE);
    } else {
      setAllProjects((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = newProjects.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });
      setHasMore(newProjects.length === PAGE_SIZE);
    }
  }, [newProjects, offset]);

  const filteredProjects = useMemo(() => {
    if (!searchTitle) return allProjects;
    return allProjects.filter((proj) =>
      proj.title.toLowerCase().includes(searchTitle.toLowerCase()),
    );
  }, [allProjects, searchTitle]);

  const handleToggleModal = () => {
    setShowModal(!showModal);
    setShowSidebar(!showSidebar);
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
  const handleStatusChange = (value: number) => updateField("status", value);
  const handleTasksChange = (value: string) => updateField("tasks", value);
  const handleMVPChange = (value: string) => updateField("mvp", value);

  const handleStatusFilterChange = (statusValue: number, checked: boolean) => {
    setStatusFilters((prev) => {
      if (checked) {
        return [...prev, statusValue];
      } else {
        return prev.filter((s) => s !== statusValue);
      }
    });
    setOffset(0); // Сбрасываем пагинацию при изменении фильтров
  };

  const handleSaveForm = () => {
    // Валидация
    if (!project.title.trim()) {
      alert("Введите название проекта");
      return;
    }
    if (!project.description.trim()) {
      alert("Введите описание проекта");
      return;
    }

    createProjectMutation.mutate(project);
  };

  const handleLoadMore = () => {
    setOffset((prev) => prev + PAGE_SIZE);
  };

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
              <select
                value={project.status}
                className={styles.add_input}
                onChange={(e) => handleStatusChange(Number(e.target.value))}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
          disabled={createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? "Создание..." : "Сохранить"}
        </Button>
      </Modal>

      <div className={styles.wrapper}>
        <Sidebar isOpen={showSidebar}>
          <ul>
            <label className={styles.title}>Статус проекта:</label>
            {STATUS_OPTIONS.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                checked={statusFilters.includes(option.value)}
                onChange={(e) =>
                  handleStatusFilterChange(option.value, e.target.checked)
                }
              />
            ))}
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
            <img src={studentsIcon} alt="Students icon" />
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
              <Input
                type="text"
                className={styles.searchBar}
                placeholder="Введите название проекта"
                onChange={(e) => setSearchTitle(e.target.value)}
                value={searchTitle}
              />
              <Button
                className={styles.sidebar_btn_2}
                onClick={handleToggleModal}
              >
                Добавить проект
              </Button>
            </div>
          </div>

          <label className={styles.projects_title}>
            Всего проектов: {filteredProjects.length}
          </label>

          <div className={styles.cards}>
            {isProjectsLoading && allProjects.length === 0 ? (
              <div className={styles.loading}>Загрузка проектов...</div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((dproject) => (
                <ProjectCard key={dproject.id || dproject.title}>
                  Название проекта: {dproject.title} <br />
                  Краткое название проекта: {dproject.shortTitle || "—"}
                  <br />
                  Описание проекта: {dproject.description || "—"} <br />
                  Задачи: {dproject.tasks || "—"} <br />
                  Цель проекта: {dproject.goal || "—"}
                  <br />
                  Количество команд: {dproject.teamsCount}
                  <br />
                  Статус: {STATUS_MAP[dproject.status] || "Неизвестный"} <br />
                </ProjectCard>
              ))
            ) : (
              <div className={styles.no_projects}>Проекты не найдены</div>
            )}
          </div>

          {hasMore && !isProjectsLoading && (
            <Button
              className={styles.new_button}
              onClick={handleLoadMore}
              disabled={isProjectsLoading}
            >
              {isProjectsLoading ? "Загрузка..." : "Загрузить ещё"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectsPage;
