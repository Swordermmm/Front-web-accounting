import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button, Sidebar, TeamsCard, Modal, Input } from "../../components/UI";

import styles from "./TeamsPage.module.scss";

import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import enter from "../../assets/list_icon.svg";

const TeamsPage: FC = () => {
  const navigate = useNavigate();
  const [showModal, toggleModal] = useState<boolean>(false);

  var num_people = 0;

  const handleToggleModal = () => {
    toggleModal(!showModal);
  };

  return (
    <>
      <Modal isOpen={showModal} toggle={handleToggleModal} isCrossNeeded={true}>
        <div className={styles["modal-title"]}>Добавление команды</div>
        <div className={styles["modal-group"]}>
          <div>Название команды</div>
          <Input placeholder="Введите название команды"></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div>{num_people} участников</div>
          <Input placeholder="Введите ФИО участника"></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div className={styles["add-stack-button"]}>+ Добавить стек</div>
        </div>
        <Button>Сохранить</Button>
      </Modal>
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
          <Button className={styles.sidebar_btn_2} onClick={handleToggleModal}>
            Добавить команду
          </Button>
        </Sidebar>
        <div className={styles.main}>
          <div className={styles.cards}>
            <label className={styles.title}>Список команд</label>
            <label>Количество команд : 100</label>
            <TeamsCard></TeamsCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamsPage;
