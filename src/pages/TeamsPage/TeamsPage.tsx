import type { FC } from "react";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useDebounce } from "../../hooks";
import {
  Button,
  Sidebar,
  TeamsCard,
  Modal,
  Input,
  ComboBox,
} from "../../components/UI";
import type { Student } from "../StudentsPage/StudentsPage";
import type { Curator } from "../CuratorPage/CuratorPage";
import { useNavigate } from "react-router-dom";

import styles from "./TeamsPage.module.scss";

import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teamsIcon from "../../assets/teams_icon.svg";
import enter from "../../assets/enter.svg";

interface TeamStudent extends Student {
  type?: "new" | "old";
}

export interface Team {
  name: string;
  projectId: string;
  studentProfileIds: string[];
  skills: string;
  curatorId: string;
}

const fetchTeams = async (body: any) => {
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/student/team/list",
    {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers: { accept: "*/*", "Content-Type": "application/json" },
    },
  );
  if (!response.ok) throw new Error("Ошибка загрузки команд");
  return response.json();
};

const fetchCurators = async (body: any) => {
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/student/curator/list",
    {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers: { accept: "*/*", "Content-Type": "application/json" },
    },
  );

  if (!response.ok) throw new Error("Ошибка загрузки команд");
  return response.json();
};

const fetchProjects = async () => {
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/project/list",
    {
      method: "POST",
      body: JSON.stringify({
        limit: 100,
        offset: 0,
        search: null,
        statuses: [1],
      }),
      credentials: "include",
      headers: { accept: "*/*", "Content-Type": "application/json" },
    },
  );
  if (!response.ok) throw new Error("Ошибка загрузки проектов");
  return response.json();
};

const fetchStudentsByName = async (name: string) => {
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/student/list",
    {
      method: "POST",
      body: JSON.stringify({ limit: 100, offset: 0, search: name, filter: 1 }),
      credentials: "include",
      headers: { accept: "*/*", "Content-Type": "application/json" },
    },
  );
  if (!response.ok) throw new Error("Ошибка поиска студентов");
  return response.json();
};

const createStudent = async (student: TeamStudent) => {
  const response = await fetch("https://galacat.xyz/alpha-api/api/student", {
    method: "POST",
    body: JSON.stringify(student),
    credentials: "include",
    headers: { accept: "*/*", "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Ошибка создания студента");
  return response.json();
};

const createTeam = async (team: Team) => {
  console.log(team);
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/student/team",
    {
      method: "POST",
      body: JSON.stringify(team),
      credentials: "include",
      headers: { accept: "*/*", "Content-Type": "application/json" },
    },
  );
  if (!response.ok) throw new Error("Ошибка создания команды");
  return response.json();
};

const TeamsPage: FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // UI States
  const [showModal, toggleModal] = useState<boolean>(false);
  const [showSidebar, toggleSidebar] = useState<boolean>(true);
  const [searchName, setSearchName] = useState<string>("");
  const [studentToggle, setToggle] = useState<boolean>(true);

  // Form States
  const [team, setTeam] = useState<Team>({
    name: "",
    projectId: "",
    studentProfileIds: [],
    skills: "",
    curatorId: "",
  });

  const baseplate: TeamStudent = { fullName: "", email: "", roleInTeam: "" };
  const [student, setStudent] = useState<TeamStudent>(baseplate);
  const [studentsInTeam, setStudents] = useState<TeamStudent[]>([]);

  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [curatorQuery, setCuratorQuery] = useState("");
  const [selectedCurator, setSelectedCurator] = useState<Curator | null>(null);

  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [projectQuery, setProjectQuery] = useState<string>("");

  const debouncedProjectQuery = useDebounce(projectQuery, 500);
  const debouncedQuery = useDebounce(curatorQuery, 500);
  const debouncedCuratorQuery = useDebounce(studentQuery, 500);

  const { data: studentsData, isPending: isStudentsLoading } = useQuery({
    queryKey: ["students-search", debouncedQuery],
    queryFn: () => fetchStudentsByName(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    placeholderData: (previousData) => previousData,
  });

  const studentsOptions = studentsData?.items || [];

  const body = {
    limit: 6,
    offset: 0,
    search: null,
    projectId: null,
    filter: 1,
  };

  const { data: teamsData, isPending: isTeamsPending } = useQuery({
    queryKey: ["teams", body],
    queryFn: () => fetchTeams(body),
  });

  const { data: projectsData, isPending: isProjectLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: curatorsData, isPending: isCuratorsLoading } = useQuery({
    queryKey: ["curators"],
    queryFn: fetchCurators,
  });

  const teams = teamsData?.items || [];
  const projects = projectsData?.items || [];
  const curators = curatorsData?.items || [];

  const filteredCurators = useMemo(() => {
    if (!debouncedCuratorQuery) return curators;
    return curators.filter((curator: any) =>
      curator.fullName
        .toLowerCase()
        .includes(debouncedProjectQuery.toLowerCase()),
    );
  }, [curators, debouncedCuratorQuery]);

  const filteredProjects = useMemo(() => {
    if (!debouncedProjectQuery) return projects;
    return projects.filter((project: any) =>
      project.title.toLowerCase().includes(debouncedProjectQuery.toLowerCase()),
    );
  }, [projects, debouncedProjectQuery]);

  const createTeamMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      handleToggleModal();
      setTeam({
        name: "",
        projectId: "",
        studentProfileIds: [],
        skills: "",
        curatorId: "",
      });
      setStudents([]);
      setStudent(baseplate);
    },
    onError: (error) => {
      console.error("Failed to create team:", error);
      alert("Ошибка при создании команды");
    },
  });

  const handleToggleModal = () => {
    toggleModal(!showModal);
    toggleSidebar(!showSidebar);
  };

  const filteredTeams = useMemo(() => {
    if (!searchName) return teams;
    return teams.filter((team: any) =>
      team.name.toLowerCase().includes(searchName.toLowerCase()),
    );
  }, [teams, searchName]);

  const handleTeamNameChange = (value: string) =>
    setTeam((prev) => ({ ...prev, name: value }));

  const handleProjectChange = (project: any | null) => {
    setSelectedProject(project);
    if (project) {
      setTeam((prev) => ({ ...prev, projectId: project.id }));
    } else {
      setTeam((prev) => ({ ...prev, projectId: "" }));
    }
  };

  const handleCuratorChange = (curator: any | null) => {
    setSelectedCurator(curator);
    if (curator) {
      setTeam((prev) => ({ ...prev, curatorId: curator.id }));
    } else {
      setTeam((prev) => ({ ...prev, curator: "" }));
    }
  };

  const handleSkillsChange = (value: string) =>
    setTeam((prev) => ({ ...prev, skills: value }));

  const handleToggle = () => setToggle(!studentToggle);

  const handleStudentName = (value: string) =>
    setStudent((prev) => ({ ...prev, fullName: value }));

  const handleStudentEmail = (value: string) =>
    setStudent((prev) => ({ ...prev, email: value }));

  const handleStudentRole = (value: string) =>
    setStudent((prev) => ({ ...prev, roleInTeam: value }));

  const handleMemberChange = () => {
    const studentType = studentToggle ? "new" : "old";
    const newStudent: TeamStudent = {
      type: studentType,
      fullName: student.fullName,
      roleInTeam: student.roleInTeam,
      email: student.email,
    };

    setStudents((prev) => [...prev, newStudent]);
    setStudent(baseplate);
    setSelectedStudent(null);
  };

  const handleAddSelectedStudent = () => {
    if (!selectedStudent) return;

    const newMember: TeamStudent = {
      type: "old",
      fullName: selectedStudent.fullName,
      roleInTeam: student.roleInTeam,
      email: selectedStudent.email,
      id: selectedStudent.id,
    };

    handleStudentEmail("");
    setStudents((prev) => [...prev, newMember]);
    setSelectedStudent(null);
    setStudentQuery("");

    setSelectedProject(null);
    setProjectQuery("");
    setCuratorQuery("");
  };

  const handleCreateTeam = async () => {
    try {
      const studentIds: string[] = [];

      for (const stud of studentsInTeam) {
        if (stud.type === "new") {
          const res = await createStudent(stud);
          if (res?.id) studentIds.push(res.id);
        } else {
          const res = await fetchStudentsByName(stud.fullName);
          const foundStudent = res.items?.find(
            (std: any) => std.fullName === stud.fullName,
          );
          if (foundStudent?.id) studentIds.push(foundStudent.id);
        }
      }

      const finalTeam: Team = {
        ...team,
        studentProfileIds: studentIds,
      };

      createTeamMutation.mutate(finalTeam);
    } catch (error) {
      console.error("Error processing students:", error);
    }
  };

  return (
    <>
      <Modal isOpen={showModal} toggle={handleToggleModal} isCrossNeeded={true}>
        <div className={styles["modal-title"]}>Добавление команды</div>

        <div className={styles["modal-group"]}>
          <div>Название команды</div>
          <Input
            placeholder="Введите название команды"
            className={styles.add_input}
            onChange={(e) => handleTeamNameChange(e.target.value)}
          />
        </div>

        <div className={styles["modal-group"]}>
          <div>Добавление проекта</div>
          <ComboBox
            value={selectedProject}
            onChange={handleProjectChange}
            options={filteredProjects}
            onQueryChange={setCuratorQuery}
            displayValue={(project) => project?.title || ""}
            isLoading={isProjectLoading}
            placeholder="Введите название проекта"
            className={styles.add_input}
          />
        </div>
        <div className={styles["modal-group"]}>
          <div>Добавление куратора</div>
          <ComboBox
            value={selectedCurator}
            onChange={handleCuratorChange}
            options={filteredCurators}
            onQueryChange={setCuratorQuery}
            displayValue={(curator) => curator?.fullName || ""}
            isLoading={isCuratorsLoading}
            placeholder="Введите ФИО куратора"
            className={styles.add_input}
          />
          <div className={styles["modal-group"]}></div>
          <div>Добавить стек</div>
          <Input
            placeholder="Введите стек"
            className={styles.add_input}
            onChange={(e) => handleSkillsChange(e.target.value)}
          />
        </div>

        <Button className={styles.btn_toggle} onClick={handleToggle}>
          {studentToggle
            ? `Создание нового студента`
            : `Добавление существующего студента`}
        </Button>

        <div className={styles["modal-group"]}>
          <div>{studentsInTeam.length} участников</div>
          {studentToggle ? (
            <div className={styles["flex-group"]}>
              <Input
                placeholder="Введите ФИО студента"
                className={styles.add_input}
                onChange={(e) => handleStudentName(e.target.value)}
                value={student.fullName}
              />
              <Input
                placeholder="Введите почту студента"
                className={styles.add_input}
                onChange={(e) => handleStudentEmail(e.target.value)}
                value={student.email}
              />
              <Button
                onClick={handleMemberChange}
                className={styles.btn_create}
              >
                <img src={enter} alt="add" />
              </Button>
            </div>
          ) : (
            <div className={styles["flex-group"]}>
              <ComboBox
                value={selectedStudent}
                onChange={setSelectedStudent}
                options={studentsOptions}
                onQueryChange={setStudentQuery}
                displayValue={(student) => student?.fullName || ""}
                isLoading={isStudentsLoading}
                placeholder="Введите ФИО студента"
                className={styles.add_input}
              />
              <Button
                onClick={handleAddSelectedStudent}
                className={styles.btn_create}
                disabled={!selectedStudent}
              >
                <img src={enter} alt="add" />
              </Button>
            </div>
          )}
        </div>

        <div className={styles["modal-group"]}>
          <div>Роль участника</div>
          <Input
            placeholder="Введите роль"
            className={styles.add_input}
            onChange={(e) => handleStudentRole(e.target.value)}
            value={student.roleInTeam}
          />
        </div>

        <Button
          onClick={handleCreateTeam}
          disabled={createTeamMutation.isPending}
        >
          {createTeamMutation.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </Modal>

      <div className={styles.wrapper}>
        <Sidebar isOpen={showSidebar}>
          <div className={styles.sidebar_nav}>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/discussion"
            >
              <img src={chat} alt="Chat icon" /> Обсуждения
            </Button>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/students"
            >
              <img src={students} alt="Students icon" /> Студенты
            </Button>
            <Button
              variant="secondary"
              className={`${styles.sidebar_btn} ${styles.marked}`}
              to="/teams"
            >
              <img src={teamsIcon} alt="Teams icon" /> Команды
            </Button>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/curators"
            >
              <img src={search} alt="Search icon" /> Кураторы
            </Button>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/calendar"
            >
              <img src={calendar} alt="Calendar icon" /> Календарь
            </Button>
            <Button
              variant="secondary"
              className={styles.sidebar_btn}
              to="/projects"
            >
              <img src={list} alt="list icon" /> Кейсы
            </Button>
          </div>
        </Sidebar>

        <div className={styles.main}>
          <div className={styles.cards}>
            <div className={styles.teams_title}>
              <label className={styles.projects_title}>Поиск</label>
              <div className={styles.search}>
                <Input
                  type="text"
                  className={styles.searchBar}
                  placeholder="Введите название команды"
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <Button
                  className={styles.sidebar_btn_2}
                  onClick={handleToggleModal}
                >
                  Добавить команду
                </Button>
              </div>
            </div>

            <div className={styles.cards_container}>
              {isTeamsPending ? (
                <div>Загрузка команд...</div>
              ) : (
                filteredTeams.map((team: any) => (
                  <div
                    key={team.id || team.name}
                    onClick={() => navigate(`/team/${team.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <TeamsCard
                      projectTitle={team.projectTitle}
                      name={team.name}
                      skills={team.skills}
                      members={team.members}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamsPage;
