import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Input, ComboBox } from "../../components/UI";
import { useDebounce } from "../../hooks";
import styles from "./MeetingDetailPage.module.scss";
import { useState, useMemo } from "react";
import type { Team, MeetingForm } from "../CalendarPage/CalendarPage";

interface MeetingDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  team: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    title: string;
  };
}

const fetchTeams = async () => {
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/student/team/list",
    {
      method: "POST",
      body: JSON.stringify({
        limit: 100,
        offset: 0,
        search: null,
        projectId: null,
        filter: 1,
      }),
      credentials: "include",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Ошибка загрузки команд");
  return response.json();
};

const MeetingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: teamsData, isLoading: isTeamsLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  const teams: Team[] = teamsData?.items || [];

  const [teamQuery, setTeamQuery] = useState<string>("");

  const debouncedTeamQuery = useDebounce(teamQuery, 300);

  const filteredTeams = useMemo(() => {
    if (!teamQuery) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(debouncedTeamQuery.toLowerCase()),
    );
  }, [teams, debouncedTeamQuery]);

  const updateMeetingField = <K extends keyof MeetingForm>(
    field: K,
    value: MeetingForm[K],
  ) => {
    setMeeting((prev) => ({ ...prev, [field]: value }));
  };

  const handleTeamSelect = (team: Team | null) => {
    setSelectedTeam(team);
    if (team) {
      updateMeetingField("teamId", team.id);
    } else {
      updateMeetingField("teamId", "");
    }
  };

  const { data: meetingData, isLoading } = useQuery<MeetingDetail>({
    queryKey: ["meeting", id],
    queryFn: async () => {
      const response = await fetch(
        `https://galacat.xyz/alpha-api/api/meeting/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Ошибка загрузки встречи");
      return response.json();
    },
    enabled: !!id,
  });

  const meeting: any = meetingData;

  const originalTeam: Team = {
    id: meeting.teamId,
    projectId: meeting.projectId,
    name: meeting.teamName,
    skills: null,
  };

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(originalTeam);

  const cancelMeetingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `https://galacat.xyz/alpha-api/api/meeting/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Ошибка отмены встречи");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      alert("Встреча отменена!");
      navigate("/calendar");
    },
  });

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleClose = () => {
    navigate("/calendar");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}>Загрузка...</div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className={styles.error}>
        <p>Встреча не найдена</p>
        <Button onClick={handleClose} className={styles.backBtn}>
          Назад
        </Button>
      </div>
    );
  }

  return (
    <>
      {" "}
      <Modal isOpen={showModal} toggle={handleToggleModal} isCrossNeeded={true}>
        <div className={styles["modal-title"]}>Изменение встречи</div>
        <div>
          <div className={styles["modal-group"]}>
            <div>Название встречи</div>
            <Input
              placeholder="Введите название встречи"
              className={styles.add_input}
              //   onChange={(e) => handleTitleChange(e.target.value)}
              value={meeting.title}
            />
          </div>

          <div
            className={`${styles[`modal-group`]} ${styles[`modal-group-combobox`]}`}
          >
            <div>Выбрать команду</div>
            <ComboBox
              value={selectedTeam}
              onChange={handleTeamSelect}
              options={filteredTeams}
              onQueryChange={setTeamQuery}
              displayValue={(team) => team?.name || ""}
              isLoading={isTeamsLoading}
              placeholder="Введите название команды"
              className={styles.add_input}
            />
          </div>

          <div className={styles["modal-group"]}>
            <div>Выбрать место встречи</div>
            <Input
              placeholder="Введите место встречи"
              className={styles.add_input}
              //   onChange={(e) => handlePlaceChange(e.target.value)}
              value={meeting.location}
            />
          </div>
          <div className={styles["modal-group"]}>
            <div>Описание</div>
            <Input
              placeholder="Введите описание встречи"
              className={styles.add_input}
              //   onChange={(e) => handleDescChange(e.target.value)}
              value={meeting.description}
            />
          </div>
          <div className={styles.modal_columns}>
            <div className={styles.modal_column}>
              <div className={styles["modal-group"]}>
                <div>Начальная дата</div>
                <Input
                  placeholder="01.01.2026"
                  className={styles.add_input}
                  type="date"
                  disabled
                />
              </div>
            </div>
            <div className={styles.modal_column}>
              <div className={styles["modal-group"]}>
                <div>Начало встречи</div>
                <Input
                  placeholder="00 : 00"
                  className={styles.add_input}
                  type="time"
                  //   onChange={(e) => handleStartChange(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button
            //   onClick={handlePostMeeting}
            className={styles.save_btn}
            //   disabled={createMeetingMutation.isPending}
          >
            Сохранить изменения
          </Button>
        </div>
      </Modal>
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>

          <div className={styles.header}>
            <h1 className={styles.title}>
              {meeting.projectTitle} : {meeting.title}
            </h1>
            <div className={styles.subtitle}>Команда : {meeting.teamName}</div>
          </div>

          <div className={styles.content}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Место встречи</th>
                  <th className={styles.th}>Время начала встречи</th>
                  <th className={styles.th}>Время конца встречи</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.td}>{meeting.location}</td>
                  <td className={styles.td}>{formatTime(meeting.startAt)}</td>
                  <td className={styles.td}>{formatTime(meeting.endAt)}</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.buttons}>
              <Button
                className={styles.redBtn}
                onClick={() => cancelMeetingMutation.mutate()}
                disabled={cancelMeetingMutation.isPending}
              >
                {cancelMeetingMutation.isPending
                  ? "Отмена..."
                  : "Отменить встречу"}
              </Button>
              <Button className={styles.redBtn} onClick={handleToggleModal}>
                Изменить встречу
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeetingDetailPage;
