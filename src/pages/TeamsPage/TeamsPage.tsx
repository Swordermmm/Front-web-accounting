import type { FC } from "react";
import { useState } from "react";

import { Button, Sidebar, TeamsCard, Modal, Input } from "../../components/UI";

import styles from "./TeamsPage.module.scss";

import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teams from "../../assets/teams_icon.svg";

const TeamsPage: FC = () => {
  const [showModal, toggleModal] = useState<boolean>(false);

  var num_people = 0;
  var num_teams = 100;

  const handleToggleModal = () => {
    toggleModal(!showModal);
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
          ></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div>Добавление куратора</div>
          <Input
            placeholder="Введите ФИО куратора"
            className={styles.add_input}
          ></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div>Добавить стек</div>
          <Input
            placeholder="Введите стек"
            className={styles.add_input}
          ></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div>{num_people} участников</div>
          <Input
            placeholder="Введите ФИО участника"
            className={styles.add_input}
          ></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div>Группа</div>
          <Input
            placeholder="Введите группу"
            className={styles.add_input}
          ></Input>
        </div>
        <div className={styles["modal-group"]}>
          <div>Роль участника</div>
          <Input
            placeholder="Введите группу"
            className={styles.add_input}
          ></Input>
        </div>
        <Button>Сохранить</Button>
      </Modal>
      <div className={styles.wrapper}>
        <Sidebar isOpen={true}>
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
          <div className={styles.cards}>
            <div className={styles.teams_title}>
              <label className={styles.title}>Список команд</label>{" "}
              <Button
                className={styles.sidebar_btn_2}
                onClick={handleToggleModal}
              >
                Добавить команду
              </Button>
            </div>

            <label>Количество команд : {num_teams}</label>
            <TeamsCard></TeamsCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamsPage;
