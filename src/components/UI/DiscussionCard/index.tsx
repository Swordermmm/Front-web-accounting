import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./DiscussionCard.module.scss";

import up from "../../../assets/thumbs_up.svg";
import down from "../../../assets/thumbs_down.svg";

import { Button } from "../Button";

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

// временно
const name = "???";
const text = "Текст идеи";

export const DiscussionCard: FC<ContainerProps> = ({
  className,
  id,
  ...props
}) => {
  return (
    <div className={classNames(styles.container, className)} {...props}>
      <label>ФИО</label>
      <div className={styles.discussion_card}>
        <div>
          Статус {name} <br />
          {text}
        </div>
        <div className={styles.reaction_container}>
          <label>Реакции</label>
          <div className={styles.reaction}>
            235
            <img src={up} alt="List icon" />
          </div>
          <div className={styles.reaction}>
            267
            <img src={down} alt="List icon" />
          </div>
          <Button className={styles.comment_btn}>Добавить комментарий</Button>
        </div>
      </div>
    </div>
  );
};
