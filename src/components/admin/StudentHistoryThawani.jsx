import React from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box} from '@mui/material';
import Loading from '../../components/Loading'
import { useTranslation } from 'react-i18next';
import { useAdminStudentThawani } from '../../hooks/useAdminStudentThawani';
import { useSelector } from 'react-redux';

export default function StudentHistoryThawani({id}) {
    const {t} = useTranslation()
    const columns = [
    { id: 'history', label:t('history'), minWidth: 150 },
    { id: 'name_subject', label:t('currency'), minWidth: 150 },
    { id: 'amount', label:t('amount'), minWidth: 150 }];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const {token} = useSelector((state)=>state.admin)
    const {data,isLoading} = useAdminStudentThawani(id,token)

    return (
    <Box>
        {!isLoading?
        <Paper sx={{ width: '100%',padding:"20px"}}>
            <TableContainer sx={{ maxHeight: 440 }}>
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
                        {data?.data.length>0&&data.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            return <TableRow hover role="checkbox"  key={row.id+"demj"}>
                                <TableCell align='center'>
                                    {row.createdAt.split('T')[0]}
                                </TableCell>
                                <TableCell align='center'>
                                    {row.currency}
                                </TableCell>
                                <TableCell align='center'>
                                    {row.price}
                                </TableCell>
                            </TableRow>
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
        :
        <Loading/>
        }
    </Box>
)
}