import React from 'react'
import { DatePicker } from 'rsuite';
import { diffrenceBetweenTwoDates, getDiffrenceInDays }from "../../../utils/commonfunction";
import moment from 'moment';

const CustomDatetimepicker = (props) => {
  function handleChange(datetime) {
    props.setField(props.fieldname, datetime)

    if(props?.correspondingEndDate){
      const totalDays = diffrenceBetweenTwoDates(
        datetime,
        props.correspondingEndDate, 
      )
      if(totalDays <= 0){
        props.formikRef?.current?.setFieldValue(props.correspondingEndDateName, null)
      }
    }
    setTimeout(() => {
      if(props?.formikRef?.current?.values?.hotelStartDate && props?.formikRef?.current?.values.hotelEndDate){
        const totalDays = getDiffrenceInDays(
          props?.formikRef?.current?.values?.hotelStartDate, 
          props?.formikRef?.current?.values.hotelEndDate
        )

        const addedDays = totalDays + 1;
        if(addedDays > 0){
          var newDates = [];
          newDates.push({
              id:0, 
              totalQuantitySingleRoom: "", 
              priceSingleRoom: "", 
              breakfastPriceSingleRoom: "", 
              totalQuantityDoubleRoom: "",
              priceDoubleRoom: "",
              breakfastPriceDoubleRoom: "",  
              date: props?.formikRef?.current?.values?.hotelStartDate.toISOString().split("T")[0],
              checkforSingleRoom: true,
              checkforDoubleRoom: true
          });
          var date1 = new Date(props?.formikRef?.current?.values?.hotelStartDate);
          for(let i = 1; i < addedDays; i++){
            const tomorrow = new Date(date1);
            tomorrow.setDate(date1.getDate() + 1)
            newDates.push({
              id:i, 
              totalQuantitySingleRoom: "", 
              priceSingleRoom: "", 
              breakfastPriceSingleRoom: "",
              totalQuantityDoubleRoom: "",
              priceDoubleRoom: "",
              breakfastPriceDoubleRoom: "",  
              date: tomorrow.toISOString().split("T")[0],
              checkforSingleRoom: true,
              checkforDoubleRoom: true
            });
            date1 =  tomorrow;
          }
          props.formikRef?.current?.setFieldValue("hotelTotalDays", newDates);
        }
      }
    }, 500)
  }

  const handleBlur = () => {
    props.setFieldTouched(props.fieldname, true)
  };

  const disabledDate = (date) => {
    const minDate = new Date('2023-10-10'); // Replace with your desired minimum date
    const maxDate = new Date('2023-10-13'); // Replace with your desired maximum date
    return date < minDate || date > maxDate;;
  }

  return (
    <div className='row col-md6'>
      <DatePicker
        disabled={props.disabled ? props.disabled : false}
        className='col-md6'
        // onSelect={onDoubleClick}
        // onClick={(e) => setOpen(true)}
        // style={{ width: 200 }}
        oneTap={true}
        placeholder={ props.placeholder ? props.placeholder : "Select sate"}
        disabledDate={disabledDate}
        // format="yyyy-mm-dd"
        // open={open}
        onChange={handleChange}
        onBlur={handleBlur}
        value={props.value ? props.value : null}
        cleanable={true}
        editable={false}
        shouldDisableDate={(current) => {
          if(props && props?.endDate){
            if(props && props?.correspondingStartDate){
              return moment(current).isBefore(props?.correspondingStartDate, 'day');
            }else{
              return moment().add(-1, 'days')  >= current;
            }
          }else{
            return moment().add(-1, 'days')  >= current;
          }
        }}
      />
    </div>
  )
}

export default CustomDatetimepicker