import { React, useState, useEffect } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import TextField from '@mui/material/TextField';
import { Input } from "@material-tailwind/react";

const Form_Item_inputtext = (props) => {

  const [inputVal, setInputVal] = useState('')

  useEffect(() => {

    // console.log(props);
    if(inputVal){
      props.getValueCallback({
        value: inputVal,
        name: props.name
      })
    }

  }, [inputVal])

  return (
    <div className="w-auto mb-4">
      <TextField
        name={props.name}
        label={props.label}
        type={props.inputType}
        variant={props.variant}
        required={props.isRequired}
        InputProps={{
          readOnly: props.isReadOnly || false,
        }}
        InputLabelProps={{
          shrink:  props.isShrink,
        }}
        onChange={e => setInputVal(e.target.value)}
        defaultValue={props.defaultValue}
        size='small'
        fullWidth
        // maxLength={2}
      />
    </div>


  )
}

export default Form_Item_inputtext