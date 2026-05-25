import React from "react";
import styles from "./Sidebar.module.scss";
import type { HTMLAttributes, PropsWithChildren } from "react";

interface SidebarProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  isOpen: boolean;
  //   onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  children,
  //   onToggle,
}) => {
  return (
    <div className={`base-class ${isOpen ? styles.sidebar : styles.closed}`}>
      {/* <button onClick={onToggle}>Close</button> */}
      <nav>{children}</nav>
    </div>
  );
};
