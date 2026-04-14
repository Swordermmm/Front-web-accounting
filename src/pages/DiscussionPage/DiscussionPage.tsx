import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DiscussionPage.module.scss";
import { Button, Sidebar, DiscussionCard, Input } from "../../components/UI";
import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";

const DiscussionPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <Sidebar>
        <div>
          {" "}
          <Button variant="secondary" className={styles.sidebar_btn}>
            <img src={calendar} alt="Calendar icon" />
            Календарь
          </Button>
          <Button variant="secondary" className={styles.sidebar_btn}>
            <img src={chat} alt="Chat icon" />
            Обсуждения
          </Button>
          <Button variant="secondary" className={styles.sidebar_btn}>
            <img src={list} alt="List icon" />
            Список кейсов
          </Button>
        </div>
      </Sidebar>
      <div className={styles.main}>
        <div className={styles.cards}>
          <DiscussionCard />
        </div>
        <Input
          className={styles.message_input}
          placeholder="Введите текст"
        ></Input>
      </div>
    </div>
  );
};

export default DiscussionPage;
