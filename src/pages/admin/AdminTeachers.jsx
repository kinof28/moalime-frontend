import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import { useAdminTeachers } from "../../hooks/useAdminTeachers";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function AdminTeachers() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.admin);

  const columns = [
    { id: "Name", label: t("name"), minWidth: 150 },
    { id: "Email", label: t("email"), minWidth: 150 },
    { id: "Gender", label: t("gender"), minWidth: 150 },
    { id: "Phone", label: t("phone"), minWidth: 150 },
    { id: "View", label: t("view"), minWidth: 150 },
    { id: "actions", label: t("actions"), minWidth: 150 },
    { id: "Actions", label: t("financialRecord"), minWidth: 150 },
  ];
  const dataGridColumns = [
    {
      field: "name",
      headerName: t("name"),
      valueGetter: (params) => {
        return `${params.row.firstName || ""} ${params.row.lastName || ""}`;
      },
    },
    { headerName: t("email"), field: "email" },
    { headerName: t("gender"), field: "gender" },
    { headerName: t("phone"), field: "phone" },
    { headerName: t("view"), field: "View" },
    { headerName: t("actions"), field: "actions" },
    { headerName: t("financialRecord"), field: "Actions" },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const { data, isLoading } = useAdminTeachers(token);

  console.log("data: ", data);

  async function handleDownloadFile() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/allTeachersPDF`,
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

  const handleDelete = (id) => {
    try {
      fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/deleteTeacher/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );
      enqueueSnackbar("Teacher Deleted Successfully", {
        variant: "warning",
        autoHideDuration: 4000,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
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
          {t("teachers")}
        </Typography>
        <Button variant="contained" onClick={handleDownloadFile}>
          {t("download")}
        </Button>
      </Box>

      {!isLoading ? (
        // <Paper sx={{ width: "100%", padding: "20px" }}>
        //   <TableContainer sx={{ maxHeight: 440 }}>
        //     <Table stickyHeader aria-label="sticky table">
        //       <TableRow>
        //         {columns.map((column) => (
        //           <TableCell
        //             key={column.id}
        //             align={"center"}
        //             style={{ top: 57, minWidth: column.minWidth }}
        //           >
        //             {column.label}
        //           </TableCell>
        //         ))}
        //       </TableRow>
        //       <TableBody>
        //         {data?.data.length > 0 &&
        //           data.data
        //             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        //             .map((row) => {
        //               return (
        //                 <TableRow hover role="checkbox" key={row.id + "demj"}>
        //                   <TableCell align="center">
        //                     {row.firstName + " " + row.lastName || ""}
        //                   </TableCell>
        //                   <TableCell align="center">{row.email}</TableCell>
        //                   <TableCell align="center">
        //                     {row.gender || ""}
        //                   </TableCell>
        //                   <TableCell align="center">
        //                     {row.phone || ""}
        //                   </TableCell>
        //                   <TableCell align="center">
        //                     <Button
        //                       color="secondary"
        //                       onClick={() =>
        //                         navigate(`/admin/teacher/${row.id}`)
        //                       }
        //                     >
        //                       <VisibilityIcon />
        //                     </Button>
        //                   </TableCell>
        //                   <TableCell align="center">
        //                     <Button
        //                       onClick={() => handleDelete(row.id)}
        //                       sx={{ minWidth: "10px" }}
        //                       color="error"
        //                     >
        //                       <DeleteIcon />
        //                     </Button>
        //                   </TableCell>
        //                   <TableCell align="center">
        //                     <Button
        //                       onClick={() =>
        //                         navigate(`/admin/teacher/${row.id}/dues`)
        //                       }
        //                       sx={{ minWidth: "10px" }}
        //                     >
        //                       <LocalAtmIcon />
        //                     </Button>
        //                   </TableCell>
        //                 </TableRow>
        //               );
        //             })}
        //       </TableBody>
        //     </Table>
        //   </TableContainer>
        //   <TablePagination
        //     rowsPerPageOptions={[10, 25, 100]}
        //     component="div"
        //     count={data?.data.length}
        //     rowsPerPage={rowsPerPage}
        //     page={page}
        //     onPageChange={handleChangePage}
        //     onRowsPerPageChange={handleChangeRowsPerPage}
        //   />
        // </Paper>
        <DataGrid
          // {...data.data}
          // disableColumnFilter
          // disableColumnSelector
          // disableDensitySelector
          columns={dataGridColumns}
          rows={data.data}
          pageSizeOptions={[5, 10, 25]} // slots={{ toolbar: GridToolbar }}
          // slotProps={{
          //   toolbar: {
          //     showQuickFilter: true,
          //   },
          // }}
        />
      ) : (
        <Loading />
      )}
    </AdminLayout>
  );
}
