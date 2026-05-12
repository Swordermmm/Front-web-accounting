import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./ProjectCard.module.scss";

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {}

export const ProjectCard: FC<ContainerProps> = ({
  className,
  id,
  children,
  ...props
}) => {
  return (
    <div className={classNames(styles.container, className)} {...props}>
      <div>{children}</div>
    </div>
  );
};
