import React, { useEffect, useRef, useState } from 'react';
import { SelectPicker } from 'rsuite';
import DIAL_CODES from './DialCodesList.json';
import { TrimText } from './commonfunction';

const VALUE_TYPES = {
    DIAL_CODE: 'dial_code',
    PHONE_NUMBER: 'phone_number',
};
export default function PhoneInput({
    name, defaultValue = null, disabled = false, placeholder = "Enter phone number", className = "form-control", defaultCode = "", value = "", id = "phone_number",
    onChange = () => { }, onBlur = () => { }
}) {

    const [dialCodeOptions] = useState(DIAL_CODES.map((item) => {
        return {
            label: `${item?.value} ${TrimText(item?.label, 15)}`,
            value: item.value
        }
    }));
    const numberRef = useRef();
    const codeRef = useRef();

    const [selectedCode, setSelectedCode] = useState(defaultCode);

    function parseValue(valueData) {
        if (valueData) {
            if (typeof valueData === "string") {
                const arr = valueData.split(" ");
                let code = defaultCode;
                let number = "";
                if (arr.length < 2) {
                    if (arr[0].includes('+')) {
                        code = arr[0];
                    } else {
                        number = arr[0];
                    }
                } else {
                    // alert()
                    if (arr[0].includes('+')) {
                        code = arr[0];
                        number = arr.slice(1, arr.length).join("");
                    } else {
                        number = arr.join("");
                    }
                }
                return { code: code, number: number };
            } else if (typeof valueData === "object" && !Array.isArray(valueData)) {
                const { code, number } = valueData;
                return { code: code || defaultCode, number: number || "" };
            }
        } else {
            return { code: defaultCode, number: "" };
        }
    }
    // useEffect(()=>{
    //     if(defaultValue){
    //         if(typeof defaultValue === "string"){
    //             const arr = defaultValue.split(" ");
    //             let code = "";
    //             let number = "";
    //             if(arr.length < 2){
    //                 if(arr[0].includes('+')){
    //                     code = arr[0];
    //                 }else{
    //                     number = arr[0];
    //                 }
    //             }else{
    //                 // alert()
    //                 if(arr[0].includes('+')){
    //                     code = arr[0];
    //                     number = arr.slice(1, arr.length).join("");
    //                 }else{
    //                     number = arr.join("");
    //                 }
    //             }
    //             setCurrentValue({code:code,number:number});
    //         }else if(typeof defaultValue === "object" && !Array.isArray(defaultValue)){
    //             const {code, number} = defaultValue;
    //             setCurrentValue({code:code||"",number:number||""});
    //         }
    //     }else{
    //         setCurrentValue({code:defaultCode,number:defaultNumber});
    //     }
    // },[defaultNumber]);

    const handleChange = (type, value) => {
        let obj = { code: '', number: '' };
        if (type === VALUE_TYPES.DIAL_CODE) {
            obj.code = value;
            obj.number = numberRef?.current?.value;
        } else {
            // console.log(codeRef?.current.value)
            obj.code = selectedCode;
            obj.number = value;
        };
        // setCurrentValue(obj);
        onChange({ ...obj, phone_number: `${obj.code} ${obj.number}` });
    };

    return (
        <div className="input-group">
            <div className="d-inline">
                <SelectPicker
                    ref={codeRef}
                    name={name}
                    disabled={disabled}
                    onChange={(e) => { setSelectedCode(e); handleChange(VALUE_TYPES.DIAL_CODE, e) }}
                    className='phone_input_dial_code'
                    value={parseValue(value)?.code}
                    data={dialCodeOptions}
                    style={{ width: '100px', height: "100%" }}
                    renderValue={(value) => {
                        return <span>{value}</span>
                    }}
                    // renderMenuItem={(label,data)=>{
                    //     return <span>{data?.value} {label}</span>
                    // }}
                    cleanable={false}
                />
            </div>
            <input type="number"
                id={id}
                disabled={disabled}
                ref={numberRef}
                style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                }} className={"phone_input_dial_number form-control"} value={parseValue(value)?.number}
                onChange={(e) => { handleChange(VALUE_TYPES.PHONE_NUMBER, e?.target?.value) }} name={name} onBlur={onBlur} placeholder={placeholder}
            />
        </div>
    )
}