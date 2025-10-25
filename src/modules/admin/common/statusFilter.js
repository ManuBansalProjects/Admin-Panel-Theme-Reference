import React from "react";
import { useTranslation } from "react-i18next";

function StatusFilter(props) {
    const {t} = useTranslation()
    const showFilterlist = props.data && props.data.length > 0 ? props.data : [];

    const handleChange = (e) => {
        if (e.target.value) {
            props.prepareSearch("status", Number(e.target.value))
        } else {
            props.prepareSearch("status", "")
        }
    };

    return (
        <div className="form-group mb-0 filter_icon_container filter_design">
            <i className="fa fa-filter mr-2 filter_icon"></i>
            <div className="select-down-arrow">
            <select className="form-control cp" onChange={handleChange} id="defaultstatus">
                {showFilterlist && showFilterlist.length > 0 && showFilterlist.map((option, i) => {
                    return (
                        <option key={i} value={option.status__id}>
                            {t(option.name)}
                        </option>
                    );
                })}
            </select>
            </div>
            
        </div>
    );
}
export default StatusFilter;