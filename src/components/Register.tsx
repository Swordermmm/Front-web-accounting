import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { register } from "../apis/auth.api";
import { Button, Input } from "../components/UI";

import logo from "../assets/alpha-logo.png";
import styles from "./Auth.module.scss";

const initialValues = {
  email: "",
  fullName: "",
  password: "",
};

// ✅ Добавлена валидация для fullName
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Некорректный email")
    .required("Данное поле не заполнено!"),
  fullName: Yup.string().required("Данное поле не заполнено!"),
  password: Yup.string()
    .min(6, "Минимум 6 символов")
    .required("Данное поле не заполнено!"),
});

const Register: FC = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>("");

  const handleRegister = async (formValue: {
    email: string;
    fullName: string;
    password: string;
  }) => {
    const { email, fullName, password } = formValue;
    setMessage("");

    try {
      const response = await register(email, fullName, password);

      if (response.ok) {
        navigate("/projects");
      } else {
        const errorData = await response.json().catch(() => null);
        setMessage(errorData?.message || "Ошибка при регистрации");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Ошибка соединения с сервером");
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
              onSubmit={handleRegister}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  <div>
                    <label className={styles.title_register}>Регистрация</label>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Почта
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.form_control} ${
                        errors.email && touched.email ? styles.input_error : ""
                      }`}
                      placeholder="Введите email"
                    />
                    {errors.email && touched.email && (
                      <div className={styles.error_message}>{errors.email}</div>
                    )}
                  </div>

                  {/* ✅ ИСПРАВЛЕНО: правильные id, name и ошибки для fullName */}
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      ФИО
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${styles.form_control} ${
                        errors.fullName && touched.fullName
                          ? styles.input_error
                          : ""
                      }`}
                      placeholder="Введите ФИО"
                    />
                    {errors.fullName && touched.fullName && (
                      <div className={styles.error_message}>
                        {errors.fullName}
                      </div>
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
                    {/* ✅ Изменён текст кнопки */}
                    <Button type="submit" className={styles.auth_btn}>
                      Зарегистрироваться
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
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
