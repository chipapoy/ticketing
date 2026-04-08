import { React, useState, useEffect, Fragment, useRef } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import dayjs from 'dayjs';
import moment from 'moment';

const today = moment();

const DateTimePickerForm = (props) => {

  const [value, setValue] = useState(moment(props.defaultValue));

  useEffect(() => {

    // console.log(props);
    if (value && !props.isDisabled) {
      props.getValueCallback({
        value: value.format('YYYY-MM-DD HH:mm'),
        name: props.name
      })
    }

  }, [value])

  return (

    <div className="w-auto mb-4">

      {
        !props.isDisabled ?
          (
            <LocalizationProvider dateAdapter={AdapterMoment} >
              <DemoContainer components={['DateTimePicker']} >
                <DateTimePicker
                  readOnly={props.isReadOnly}
                  slotProps={{
                    textField: {
                      size: 'small',
                      required: props.isRequired
                    },
                    actionBar: {
                      actions: ['today', 'accept','cancel'],
                    },
                  }}
                  name={props.name}
                  label={props.label}
                  required={props.isRequired}
                  ampm={false}
                  clearable={true}
                  minDateTime={props.defaultValue ? moment(props.defaultValue) : today}
                  defaultValue={moment(props.defaultValue) || ""}
                  onChange={val => setValue(val)}
                />
              </DemoContainer>
            </LocalizationProvider>
          )
          :
          (
            <LocalizationProvider dateAdapter={AdapterMoment} >
              <DemoContainer components={['DateTimePicker']} >
                <DateTimePicker
                  slotProps={{
                    textField: {
                      size: 'small',
                      required: props.isRequired
                    },
                    actionBar: {
                      actions: ['today', 'accept','cancel'],
                    },
                  }}
                  name={props.name}
                  label={props.label}
                  ampm={false}
                  clearable={true}
                  disabled={props.isDisabled}
                  minDateTime={props.defaultValue ? moment(props.defaultValue) : today}
                  defaultValue={null}
                />
              </DemoContainer>
            </LocalizationProvider>
          )
      }
    </div>
  );
}


export default DateTimePickerForm