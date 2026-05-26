import classNames from "classnames";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./TeamsCard.module.scss";

import type { Student } from "../../../pages/StudentsPage/StudentsPage";

// import { Button } from "../Button";

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  projectTitle: string;
  name: string;
  skills: string;
  members: Student[];
}

export const TeamsCard: FC<ContainerProps> = ({
  className,
  id,
  name,
  skills,
  projectTitle,
  members,
  ...props
}) => {
  return (
    <div className={classNames(styles.container, className)} {...props}>
      <div className={styles.team_card}>
        <div>
          <label className={styles.team_name}>Название команды : {name}</label>
          <label className={styles.team_skills}>Стэк : {skills}</label>
          <label className={styles.team_skills}>Список участников : </label>
          {members.map((student: Student, id) => (
            <>
              <label className={styles.team_member}>
                {id + 1}. {student.fullName}
              </label>
              <label className={styles.team_role}>{student.roleInTeam}</label>
            </>
          ))}
          <label className={styles.team_projectTitle}>
            Проект : {projectTitle}
          </label>
        </div>
      </div>
    </div>
  );
};
