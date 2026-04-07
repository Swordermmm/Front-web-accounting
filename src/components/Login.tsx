import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";

import { Button } from "./UI/Button";
import { Input } from "./UI/Input";

import styles from "./Auth.module.scss";
import logo from "../assets/alpha-logo.png";

type Props = {};

const Login: FC<Props> = () => {
  let navigate: NavigateFunction = useNavigate();

  const [message, setMessage] = useState<string>("");

  const initialValues: {
    email: string;
    password: string;
  } = {
    email: "",
    password: "",
  };

  return (
    <div className={styles.wrapper}>
      <div className="container login-container">
        <header>
          <img src={logo} alt="Site Logo" />
        </header>
        <div className="col-md-12">
          <div className="card card-container">
            <label className={styles.title}>Вход</label>
            <form>
              <div className="form-group">
                <label className={styles.secondary_title} htmlFor="email">
                  Почта
                </label>
                <Input
                  name="email"
                  type="text"
                  className=""
                  placeholder="Введите почту"
                />
              </div>

              <div className="form-group">
                <label className={styles.secondary_title} htmlFor="password">
                  Пароль
                </label>
                <Input
                  name="password"
                  type="password"
                  className=""
                  placeholder="Введите пароль"
                />
              </div>

              <div className="form-group">
                <Button type="submit" className={styles.auth_btn}>
                  Войти
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
