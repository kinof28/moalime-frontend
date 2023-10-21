import React from "react";
import Navbar from "../../components/Navbar";
import { Button, Container, Paper } from "@mui/material";
import BookedLesson from "../../components/student/BookedLesson";
import { useTeacherLessons } from "../../hooks/useTeacherLessons";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useTranslation } from "react-i18next";

export default function TeacherLessons() {
  const { teacher, token } = useSelector((state) => state.teacher);
  const { data, isLoading } = useTeacherLessons(teacher.id, token);
  const { t } = useTranslation();
  return (
    <Navbar>
      <Container sx={{ marginTop: "120px", marginBottom: "80px" }}>
        <Button
          href="http://meet.google.com/new"
          target="_blank"
          variant="contained"
          color="success"
          size="medium"
          endIcon={
            <VideoCallIcon sx={{ marginRight: "16px", fontSize: "large" }} />
          }
        >
          {t("start_lesson_meet")}
        </Button>
        {!isLoading ? (
          <Paper sx={{ marginY: "20px", padding: "40px 20px 20px" }}>
            {data?.data?.length > 0 &&
              data.data.map((lesson, index) => {
                return (
                  <BookedLesson
                    image={lesson?.Student?.image}
                    name={lesson?.Student.name}
                    date={lesson?.date}
                    type={lesson?.type}
                    period={lesson?.period}
                    isStudent={false}
                    studentAccept={lesson?.studentAccept}
                    teacherAccept={lesson?.teacherAccept}
                    sessionId={lesson?.id}
                    key={index + "zw3"}
                  />
                );
              })}
          </Paper>
        ) : (
          <Loading />
        )}
      </Container>
    </Navbar>
  );
}
