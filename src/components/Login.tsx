import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { login } from "../apis/auth.api";
import { Button, Input } from "../components/UI";

import logo from "../assets/alpha-logo.png";
import styles from "./Auth.module.scss";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Некорректный email")
    .required("Данное поле не заполнено!"),
  password: Yup.string().required("Данное поле не заполнено!"),
});

const Login: FC = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>("");
  const [sso, setSSO] = useState<boolean>(false);
  const [showEmail, setShowEmail] = useState<boolean>(true);

  const handleLogin = async (formValue: {
    email: string;
    password: string;
  }) => {
    const { email, password } = formValue;
    console.log(email, password);
    setMessage("");

    try {
      const response = await login(email, password);

      if (response.ok) {
        navigate("/projects");
      } else {
        const errorData = await response.json().catch(() => null);
        setMessage(errorData?.message || "Неверный логин или пароль");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Ошибка соединения с сервером");
    }
  };

  const handleSSOToggle = (
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const newSSOState = !sso;
    setSSO(newSSOState);

    if (newSSOState) {
      setFieldValue("email", "admin@email.com");
      setFieldValue("password", "gibberish");
      setShowEmail(false);
    } else {
      setFieldValue("email", "");
      setFieldValue("password", "");
      setShowEmail(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className="container login-container">
        <header>
          <img src={logo} alt="Site Logo" />
        </header>

        <div>
          <div className="card card-container">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
              }) => (
                <Form>
                  <div className={styles.title_container}>
                    <label className={styles.title}>Вход</label>
                    <>
                      <label>SSO</label>
                      <Button
                        onClick={() => handleSSOToggle(setFieldValue)}
                        className={
                          sso ? styles.sso_enabled : styles.sso_disabled
                        }
                      >
                        <div
                          className={
                            sso ? styles.switch_enabled : styles.switch_disabled
                          }
                        ></div>
                      </Button>
                    </>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Почта
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type={sso && !showEmail ? "password" : "text"}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.form_control} ${
                        errors.email && touched.email ? styles.input_error : ""
                      }`}
                      placeholder="Введите email"
                      disabled={sso}
                    />
                    {errors.email && touched.email && (
                      <div className={styles.error_message}>{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Пароль
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.form_control} ${
                        errors.password && touched.password
                          ? styles.input_error
                          : ""
                      }`}
                      placeholder="Введите пароль"
                      autoComplete="new-password"
                    />
                    {errors.password && touched.password && (
                      <div className={styles.error_message}>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <Button type="submit" className={styles.auth_btn}>
                      Войти
                    </Button>
                  </div>

                  {message && (
                    <div className="form-group">
                      <div role="alert">{message}</div>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
