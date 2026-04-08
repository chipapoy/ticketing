import { React, useState, useEffect, Fragment, useRef } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import LinearProgress from '@mui/material/LinearProgress';

const Tagging = (props) => {

  var ticket_ref_id = props.ticket_ref_id;
  var user_id = props.user_id;

  const [data, setData] = useState([])
  const [notes, setNotes] = useState({
    ticket_ref_id: props?.ticket_ref_id,
    work_note: "",
    added_by: user_id,
    added_date: moment().format('YYYY-MM-DD HH:mm')
  })
  const [disableNoteSubmit,setDisableNoteSubmit] = useState(true);

  const [isSuccess,setIsSuccess] = useState(false);
  const [isLoading,setIsLoading] = useState(true);

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
        setIsLoading(false)
      });
  }

  useEffect(() => {

    getWorkNoteList(props?.ticket_ref_id)

  }, [])


  const handleForm = (e) => {

    if(e.target.value.trim()!=""){
      setDisableNoteSubmit(false);
    }
    else{
      setDisableNoteSubmit(true);
    }

    setNotes( prev => (
      {
        ...prev,
        [e.target.name]: e.target.value
      }
    ))
  }

  const handleSendNotes = () => {

    const url = '/api/TicketList/insertWorkNote';

    setIsLoading(true)

    axios.post(url, notes, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        getWorkNoteList(ticket_ref_id)
        setDisableNoteSubmit(true)
        setIsLoading(false)
        
        setNotes( prev => (
          {
            ...prev,
            work_note: ""
          }
        ))

      })
      .catch(error => {

        setIsSuccess(false)
        setIsLoading(false)
      })

  }


  return (
    <div className="w-auto mb-4">
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Tagging</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={selected}
          onChange={handleChange}
        >
          {
            props.listOfItems.map( (item) => (
              <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.name} />
            ))
          }
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default Tagging