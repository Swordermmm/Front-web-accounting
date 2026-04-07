import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./TeamsCard.module.scss";

import { Button } from "../Button";

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

// временно
const name = "???";
const number = "4";
const team_members = "Тимлид, Программист , Аналитик";

export const TeamsCard: FC<ContainerProps> = ({ className, id, ...props }) => {
  return (
    <div className={classNames(styles.container, className)} {...props}>
      <div className={styles.team_card}>
        <div>
          Название команды {name} <br />
          Количество участников : {number}
        </div>
        <label>Состав команды : {team_members}</label>
      </div>
    </div>
  );
};
