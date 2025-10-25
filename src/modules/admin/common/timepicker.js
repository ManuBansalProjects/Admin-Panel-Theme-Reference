import React from 'react';
import {getDiffrenceInTime} from "../../../utils/commonfunction";
import { DatePicker } from 'rsuite';

const CustomTimepicker = (props) => {

  function handleChange(datetime) {
    props.setField(props.fieldname, datetime)
    if(props?.correspondingEndTime){
      const timeDiff = getDiffrenceInTime(
        datetime,
        props.correspondingEndTime, 
      )
      // console.log("timeDiff", timeDiff);
      // console.log("props.formikRef", props.formikRef);
      if(timeDiff <= 0){
        props.formikRef?.current?.setFieldValue(props.correspondingEndTimeName, null)
      }
    }

    // if(props.endTime && props.correspondingStartDate){
    //   const timeDiff = getDiffrenceInTime(
    //     props.correspondingStartDate, 
    //     datetime,
    //   )
    //   console.log("timeDiff", timeDiff);
    //   if(timeDiff <= 0){
    //     props.setField(props.fieldname, null)
    //   }
    // }
  }

  const handleBlur = () => {
    props.setFieldTouched(props.fieldname, true)
  };

  return (
    <>
      <DatePicker
        className='w-100'
        format="HH:mm:ss"
        style={{ width: 260 }}
        placeholder={props.placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        value={props.value ? props.value : null}
        cleanable={false}
        editable={false}
        // disabledHours={props.fieldname == "start_Time" ?  hour => hour < currentHour : null }
        // disabledHours={hour => hour < 8 || hour > 18}
        // disabledMinutes={minute => minute % 15 !== 0}
        // disabledSeconds={second => second % 30 !== 0}
      />
    </>

  )
}

export default CustomTimepicker