import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "../../components/UI";
import styles from "./TeamDetailPage.module.scss";

interface TeamMember {
  id: string;
  studentProfileId: string;
  fullName: string;
  email: string;
  roleInTeam: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  goal: string | null;
  mvp: string | null;
  evaluationCriteria: string | null;
  deadline: string | null;
  status: number;
  teamsCount: number;
}

interface Iteration {
  id: string;
  name: string;
  startOn: string;
  endOn: string;
}

interface TeamDetail {
  id: string;
  projectId: string;
  name: string;
  skills: string | null;
  createdAt: string;
  updatedAt: string | null;
  project: Project;
  members: TeamMember[];
  iterations: Iteration[];
}

const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedIteration, setSelectedIteration] = useState<string>("");
  const [evaluations, setEvaluations] = useState<
    Record<string, { score: string; comment: string }>
  >({});
  const [isEditingCriteria, setIsEditingCriteria] = useState<boolean>(false);
  const [criteriaText, setCriteriaText] = useState<string>(
    "Уважаемые студенты !\nОценка итерации выставляется спустя 3 дня после завершения .........\nИтоговая оценка округляется в большую сторону......",
  );

  const {
    data: team,
    isLoading,
    error,
  } = useQuery<TeamDetail>({
    queryKey: ["team", id],
    queryFn: async () => {
      const response = await fetch(
        `https://galacat.xyz/alpha-api/api/student/team/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Ошибка загрузки команды");
      return response.json();
    },
    enabled: !!id,
  });

  const completeProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `https://galacat.xyz/alpha-api/api/project/${team?.projectId}/complete`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Ошибка завершения проекта");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", id] });
      alert("Проект завершен!");
    },
  });

  const handleEvaluationChange = (
    studentId: string,
    field: "score" | "comment",
    value: string,
  ) => {
    setEvaluations((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleCriteriaSave = () => {
    setIsEditingCriteria(false);
  };

  const handleSaveEvaluations = async () => {
    try {
      const evaluationsToSave = Object.entries(evaluations).map(
        ([studentId, data]) => ({
          studentId,
          score: parseInt(data.score) || 0,
          comment: data.comment,
        }),
      );

      const response = await fetch(
        `https://galacat.xyz/alpha-api/api/team/${id}/evaluations`,
        {
          method: "POST",
          body: JSON.stringify({ evaluations: evaluationsToSave }),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Ошибка сохранения оценок");
      alert("Оценки сохранены!");
    } catch (error) {
      console.error("Error saving evaluations:", error);
      alert("Ошибка при сохранении оценок");
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !team) {
    return (
      <div className={styles.error}>
        <p>Команда не найдена</p>
        <button className={styles.redBtn} onClick={() => navigate("/teams")}>
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.back_btn}>
        <Button className={styles.redBtn} onClick={() => navigate("/teams")}>
          Назад к командам
        </Button>
      </div>

      <h1 className={styles.teamName}>{team.name}</h1>
      <div className={styles.stack}>
        Стек команды : {team.skills || "Не указан"}
      </div>

      {/* Участники команды + кнопка истории */}
      <div className={styles.membersSection}>
        <h2 className={styles.sectionLabel}>Участники команды</h2>
        <div className={styles.membersRow}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Имя</th>
                <th className={styles.th}>Роль в команде</th>
              </tr>
            </thead>
            <tbody>
              {team.members.map((member) => (
                <tr key={member.id} className={styles.tr}>
                  <td className={styles.td}>{member.fullName}</td>
                  <td className={styles.td}>{member.roleInTeam || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button className={styles.redBtn} onClick={() => {}}>
            Посмотреть историю
          </Button>
        </div>
      </div>

      <div className={styles.projectSection}>
        <h2 className={styles.projectTitle}>{team.project.title}</h2>
        <h3 className={styles.subTitle}>Список команд</h3>
        <div className={styles.teamsCount}>
          Количество команд : {team.project.teamsCount}
        </div>

        <div className={styles.projectAndBtn}>
          <div className={styles.projectInfo}>
            <h3 className={styles.subTitle}>Описание проекта</h3>
            <div className={styles.fields}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Цель проекта :</span>
                <span className={styles.fieldValue}>
                  {team.project.goal || "Empty"}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>MVP :</span>
                <span className={styles.fieldValue}>
                  {team.project.mvp || "Empty"}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Критерии оценки :</span>
                <span className={styles.fieldValue}>
                  {team.project.evaluationCriteria || "Empty"}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Сроки выполнения :</span>
                <span className={styles.fieldValue}>
                  {team.project.deadline
                    ? new Date(team.project.deadline).toLocaleDateString(
                        "ru-RU",
                      )
                    : "Empty"}
                </span>
              </div>
            </div>
          </div>
          <Button
            className={styles.redBtn}
            onClick={() => completeProjectMutation.mutate()}
            disabled={completeProjectMutation.isPending}
          >
            {completeProjectMutation.isPending
              ? "Завершение..."
              : "Завершить проект"}
          </Button>
        </div>
      </div>

      <div className={styles.iterationSection}>
        <div className={styles.iterationHeader}>
          <div className={styles.iterationFlex}>
            <h3 className={styles.subTitle}>Итерация</h3>
            <select
              className={styles.select}
              value={selectedIteration}
              onChange={(e) => setSelectedIteration(e.target.value)}
            >
              <option value="">Выберите итерацию</option>
              {team.iterations?.map((iteration) => (
                <option key={iteration.id} value={iteration.id}>
                  {iteration.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.iterationControls}>
            <Button className={styles.redBtn}>Добавить итерацию</Button>
            <Button className={styles.redBtn}>Изменить итерацию</Button>
          </div>
        </div>

        <div className={styles.criteriaRow}>
          <div>
            <h4 className={styles.criteriaTitle}>Критерии оценивания</h4>
            <div className={styles.criteriaFlex}>
              <textarea
                className={styles.criteriaTextarea}
                value={criteriaText}
                onChange={(e) => setCriteriaText(e.target.value)}
                rows={6}
              />
              <Button
                className={styles.redBtn}
                onClick={() => {
                  if (isEditingCriteria) {
                    handleCriteriaSave();
                  } else {
                    setIsEditingCriteria(true);
                  }
                }}
              >
                {isEditingCriteria ? "Сохранить текст" : "Изменить текст"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.evaluationSection}>
        <h3 className={styles.subTitle}>Участники команды</h3>
        <table className={styles.evaluationTable}>
          <thead>
            <tr>
              <th className={styles.th}>Имя</th>
              <th className={styles.th}>Роль в команде</th>
              <th className={styles.th}>Ваша оценка</th>
              <th className={styles.th}>Комментарии</th>
            </tr>
          </thead>
          <tbody>
            {team.members.map((member) => (
              <tr key={member.id} className={styles.tr}>
                <td className={styles.td}>{member.fullName}</td>
                <td className={styles.td}>{member.roleInTeam || "—"}</td>
                <td className={styles.td}>
                  <Input
                    type="number"
                    className={styles.scoreInput}
                    value={evaluations[member.id]?.score || ""}
                    onChange={(e) =>
                      handleEvaluationChange(member.id, "score", e.target.value)
                    }
                    min="0"
                    max="100"
                    placeholder="100"
                  />
                </td>
                <td className={styles.td}>
                  <Input
                    type="text"
                    className={styles.commentInput}
                    value={evaluations[member.id]?.comment || ""}
                    onChange={(e) =>
                      handleEvaluationChange(
                        member.id,
                        "comment",
                        e.target.value,
                      )
                    }
                    placeholder="Введите комментарий"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamDetailPage;
