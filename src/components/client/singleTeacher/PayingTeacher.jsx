import { Box, Paper, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function PayingTeacher({ teacher }) {
  const { t } = useTranslation();
  const { currency } = useSelector((state) => state.currency);
  return (
    <Paper sx={{ padding: "32px 24px", marginY: "30px" }}>
      <Typography sx={{ fontSize: "22px", marginBottom: "16px" }}>
        {t("paying")}
      </Typography>
      {teacher?.F2FSessionStd && (
        <Typography sx={{ marginBottom: "8px" }}>
          {t("studenthome")} - {teacher?.F2FSessionStd?.price} {currency}
        </Typography>
      )}
      {teacher?.F2FSessionTeacher && (
        <Typography sx={{ marginBottom: "8px" }}>
          {t("teacherhome")} - {teacher?.F2FSessionTeacher?.price} {currency}
        </Typography>
      )}
      {teacher?.RemoteSession && (
        <Typography>
          {t("onlineStudy")} - {teacher?.RemoteSession?.price} {currency}
        </Typography>
      )}
    </Paper>
  );
}
