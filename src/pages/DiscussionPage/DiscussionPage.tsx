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
  authorFullName: string;
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
        projectId: null,
        filter: 1,
      }),
      credentials: "include",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Ошибка загрузки команд");
  return response.json();
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

  const handleToggleModal = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
    toggleReactions(!showReactions);
  };

  // const [idea, setForms] = useState<Discussion[]>(discussions);

  // const updateField = <K extends keyof Discussion>(
  //   field: K,
  //   value: MeetingForm[K],
  // ) => {
  //   DiscussionCard((prev) => ({ ...prev, [field]: value }));
  // };

  // const handleAuthorChange = (value: string) => {
  //   setForms(
  //     (prevForms) =>
  //       (prevForms = {
  //         ...prevForms,
  //         authorFullName: value,
  //       }),
  //   );
  // };

  // const handleTextChange = (value: string) => {
  //   setForms(
  //     (prevForms) =>
  //       (prevForms = {
  //         ...prevForms,
  //         title: value,
  //       }),
  //   );
  // };

  // const handleSaveForm = () => {
  //   const newIdea = {
  //     title: idea.title,
  //     likeReactionsCount: idea.likeReactionsCount,
  //     dislikeReactionsCount: idea.dislikeReactionsCount,
  //     status: idea.status,
  //     authorFullName: idea.authorFullName,
  //   };
  //   toggleModal(!showModal);
  //   toggleSidebar(!showSidebar);
  //   toggleReactions(!showReactions);
  //   discussions.push(newIdea);
  //   localStorage.setItem("discussions", JSON.stringify(discussions));
  // };

  return (
    <>
      <Modal isOpen={showModal} toggle={handleToggleModal} isCrossNeeded={true}>
        <div className={styles["modal-title"]}>Добавление идеи</div>
        <div className={styles.modal_columns}>
          <div className={styles["modal-group"]}>
            <div>ФИО</div>
            <Input
              placeholder="Введите ФИО"
              className={styles.add_input}
              // onChange={(e) => handleAuthorChange(e.target.value)}
            ></Input>
          </div>
          <div className={styles["modal-group"]}>
            <div>Описание идеи</div>
            <textarea
              className={styles.add_input_2}
              // onChange={(e) => handleTextChange(e.target.value)}
            ></textarea>
          </div>
          {/* <Button onClick={() => handleSaveForm()} className={styles.save_btn}>
            Сохранить
          </Button> */}
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
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DiscussionPage;
