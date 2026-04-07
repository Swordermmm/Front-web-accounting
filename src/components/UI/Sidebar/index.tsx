import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import type { HTMLAttributes, PropsWithChildren } from "react";

import logo from "../../../assets/alpha-logo-grey.png";

interface SidebarProps
  extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  //   isOpen: boolean;
  //   onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  //   isOpen,
  children,
  //   onToggle,
}) => {
  return (
    <div className={styles.sidebar}>
      <img src={logo} alt="Site Logo" className={styles.logo} />
      {/* <button onClick={onToggle}>Close</button> */}
      <nav>{children}</nav>
    </div>
  );
};
