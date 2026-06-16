import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./DiscussionCard.module.scss";
import { useNavigate } from "react-router-dom";

import up from "../../../assets/thumbs_up.svg";
import down from "../../../assets/thumbs_down.svg";

import { Button } from "../Button";

function getStatus(number: number) {
  switch (number) {
    case 1:
      return "Активное";
    case 2:
      return "Отклоненное";
    case 3:
      return "Архивное";
    case 4:
      return "Завершенное";
  }
}

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  like: number;
  dislike: number;
  status: number;
  title: string;
  author: string;
  showReactions: boolean;
}

export const DiscussionCard: FC<ContainerProps> = ({
  className,
  id,
  like,
  dislike,
  status,
  title,
  author,
  showReactions,
  ...props
}) => {
  const navigate = useNavigate();

  const handleMeetingClick = (ideaId: string | undefined) => {
    if (!ideaId) return alert("Обсуждение не найдено!");
    navigate(`/idea/${ideaId}`);
  };

  const updateStatusProject = async (ideaId: string | undefined) => {
    const response = await fetch(
      `https://galacat.xyz/alpha-api/api/project/${ideaId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: 1,
        }),
        credentials: "include",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) throw new Error("Ошибка обновления");
    alert("Идея принята!");
    window.location.reload();
  };

  return (
    <div className={classNames(className)} {...props}>
      <label>{author}</label>
      <div className={styles.discussion_card}>
        <div>
          Статус {getStatus(status)} <br />
          {title}
        </div>
        <div className={styles.reaction_container}>
          <label>Реакции</label>
          <div className={`${showReactions ? styles.reaction : styles.hidden}`}>
            {like}
            <img
              className={`${showReactions ? styles.reaction_img : styles.hidden}`}
              src={up}
              alt="List icon"
            />
          </div>
          <div className={`${showReactions ? styles.reaction : styles.hidden}`}>
            {dislike}
            <img
              className={`${showReactions ? styles.reaction_img : styles.hidden}`}
              src={down}
              alt="List icon"
            />
          </div>
          <Button
            className={styles.comment_btn}
            onClick={() => handleMeetingClick(id)}
          >
            Добавить комментарий
          </Button>
          <Button
            className={styles.comment_btn}
            onClick={() => updateStatusProject(id)}
          >
            Принять идею
          </Button>
        </div>
      </div>
    </div>
  );
};
