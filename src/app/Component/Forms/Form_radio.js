import { React, useState, useEffect, Fragment, useRef } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Form_radio = (props) => {

  const [selected, setSelected] = useState(props.selectedValue!=null ? props.selectedValue : 0 )

  useEffect(() => {

    
    if (selected) {
      props.getValueCallback({
        value: selected,
        id: props.id,
        name: props.name
      })
    }

    console.log(props.selectedValue)

  }, [selected])

  const handleChange = (e) => {

    setSelected(e.target.value)

    if(e.target.value==null){
      props.getValueCallback({
        value: selected,
        id: props.id,
        name: props.name
      })
    }
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

export default Form_radio