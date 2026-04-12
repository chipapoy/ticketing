import * as React from 'react';
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { md5 } from 'js-md5';
import axios from 'axios';


export default function FormDialog(props) {

  const [open, setOpen] = useState(props.isOpen);
  const [password, setPassword] = useState({
    new_password: null,
    repeat_new_pass: null,
  })
  const [errorMsg, setErrorMsg] = useState()
  const [disableBtn, setDisableBtn] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setErrorMsg('')

    props.modalCallback({
      open: false,
      passwordUpdated: false
    })
  };

  useEffect(() => {
    setOpen(props.isOpen)
  }, [props.isOpen])

  const handleForm = (e) => {
    setPassword(prev => ({
      ...prev,
      [e.target.name]: md5(e.target.value)
    }))
  }

  const resetPasswordHandler = async (data) => {

    const url = '/api/Access/resetPassword'

    axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        // console.log(response)
        toast.success('Password reset success! Please login again.', {
          position: "top-center",
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
            // setIsLoading(false)
            setDisableBtn(false)
            props.modalCallback({
              open: false,
              passwordUpdated: true
            })
          }
        });
      })
      .catch(error => {
        // console.log(error.message)
        toast.error(error.message, {
          position: "top-center",
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
            setDisableBtn(false)
            // setIsLoading(false)
          }
        });
      })

  }

  const submitForm = (e) => {
    e.preventDefault();
    // console.log("test")
    setDisableBtn(true)

    if (password.new_password === password.repeat_new_pass) {

      console.log('Same')
      setErrorMsg('')
      

      resetPasswordHandler({
        id: props.userId,
        password: password.repeat_new_pass
      })

    }
    else {
      console.log('Not Same')
      setErrorMsg('Password is not match! Please try again.')
      setDisableBtn(false)
    }
  }

  return (

    <React.Fragment>
      <Dialog open={props.isOpen} >
        <form onSubmit={submitForm}>
          <DialogTitle>Please reset your default password</DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              <Typography variant="body1" gutterBottom color={'red'}>
                {errorMsg}
              </Typography>
            </DialogContentText>
            <TextField
              margin="dense"
              id="new_password"
              name="new_password"
              label="New Password"
              type="password"
              fullWidth
              variant="standard"
              required
              onChange={handleForm}
            />
            <TextField
              margin="dense"
              id="repeat_new_pass"
              name="repeat_new_pass"
              label="Re-enter Password"
              type="password"
              fullWidth
              variant="standard"
              required
              onChange={handleForm}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="success" disabled={disableBtn} type='submit'>Submit</Button>
            <Button variant="outlined" color="error" disabled={disableBtn} onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}