"use client"
import { Fragment, useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import {
  getHelpdeskTagging
} from '@/Collections/DropdownList';

const WorkNote = (props) => {

  var ticket_ref_id = props.ticket_ref_id;
  var user_id = props.user_id;

  const [data, setData] = useState([])
  const [form, setForm] = useState({
    ticket_ref_id: props?.ticket_ref_id,
    tagging: 100,
    work_note: "",
    added_by: user_id
  })
  const [disableNoteSubmit, setDisableNoteSubmit] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [countOk, setCountOk] = useState(0)
  const [noteOk, setNoteOk] = useState(0)

  const getWorkNoteList = async (ticket_ref_id) => {
    await axios.post(`/api/TicketList/getWorkNote`,
      {
        id: ticket_ref_id
      }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        setData(response.data.result)

        props.workNoteCallback({
          ...response.data
        })

        setIsLoading(false)
      });
  }

  useEffect(() => {

    setCountOk(noteOk)

    countOk == 1 ? setDisableNoteSubmit(false) : setDisableNoteSubmit(true)

  }, [countOk, noteOk])

  useEffect(() => {
    
    getWorkNoteList(props?.ticket_ref_id)

  }, [])


  const handleForm = (e) => {

    if (e.target.value.trim() != "") {
      setNoteOk(1)
    }
    else {
      setNoteOk(0)
    }

    setForm(prev => (
      {
        ...prev,
        [e.target.name]: e.target.value
      }
    ))
  }

  // const handleSelect = (e) => {

  //   setSelected(e.target.value)
  //   // var selected = e.target.value

  //   console.log(e.target.value)

  //   parseInt(e.target.value) > 0 ? setTagOk(1) : setTagOk(0)

  //   setForm(prev => (
  //     {
  //       ...prev,
  //       [e.target.name]: e.target.value
  //     }
  //   ))

    
  // }

  // const handleClearSelect = () => {
  //   setSelected(0)
  //   setTagOk(0)
  // }


  //#region Work Note Response
  const [open, setOpen] = useState(false);
  const [noteServerMsg, setNoteServerMsg] = useState('');

  const handleClick = () => {
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  //#endregion

  const handleSendNotes = () => {

    const url = '/api/TicketList/insertWorkNote';

    const insertData = {
      ...form,
      timestamp: moment().format('YYYY-MM-DD HH:mm'),
      added_date: moment().format('YYYY-MM-DD HH:mm')
    }

    setIsLoading(true)

    axios.post(url, insertData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {

      // setOpen(true)

      if (response.status == 200) {
        getWorkNoteList(ticket_ref_id)
        setDisableNoteSubmit(true)
        setIsLoading(false)
        setNoteOk(0)


        // setNoteServerMsg('Note successfully added.')
        toast.success('Note successfully added.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
          style: {
            fontSize: 14
          },
          onClose: () => {
          }
        });

        setForm(prev => (
          {
            ...prev,
            work_note: ""
          }
        ))
      }
      else {

        setDisableNoteSubmit(true)
        setIsLoading(false)

        // setNoteServerMsg(response.data.result)

        toast.error(response.data.result, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
          style: {
            fontSize: 14
          },
          onClose: () => {
          }
        })

      }
    })
    .catch(error => {
      console.log(error)
      // setOpen(true)
      setNoteServerMsg(error.message)
      setIsLoading(false)
    })
  }

  return (
    <>
      <div className="mx-10">
        {console.log(data)}
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {
            !isLoading ?
              data.map((res) => (
                <div key={res.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={res.user_name}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${res.work_notes}`}
                      secondary={res.tagging + ' | ' + res.user_name + ' - ' + res.role + ' | ' + moment(res.added_date).format('DD-MMM-YYYY HH:mm')}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))
              :
              <LinearProgress />
          }
        </List>
      </div>
      <div className="mx-10">
        <div className="w-auto mb-2">
          <TextField
            name={'work_note'}
            label={'Work note'}
            variant={'outlined'}
            onChange={handleForm}
            value={form.work_note}
            multiline
            size='small'
            fullWidth
            minRows={1}
            disabled={props.tagDisabled}
            sx={{
              marginTop: 1
            }}
          />
        </div>
        {/* <div className="w-auto mb-2">
          <FormControl >
            <RadioGroup
              row
              // aria-labelledby="tagging-label"
              name="tagging"
              value={selected}
              onChange={handleSelect}
            >
              {
                taggingArr?.map((item) => (
                  <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.name} disabled={props.tagDisabled} />
                ))
              }
            </RadioGroup>
          </FormControl>
        </div> */}

        <div className="w-auto mb-2">
          <Chip
            color='primary'
            label="Submit"
            onClick={handleSendNotes}
            disabled={disableNoteSubmit}
            icon={<SendIcon fontSize='8' />}
            sx={{
              padding: '15px',
                  marginRight: '4px'
            }}
          />

          {/* {
            taggingArr.length === 0 ? null : (
              <Chip
                color='warning'
                size='small'
                label="Reset Form"
                onClick={handleClearSelect}
                disabled={props.tagDisabled}
                icon={<RestartAltIcon fontSize='8' />}
                sx={{
                  padding: '15px',
                  marginRight: '4px'
                }}
              />
            )
          } */}
        </div>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={noteServerMsg}
          action={action}
          sx={{
            backgroundColor: 'white',
            color: 'black'
          }}
        />
      </div>
    </>
  );
}


export default WorkNote