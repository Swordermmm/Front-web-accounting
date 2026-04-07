import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./ProjectCard.module.scss";

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

// временно
const name = "???";
const number = 0;

export const ProjectCard: FC<ContainerProps> = ({
  className,
  id,
  ...props
}) => {
  return (
    <div className={classNames(styles.container, className)} {...props}>
      <div>
        Название проекта: {name} <br />
        Количество команд: {number}
      </div>
    </div>
  );
};
