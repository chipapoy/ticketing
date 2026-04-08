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

// import Form_Item_dropdown from '@/Component/Forms/Form_Item_dropdown';

import Autocomplete from '@mui/material/Autocomplete';
import { toast } from 'react-toastify';

import {
  getFtLeadTagging
} from '@/Collections/DropdownList';

const WorkNote = (props) => {

  var ticket_ref_id = props.ticket_ref_id;
  var user_id = props.user_id;

  const [data, setData] = useState([])
  const [resoArr, setResoArr] = useState([])

  const [taggingArr, setTaggingArr] = useState([])
  const [form, setForm] = useState({
    ticket_ref_id: props?.ticket_ref_id,
    tagging: null,
    reso_id: null,
    resolution: null,
    work_note: "",
    added_by: user_id,
    added_date: moment().format('YYYY-MM-DD HH:mm')
  })
  const [disableNoteSubmit, setDisableNoteSubmit] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState(0)
  const [countOk, setCountOk] = useState(0)
  const [tagOk, setTagOk] = useState(0)
  const [noteOk, setNoteOk] = useState(0)
  const [resoOk, setResoOk] = useState(0)
  const [disableTagging, setDisableTagging] = useState(false)
  const [disableOnReso, setDisabledOnReso] = useState(false)
  const [selectedReso, setSelectedReso] = useState({ id: null, name: null })


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

        if (response.data.result.length > 0) {
          console.log(response.data.result[0])

          // setDisableForm(response.data.result[0].user_id == props.user_id) 
          setDisableTagging(response.data.result[0].tag_id == 3 ? false : true)

          props.workNoteCallback({
            ...response.data
          })
        }

        setIsLoading(false)
      });
  }

  useEffect(() => {

    setCountOk(tagOk + noteOk + resoOk)
    if (taggingArr.length === 0) {
      getFtLeadTagging().then((response) => {
        setTaggingArr(response.data.result)
      });
    }
    countOk == 3 ? setDisableNoteSubmit(false) : setDisableNoteSubmit(true)
  }, [countOk, tagOk, noteOk, resoOk])

  useEffect(() => {
    getWorkNoteList(props?.ticket_ref_id)

    // if (props.tagDisabled) {
    //   setSelected(0)
    //   setDisableForm(true)
    // }
    // console.log(props.tagDisabled)

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

  const handleSelect = (e) => {

    var tagId = parseInt(e.target.value)

    setSelected(e.target.value)
    // var selected = e.target.value
    tagId > 0 ? setTagOk(1) : setTagOk(0)

    if (tagId == 2 || tagId == 3) {
      setDisabledOnReso(true)
      setResoOk(1)
    }
    else {
      setDisabledOnReso(false)
      setResoOk(0)
    }

    setForm(prev => (
      {
        ...prev,
        [e.target.name]: e.target.value
      }
    ))

  }

  const handleClearSelect = () => {

    setSelected(0)
    setTagOk(0)
    setResoOk(0)
    setSelectedReso({ id: null, name: null })
    // const [resoArr, setResoArr] = useState(props.listOfItems)

    setForm(prev => (
      {
        ...prev,
        reso_id: null,
        resolution: null
      }
    ));

  }

  const handleChangeReso = (event, data) => {

    setSelectedReso(data)
    console.log(data)

    data ? setResoOk(1) : setResoOk(0)

    setForm(prev => (
      {
        ...prev,
        reso_id: data ? data.id : data,
        resolution: data ? data.name : data
      }
    ));
  }

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

    console.log(form)

    const url = '/api/TicketList/insertWorkNote';

    setIsLoading(true)

    axios.post(url, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {

        setOpen(true)

        if (response.status == 200) {
          getWorkNoteList(ticket_ref_id)
          setDisableNoteSubmit(true)
          setIsLoading(false)
          setSelected(0)
          setTagOk(0)
          setNoteOk(0)
          setResoOk(0)
          setSelectedReso({ id: null, name: null })

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
              work_note: "",
              tagging: null,
              reso_id: null,
              resolution: null
            }
          ))

          const notifId = toast.loading("Processing...");

          axios.post('/api/TicketList/updateTechData', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
            .then(response => {
              console.log(response);

              if (response.status == 200) {
                setTimeout(() => {
                  toast.update(notifId, {
                    render: `Ticket has been updated!`,
                    type: 'success',
                    delay: undefined,
                    isLoading: false,
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    style: {
                      fontSize: 14
                    },
                    onClose: () => {
                      // redirect('/tickets');
                      props.updateCallback({
                        refresh: true,
                        open: false
                      })
                    }
                  })
                }, 1500);
              }
              else {

                toast.update(notifId, {
                  render: response.data.result,
                  type: 'error',
                  delay: undefined,
                  isLoading: false,
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
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
              toast.update(notifId, {
                render: error.message,
                type: 'error',
                delay: undefined,
                isLoading: false,
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                style: {
                  fontSize: 14
                },
                onClose: () => {

                }
              })
            })


        }
        else {

          setDisableNoteSubmit(true)
          setIsLoading(false)

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
          });

          // toast.update(notifId, {
          //   render: response.data.result,
          //   type: 'error',
          //   delay: undefined,
          //   isLoading: false,
          //   position: "top-right",
          //   autoClose: 1500,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "dark",
          //   style: {
          //     fontSize: 14
          //   },
          //   onClose: () => {

          //   }
          // })


        }
      })
      .catch(error => {
        console.log(error)
        setOpen(true)
        setIsSuccess(false)
        setIsLoading(false)

        toast.update(notifId, {
          render: error.message,
          type: 'error',
          delay: undefined,
          isLoading: false,
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            fontSize: 14
          },
          onClose: () => {

          }
        })
      })


  }

  return (
    <>
      <div className="mx-10">
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
                      primary={res.work_notes}
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
        <div className="w-auto mb-2">
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
                  <FormControlLabel
                    key={item.id}
                    value={item.id}
                    control={<Radio />}
                    label={item.name}
                    disabled={props.tagDisabled}
                  />
                ))
              }
            </RadioGroup>
          </FormControl>
        </div>
        <div className="w-auto mb-2">
          <Autocomplete
            id={'reso_id'}
            size="small"
            value={selectedReso}
            options={props.listOfItems}
            onChange={handleChangeReso}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )
            }}
            getOptionLabel={(option) => option.name || ""}
            disableClearable={false}
            disabled={props.tagDisabled ? props.tagDisabled : disableOnReso}
            renderInput={(params) => (
              <TextField
                {...params}
                label={'Resolution'}
                variant={'outlined'}
                required={!props.tagDisabled}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </div>
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
          {
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
          }
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