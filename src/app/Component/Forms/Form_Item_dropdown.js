import { React, useState, useEffect, Fragment, useRef } from 'react'
// import { Select, Option } from "@material-tailwind/react";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Form_Item_dropdown = (props) => {

  const [selected, setSelected] = useState('')
  const [show,setShow] = useState('')
  // console.log(props.selectedValue)

  useEffect(() => {

    console.log(props.isShow)
    
    if (selected) {
      const filter = props.listOfItems.find(obj => {
        return obj.name === selected.name;
      })
      props.getValueCallback({
        value: filter,
        id: props.id,
        name: props.name
      })
    }

  }, [selected])

  const handleChange = (event, value) => {

    setSelected(value)
    if(value==null){
      props.getValueCallback({
        value: {id:null,name:null},
        id: props.id,
        name: props.name
      })
    }
  }

  return (
    <div className={`${ props.isShow ? 'block' : 'hidden'} w-auto mb-4`}>
      {
        props.defaultSelection ?

          // console.log(props.listOfItems[0].name)
          (
            <FormControl fullWidth size="small" disabled={props.isDisabled}>
              <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.listOfItems[0] ? props.listOfItems[0].id : ''}
                label={props.label}
                required={props.isRequired}
                readOnly={props.isReadOnly}
              >
                <MenuItem value={props.listOfItems[0] ? props.listOfItems[0].id : ''} selected>
                  {
                    props.listOfItems[0] ? props.listOfItems[0].name : ''
                  }
                </MenuItem>
              </Select>
            </FormControl>
          )
          :
          (
            <Autocomplete
              id={props.name}
              size="small"
              readOnly={props.isReadOnly}
              options={props.listOfItems}
              loading={true}
              getOptionDisabled={(option) =>
                // props.optionDisabled ? option.name === props.optionDisabled[0] : null
                props.optionDisabled ? props.optionDisabled.indexOf(option.name) > -1 : null
              }
              getOptionLabel={(option) => option.name || ""}
              // value={selected || null}
              defaultValue={props.selectedValue || null}
              onChange={handleChange}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )
              }}
              disableClearable={props.disableClear ? props.disableClear : false}
              disabled={props.isDisabled ? props.isDisabled : false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={props.label}
                  variant={props.variant}
                  required={props.isRequired}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}

            />
          )

      }


    </div>
  )
}

export default Form_Item_dropdown