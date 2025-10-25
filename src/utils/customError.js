import React from "react";
import { useTranslation } from "react-i18next";
import { DT } from "./commonfunction";

export default function CustomError({ name, form, className, translatedErrors = true, shortCodes=[] }) {
  const {t}= useTranslation();
  function __getDeeper(obj, path, defaultValue) {
    const keys = path.split(".");
    let result = obj;

    for (const key of keys) {
      result = result[key];
      if (result === undefined) {
        return defaultValue;
      }
    }
    return result;
  }
  if (name.indexOf(".") === -1) {
    if (form && form.errors && form.touched[name] && form.errors[name]) {
      return (
        <div className={"validation-error " + (className ? className : "")}>
          {translatedErrors ? DT(t(form.errors[name]), shortCodes) : form.errors[name]}
        </div>
      );
    } else {
      return null;
    }
  } else {
    if (
      form &&
      form.errors &&
      __getDeeper(form.touched, name, null) &&
      __getDeeper(form.errors, name, null)
    ) {
      return (
        <div className={"validation-error " + (className ? className : "")}>
          {__getDeeper(form.errors, name, null)}
        </div>
      );
    } else {
      return null;
    }
  }
}
