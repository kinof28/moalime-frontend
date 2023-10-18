import React from "react";
import { Card, Grid, Typography, styled, Box } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CastForEducationOutlinedIcon from "@mui/icons-material/CastForEducationOutlined";
import { useTranslation } from "react-i18next";
import { useMainBoxes } from "../../hooks/useMainBoxes";
import { useSelector } from "react-redux";

// Edited by Abdelwahab
import { Link } from "react-router-dom";

const IconWrapper = styled(Box)({
  borderRadius: "50%",
  padding: "12px 10px",
  backgroundColor: "#F5F7FB",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#464a53",
  width: "60px",
  height: "60px",
});

const CardBox = styled(Card)({
  padding: "30px 12px",
  display: "flex",
  width: "100%",
  columnGap: "20px",
});

export default function Statistics() {
  const { t } = useTranslation();

  const { token } = useSelector((state) => state.admin);
  const { data, isLoading } = useMainBoxes(token);
  console.log(data);

  const details = [
    {
      title: t("totalstudents"),
      number: data?.data.studentsNumber,
      icon: PeopleAltOutlinedIcon,
      color: "#5e72e4",
      link: "/students",
    },
    {
      title: t("totalteachers"),
      number: data?.data.teachersNumber,
      icon: SchoolOutlinedIcon,
      color: "#FFAA16",
      link: "/teachers",
    },
    {
      title: t("parents"),
      number: data?.data.parentsNumber,
      icon: CastForEducationOutlinedIcon,
      color: "#FF1616",
      link: "/parent-student",
    },
    {
      title: t("registeredlessons"),
      number: data?.data.sessionsNumber,
      icon: SubjectOutlinedIcon,
      color: "#673BB7",
      link: "/booked-lessons",
    },
  ];

  return (
    <Grid container spacing={4}>
      {details.map((item, index) => {
        return (
          <Grid item xs={12} sm={6} lg={3} key={index + "q1"}>
            {/*  Edited by Abdelwahab */}
            <Link to={`/admin${item.link}`}>
              <CardBox sx={{ backgroundColor: item.color }}>
                <IconWrapper>
                  <item.icon sx={{ fontSize: "25px" }} />
                </IconWrapper>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "700", fontSize: "24px", color: "white" }}
                  >
                    {item.number}
                  </Typography>
                </Box>
              </CardBox>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
}
