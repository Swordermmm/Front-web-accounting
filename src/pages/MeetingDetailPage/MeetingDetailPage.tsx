import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Input, ComboBox } from "../../components/UI";
import { useDebounce } from "../../hooks";
import styles from "./MeetingDetailPage.module.scss";
import { useState, useMemo, useEffect } from "react";
import type { Team, MeetingForm } from "../CalendarPage/CalendarPage";

interface MeetingDetail {
  id: string;
  teamId: string;
  teamName: string;
  projectId: string;
  projectTitle: string;
  recurrenceSeriesId?: string | null;
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
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

const updateMeeting = async (meeting: MeetingDetail) => {
  const response = await fetch(
    `https://galacat.xyz/alpha-api/api/meeting/${meeting.id}`,
    {
      method: "PUT",
      body: JSON.stringify(meeting),
      credentials: "include",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Неизвестная ошибка");
    throw new Error(errorText || "Ошибка обновления встречи");
  }
  return response.json;
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

  const handleTitleChange = (value: string) =>
    updateMeetingField("title", value);

  const handleDescChange = (value: string) =>
    updateMeetingField("description", value);

  const handlePlaceChange = (value: string) =>
    updateMeetingField("location", value);

  const handleStartChange = (value: string) => {
    const date = new Date(
      value + meeting.startAt.slice(10, meeting.startAt.length),
    );

    const enddate = new Date(date.getTime() + 3600000);
    updateMeetingField("startAt", date.toISOString());
    updateMeetingField("endAt", enddate.toISOString());
  };

  const handleStartTimeChange = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date(meeting.startAt);
    date.setHours(hours, minutes, 0, 0);

    const enddate = new Date(date.getTime() + 3600000);
    updateMeetingField("startAt", date.toISOString());
    updateMeetingField("endAt", enddate.toISOString());
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

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (meetingData) {
      setMeeting(meetingData);
      setSelectedTeam({
        id: meetingData.teamId,
        projectId: meetingData.projectId,
        name: meetingData.teamName,
        skills: null,
      });
    }
  }, [meetingData]);

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

  const updateMeetingMutation = useMutation({
    mutationFn: updateMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting", id] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });

      setShowModal(false);
      alert("Встреча успешно обновлена!");
    },
    onError: (error: Error) => {
      console.error("Failed to update meeting:", error);
      alert(`Ошибка при обновлении встречи: ${error.message}`);
    },
  });

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handlePostChanges = () => {
    if (!meeting) return;

    // if (!meeting.title.trim()) {
    //   alert("Введите название встречи");
    //   return;
    // }
    // if (!meeting.teamId) {
    //   alert("Выберите команду");
    //   return;
    // }
    // if (!meeting.location.trim()) {
    //   alert("Введите место встречи");
    //   return;
    // }
    updateMeetingField("startAt", meeting.startAt.slice(0, -1));
    updateMeetingField("endAt", meeting.endAt.slice(0, -1));
    updateMeetingMutation.mutate(meeting);
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
              onChange={(e) => handleTitleChange(e.target.value)}
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
              onChange={(e) => handlePlaceChange(e.target.value)}
              value={meeting.location}
            />
          </div>
          <div className={styles["modal-group"]}>
            <div>Описание</div>
            <Input
              placeholder="Введите описание встречи"
              className={styles.add_input}
              onChange={(e) => handleDescChange(e.target.value)}
              value={meeting.description}
            />
          </div>
          <div className={styles.modal_columns}>
            <div className={styles.modal_column}>
              <div className={styles["modal-group"]}>
                <div>Начальная дата</div>
                <Input
                  value={meeting.startAt.slice(0, 10)}
                  className={styles.add_input}
                  onChange={(e) => handleStartChange(e.target.value)}
                  type="date"
                />
              </div>
            </div>
            <div className={styles.modal_column}>
              <div className={styles["modal-group"]}>
                <div>Начало встречи</div>
                <Input
                  value={new Date(meeting.startAt).toTimeString().slice(0, 5)}
                  className={styles.add_input}
                  type="time"
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handlePostChanges}
            className={styles.save_btn}
            disabled={updateMeetingMutation.isPending}
          >
            {updateMeetingMutation.isPending
              ? "Сохранение..."
              : "Сохранить изменения"}
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
