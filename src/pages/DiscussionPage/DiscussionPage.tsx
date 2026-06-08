import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Discussion {
  likeReactionsCount: number;
  dislikeReactionsCount: number;
  authorFullName: string;
  status: number;
  title: string;
  id?: string;
}

interface DiscussionForm {
  title: string;
  description: string;
}

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

const createIdea = async (idea: DiscussionForm) => {
  const response = await fetch("https://galacat.xyz/alpha-api/api/discussion", {
    method: "POST",
    body: JSON.stringify({
      title: idea.title,
      description: idea.description,
    }),
    credentials: "include",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Ошибка загрузки команд");
};

function DiscussionPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: discussionsData, isLoading: isdiscussionsLoading } = useQuery({
    queryKey: ["discussions"],
    queryFn: fetchDiscussions,
  });

  const discussions: Discussion[] = discussionsData?.items || [];

  const [showModal, toggleModal] = useState<boolean>(false);
  const [showSidebar, toggleSidebar] = useState<boolean>(true);
  const [showReactions, toggleReactions] = useState<boolean>(true);

  const handleToggleModal = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
    toggleReactions(!showReactions);
  };

  const [idea, setForms] = useState<DiscussionForm>({
    title: "",
    description: "",
  });

  const updateField = <K extends keyof DiscussionForm>(
    field: K,
    value: DiscussionForm[K],
  ) => {
    setForms((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => updateField("title", value);

  const handleDescChange = (value: string) => updateField("description", value);

  const createIdeaMutation = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      handleToggleModal();
      setForms({
        title: "",
        description: "",
      });
      alert("Идея создана!");
    },
    onError: (error) => {
      console.error("Failed to create meeting:", error);
      alert("Ошибка при создании встречи");
    },
  });

  const handleSaveForm = () => {
    createIdeaMutation.mutate(idea);
  };

  return (
    <>
      <Modal isOpen={showModal} toggle={handleToggleModal} isCrossNeeded={true}>
        <div className={styles["modal-title"]}>Добавление идеи</div>
        <div className={styles.modal_columns}>
          <div className={styles["modal-group"]}>
            <div>Название идеи</div>
            <Input
              placeholder="Введите название идеи"
              className={styles.add_input}
              onChange={(e) => handleTitleChange(e.target.value)}
              value={idea.title}
            ></Input>
          </div>
          <div className={styles["modal-group"]}>
            <div>Описание идеи</div>
            <textarea
              className={styles.add_input_2}
              onChange={(e) => handleDescChange(e.target.value)}
              value={idea.description}
            ></textarea>
          </div>
          <Button
            onClick={handleSaveForm}
            className={styles.save_btn}
            disabled={createIdeaMutation.isPending}
          >
            {createIdeaMutation.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
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
                hideBtn={false}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DiscussionPage;
