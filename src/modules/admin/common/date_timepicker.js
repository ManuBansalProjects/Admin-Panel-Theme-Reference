import React, { useEffect, useState } from 'react'
import { DateRangePicker } from 'rsuite';

const DateTimeRangePicker = (props) => {

    const [value, setValue] = useState();

    useEffect(() => {
        if (props.defaultvalue) {
            setValue(new Date(props.defaultvalue))
        }
    }, [props.defaultvalue])


    function handleChange(datetime) {
        props.setField(props.fieldname, datetime)
    }


    return (
        <DateRangePicker
            className='w-100'
            style={{ width: 260 }}
            placeholder={props.placeholder}
            format="yyyy-MM-dd HH:mm:ss"
            onChange={handleChange}
            value={value}
            cleanable={false}
            // defaultCalendarValue={[new Date('2022-02-01 00:00:00'), new Date('2022-05-01 23:59:59')]}
        />
    )
}

export default DateTimeRangePicker