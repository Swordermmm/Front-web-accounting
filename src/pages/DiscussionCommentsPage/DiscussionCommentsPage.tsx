import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DiscussionCommentsPage.module.scss";
import { Button, Sidebar, DiscussionCard } from "../../components/UI";
import chat from "../../assets/chat_bubble.svg";
import calendar from "../../assets/calendar_icon.svg";
import list from "../../assets/list_icon.svg";
import search from "../../assets/search_icon.svg";
import students from "../../assets/students_icon.svg";
import teams from "../../assets/teams_icon.svg";
import dislike from "../../assets/thumbs_down.svg";
import like from "../../assets/thumbs_up.svg";
import reply from "../../assets/reply_icon.svg";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Типы

interface Discussion {
  id: string;
  likeReactionsCount: number;
  dislikeReactionsCount: number;
  authorFullName: string;
  status: number;
  title: string;
  description: string;
}

interface Comment {
  id: string;
  projectId: string;
  userId: string;
  authorFullName: string | null;
  parentCommentId: string | null;
  commentBody: string;
  createdAt: string;
  updatedAt: string | null;
  likeReactionsCount: number;
  dislikeReactionsCount: number;
  replies: Comment[];
}

interface CommentForm {
  commentBody: string;
  parentCommentId?: string | null;
}

// API функции

const fetchDiscussionById = async (discussionId: string) => {
  const response = await fetch(
    "https://galacat.xyz/alpha-api/api/discussion/list",
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

  if (!response.ok) throw new Error("Ошибка загрузки обсуждений");

  const data = await response.json();
  const discussion = data.items?.find(
    (item: Discussion) => item.id === discussionId,
  );

  if (!discussion) {
    throw new Error("Обсуждение не найдено");
  }

  return discussion;
};

const fetchComments = async (discussionId: string): Promise<Comment[]> => {
  const response = await fetch(
    `https://galacat.xyz/alpha-api/api/discussion/${discussionId}/comments`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Ошибка загрузки комментариев");

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    return data.items || [];
  }
  return [];
};

const createComment = async ({
  discussionId,
  comment,
}: {
  discussionId: string;
  comment: CommentForm;
}) => {
  const response = await fetch(
    `https://galacat.xyz/alpha-api/api/discussion/${discussionId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({
        commentBody: comment.commentBody,
        parentCommentId: comment.parentCommentId || undefined,
      }),
      credentials: "include",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Неизвестная ошибка");
    throw new Error(errorText || "Ошибка создания комментария");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
};

function DiscussionCommentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState<string>("");
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);

  const { data: discussion, isLoading: isDiscussionLoading } =
    useQuery<Discussion | null>({
      queryKey: ["discussion", id],
      queryFn: () => fetchDiscussionById(id!),
      enabled: !!id,
    });

  const { data: comments = [], isLoading: isCommentsLoading } = useQuery<
    Comment[]
  >({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id!),
    enabled: !!id,
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setCommentText("");
      setReplyToComment(null);
      alert("Комментарий добавлен!");
    },
    onError: (error: Error) => {
      console.error("Failed to create comment:", error);
      alert(`Ошибка при добавлении комментария: ${error.message}`);
    },
  });

  // Обработчики событий

  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      alert("Введите текст комментария");
      return;
    }

    if (!id) return;

    createCommentMutation.mutate({
      discussionId: id,
      comment: {
        commentBody: commentText,
        parentCommentId: replyToComment?.id || null,
      },
    });
  };

  const handleReply = (comment: Comment) => {
    setReplyToComment(comment);
    setTimeout(() => {
      const formElement = document.querySelector(`.${styles.commentForm}`);
      formElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleBack = () => {
    navigate("/discussion");
  };

  // Рендер комментария

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    return (
      <div
        key={comment.id}
        className={`${styles.comment_card} ${isReply ? styles.replyCard : ""}`}
      >
        <div className={styles.commentAuthor}>
          {comment.authorFullName || "Аноним"}
        </div>
        <div className={styles.commentText}>{comment.commentBody}</div>
        <div className={styles.commentFooter}>
          <div className={styles.comment_props}>
            <span className={styles.reaction}>
              {comment.likeReactionsCount || 0}
              <img width="20" height="20" src={like} />
            </span>
            <span className={styles.reaction}>
              {comment.dislikeReactionsCount || 0}
              <img width="20" height="20" src={dislike} />
            </span>
            <Button
              className={styles.btn_reply}
              onClick={() => handleReply(comment)}
            >
              <img width="20" height="20" src={reply} />
              Ответить
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCommentsWithReplies = (comments: Comment[]) => {
    return comments.map((comment) => (
      <div key={comment.id}>
        {renderComment(comment, false)}
        {comment.replies && comment.replies.length > 0 && (
          <div className={styles.repliesList}>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    ));
  };

  if (isDiscussionLoading || isCommentsLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}>Загрузка...</div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className={styles.error}>
        <p>Обсуждение не найдено</p>
        <Button onClick={handleBack} className={styles.backBtn}>
          Назад
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Sidebar isOpen={true}>
        <div className={styles.sidebar_nav}>
          <Button
            variant="secondary"
            className={`${styles.sidebar_btn} ${styles.marked}`}
            to="/discussion"
          >
            <img src={chat} alt="Chat icon" />
            Обсуждения
          </Button>
          <Button
            variant="secondary"
            className={styles.sidebar_btn}
            to="/students"
          >
            <img src={students} alt="Students icon" />
            Студенты
          </Button>
          <Button
            variant="secondary"
            className={styles.sidebar_btn}
            to="/teams"
          >
            <img src={teams} alt="Teams icon" />
            Команды
          </Button>
          <Button
            variant="secondary"
            className={styles.sidebar_btn}
            to="/curators"
          >
            <img src={search} alt="Search icon" />
            Кураторы
          </Button>
          <Button
            variant="secondary"
            className={styles.sidebar_btn}
            to="/calendar"
          >
            <img src={calendar} alt="Calendar icon" />
            Календарь
          </Button>
          <Button
            variant="secondary"
            className={styles.sidebar_btn}
            to="/projects"
          >
            <img src={list} alt="list icon" />
            Кейсы
          </Button>
        </div>
      </Sidebar>

      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.discussion_card}>
            <DiscussionCard
              like={discussion.likeReactionsCount}
              dislike={discussion.dislikeReactionsCount}
              status={discussion.status}
              author={discussion.authorFullName}
              title={discussion.title}
              showReactions={true}
            />
          </div>

          {discussion.description && (
            <div className={styles.discussionDescription}>
              {discussion.description}
            </div>
          )}

          <div className={styles.commentsSection}>
            <h2 className={styles.commentsTitle}>Комментарии</h2>

            <div className={styles.commentsList}>
              {renderCommentsWithReplies(comments)}
            </div>
            <div className={styles.flex}>
              <textarea
                className={styles.textarea_comment}
                placeholder="Введите комментарий"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
              />
              <Button
                className={styles.btn_submit}
                onClick={handleSubmitComment}
                disabled={createCommentMutation.isPending}
              >
                {createCommentMutation.isPending
                  ? "Отправка..."
                  : replyToComment
                    ? "Ответить"
                    : "Добавить комментарий"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionCommentsPage;
