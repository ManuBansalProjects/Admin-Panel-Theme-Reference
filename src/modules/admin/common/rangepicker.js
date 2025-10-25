import React, { useEffect, useState } from "react";
import { DateRangePicker, CustomProvider } from "rsuite";
import { useTranslation } from "react-i18next";
import ja from 'rsuite/locales/ja_JP';
import en from 'rsuite/locales/en_US';

const CustomRangepicker = (props) => {
  const [value, setValue] = useState([]);
  const { t } = useTranslation();
  const selected_language = localStorage.getItem("system_language");

  useEffect(() => {
    setValue([]);
  }, [props.resetdate])

  function handleChange(daterange) {
    if (daterange && daterange.length === 2) { 

      // const startDate = new Date(daterange[0]);
      // startDate.setHours(0, 0, 0, 0); 

      // const endDate = new Date(daterange[1]);
      // endDate.setHours(23, 59, 59, 999); 

      // const startDateUTC = startDate.toISOString();
      // const endDateUTC = endDate.toISOString();

      // props.GetDateRange({ start: startDateUTC, end: endDateUTC });

      // setValue([startDate, endDate]);

      props.GetDateRange({ start: daterange[0], end: daterange[1] });
      setValue(daterange);
    } else {
      props.GetDateRange({});
      setValue([]);
    }
  }

  return (
    <>
      <div className="form-group mb-0 rangepicker_container filter_design">
        <i className="fa fa-calendar glyphicon glyphicon-calendar calender_icon"></i>
        <CustomProvider locale={selected_language === "en" ? en : en}>
          <DateRangePicker
            value={value}
            placeholder={t("input_placeholder_date")}
            placement="bottomEnd"
            cleanable={false}
            onChange={handleChange}
          />
        </CustomProvider>
      </div>
    </>
  );
};

export default CustomRangepicker;
