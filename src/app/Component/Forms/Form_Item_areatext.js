import { Combobox } from '@headlessui/react';
import { React, useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';

const Form_Item_areatext = (props) => {

  const [textValue, setTextValue] = useState('');
  // const [wordCount, limitWord] = useState(0);

  useEffect(() => {

    // console.log(props);
    if (textValue) {
      props.getValueCallback({
        value: textValue,
        name: props.name
      })
    }

  }, [textValue])

  return (

    <div className="w-auto mb-2">
      <TextField
        name={props.name}
        label={props.label}
        variant={props.variant}
        required={props.isRequired}
        onChange={(e) => setTextValue(e.target.value)}
        defaultValue={props.defaultValue}
        multiline
        size='small'
        fullWidth
        minRows={4}
      />
    </div>
  )
}

export default Form_Item_areatext