import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { login } from "../apis/auth.api";
import { Button } from "../components/UI";

import logo from "../assets/alpha-logo.png";
import styles from "./Auth.module.scss";

type Props = {};

const Login: FC<Props> = () => {
  let navigate: NavigateFunction = useNavigate();

  const [message, setMessage] = useState<string>("");
  const [sso, setSSO] = useState<boolean>(false);

  const initialValues: {
    email: string;
    password: string;
  } = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Данное поле не заполнено!"),
    password: Yup.string().required("Данное поле не заполнено!"),
  });

  const handleLogin = (formValue: { email: string; password: string }) => {
    const { email, password } = formValue;

    setMessage("");

    login(email, password)
      .then((res) => {
        if (res.ok) navigate("/projects");
      })
      .catch();
  };

  const handleSSO = (sso: boolean) => {
    setSSO(!sso);
  };

  return (
    <div className={styles.wrapper}>
      <div className="container login-container">
        <header>
          <img src={logo} alt="Site Logo" />
        </header>
        <div className="col-md-12">
          <div className="card card-container">
            <div className={styles.title_container}>
              {" "}
              <label className={styles.title}>Вход</label>
              <>
                <label>SSO</label>
                <Button
                  onClick={() => handleSSO(sso)}
                  className={sso ? styles.sso_enabled : styles.sso_disabled}
                >
                  <div
                    className={
                      sso ? styles.switch_enabled : styles.switch_disabled
                    }
                  ></div>
                </Button>
              </>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              <Form>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Почта
                  </label>
                  <Field
                    name="email"
                    type="text"
                    className={styles.form_control}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <Field
                    name="password"
                    type="password"
                    // value={sso ? `admin123` : ``}
                    className={styles.form_control}
                    autocomplete="new-password"
                  />
                </div>

                <div className="form-group">
                  <Button type="submit" className={styles.auth_btn}>
                    Войти
                  </Button>
                </div>

                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
