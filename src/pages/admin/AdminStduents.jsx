import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import { useStudents } from "../../hooks/useStudents";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
// Added by Abdelwahab
import EmailIcon from "@mui/icons-material/Email";
import TextField from "@mui/material/TextField";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminStduents() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    { id: "Name", label: t("name"), minWidth: 150 },
    { id: "Email", label: t("email"), minWidth: 150 },
    { id: "Gender", label: t("gender"), minWidth: 150 },
    { id: "Phone", label: t("phone"), minWidth: 150 },
    { id: "financialRecord", label: t("financialRecord"), minWidth: 150 },
    // Added by Abdelwahab
    { id: "message", label: t("instant_messaging"), minWidth: 150 },
    // ---------
    { id: "actions", label: t("actions"), minWidth: 150 },
    { id: "credit", label: `${t("credit")} - OMR`, minWidth: 150 },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { data, isLoading } = useStudents();

  const { token } = useSelector((state) => state.admin);
  const [pdf, setPdf] = useState(null);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  async function handleDownloadFile() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/allStudentsPDF`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = async (id) => {
    try {
      fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/deleteStudent/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );
      enqueueSnackbar("Student Deleted Successfully", {
        variant: "warning",
        autoHideDuration: 4000,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  // Added by Abdelwahab
  const handleCreateMessage = async (student) => {
    const time = Timestamp.now();
    await addDoc(collection(db, "chats"), {
      messages: [],
      teacherId: "0",
      studentId: `${student?.id}`,
      studentName: `${student?.name}`,
      studentImage: `${student?.image}`,
      teacherName: "",
      teacherImage: "",
      lastmessage: time,
    });
    navigate(`/admin/messages`);
  };

  return (
    <AdminLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          marginTop: "20px",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "500" }}>
          {t("students")}
        </Typography>
        <Button variant="contained" onClick={handleDownloadFile}>
          {t("download")}
        </Button>
      </Box>
      {pdf && (
        <embed
          src={URL.createObjectURL(pdf)}
          type="application/pdf"
          width="100%"
          height="600px"
        />
      )}
      {!isLoading ? (
        <Paper sx={{ width: "100%", padding: "20px" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <TextField
              sx={{ m: 1, width: "90%" }}
              label={t("search")}
              variant="outlined"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Table stickyHeader aria-label="sticky table">
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={"center"}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableBody>
                {data?.data.length > 0 &&
                  data?.data
                    .filter(
                      (row) =>
                        `${row.name || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${row.email || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${row.gender || ""}`
                          .toLowerCase()
                          .startsWith(searchInput.toLowerCase().trim()) ||
                        `${row.phoneNumber || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim())
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" key={row.id + "demj"}>
                          <TableCell align="center">{row?.name}</TableCell>
                          <TableCell align="center">{row?.email}</TableCell>
                          <TableCell align="center">{t(row?.gender)}</TableCell>
                          <TableCell align="center">
                            {row?.phoneNumber}
                          </TableCell>

                          <TableCell align="center">
                            <Button
                              onClick={() =>
                                navigate(`/admin/student/${row.id}/payment`)
                              }
                              sx={{ minWidth: "10px" }}
                            >
                              <LocalAtmIcon />
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              color="success"
                              onClick={() => handleCreateMessage(row)}
                            >
                              <EmailIcon />
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() => handleDelete(row.id)}
                              sx={{ minWidth: "10px" }}
                              color="error"
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                          <TableCell align="center">{row?.wallet}</TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data?.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Loading />
      )}
    </AdminLayout>
  );
}
