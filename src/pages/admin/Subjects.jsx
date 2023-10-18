import React, { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Box, Button, Dialog, Grid, Typography,styled } from '@mui/material';
import AddSubject from '../../components/admin/AddSubject';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import Loading from '../../components/Loading';
import { useSubjects } from '../../hooks/useSubject';
import { useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import UpdateSubject from '../../components/admin/UpdateSubject';
import SubjectBox from '../../components/admin/SubjectBox';

const Image = styled("img")({
    width:"80%",
    height:"160px",
    borderRadius:"8px"
})

export default function Subjects() {
    const {t} = useTranslation()
    const [openAddYear,setOpenAddYear] = useState(false)
    function handleClose()
    {
        setOpenAddYear(false)
    }

    const {data,isLoading} = useSubjects()
    const [subjects,setSubjects] = useState([])
    useEffect(()=>
    {
        if(!isLoading)
        {
            setSubjects(data.data)
        }
    },[data])

    /** handle open dialog */
    const [open, setOpen] = React.useState(false);

    const handleCloseDialog = () => {
        setOpen(false);
    };


    return (
    <AdminLayout>
        <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",marginY:"30px"}}>
            <Typography sx={{fontSize:"20px",fontWeight:"500"}}>{t('subjects')}</Typography>
            <Button onClick={()=>setOpenAddYear(true)}
            sx={{textTransform:"capitalize"}} variant="contained">{t('addsubject')}</Button>
        </Box>
        {
        !isLoading?
        <Grid container spacing={2} justifyContent="center">
        {
            subjects?.map((subject,index)=>
            {
                return(
                    <Grid item xs={6} md={4} lg={3} key={index+'aq1'}>
                        <SubjectBox subject={subject} setOpen={setOpen}/>
                        <Dialog open={open===subject.id} onClose={handleCloseDialog}>
                            <UpdateSubject setSubjects={setSubjects} subject={subject} handleClose={handleCloseDialog}/>
                        </Dialog>
                    </Grid>
                )
            })
        }
        </Grid>
        :
        <Loading/>
        }
        <Dialog onClose={handleClose} open={openAddYear}>
            <AddSubject setSubjects={setSubjects} handleClose={handleClose}/>
        </Dialog>
    </AdminLayout>
)
}