import React, { useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as ThirdPartyServices from "../../services/thirdparty.services";
import Breadcrums from "../../common/breadcrumbs";
import { useTranslation } from "react-i18next";
import {
  SWAL_SETTINGS,
} from "../../../../utils/Constants";
import {
  globalLoader,
  handleServerValidations,
} from "../../../../utils/commonfunction";
import * as Yup from "yup";
import CustomError from "../../../../utils/customError";

const AstroGPT = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  
  const [conversations, setConversations] = useState([]);
  // const [latestResponse, setLatestResponse] = useState("");
  // const [isStreamingInProgess, setIsStreamingInProgress] = useState(false);

  const breadcrumbs = [
    { title: t("sidebar_link_dashboard"), url: "/admin/dashboard" },
    { title: t("AstroGPT"), url: "" },
  ];

  const validationSchema = Yup.object().shape({
    query: Yup.string().trim().required('Please type your query')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      query: "",
    },
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
        
      globalLoader(true);
      setSubmitted(true);
      
      const updatedConversations = [
        ...conversations,
        {content: values.query, role: 'user'}
      ];
      setConversations(prevConversations => updatedConversations);
      resetForm({ values: "" });

      // handleAsk(updatedConversations); //using streaming

      let formData = new FormData();
      formData.append("conversations", JSON.stringify(updatedConversations));
      ThirdPartyServices
        .AstroGPTQuery(formData)
        .then((response) => {
          setSubmitting(false);
          if (response.success) {
            globalLoader(false);
            setConversations(prevConversations => [
                ...prevConversations,
                {content: response.data.assistant_response, role: 'assistant'}
            ])    
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
            setSubmitted(false);
            globalLoader(false);
          }
        })
        .catch((error) => {
          console.log("error ====> ", error);
        });
    },
  });

  // const handleAsk = async (conversations) => {

  //   const accessToken = JSON.parse(localStorage.getItem('super_admin')).token;
  //   const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/third-party/astrogpt-query`, {
  //     method: "POST",
  //     headers: { 
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}` 
  //     },
  //     body: JSON.stringify({ conversations }),
  //   });

  //   if (!response.body) {
  //     console.error("No response stream");
  //     globalLoader(false);
  //     setSubmitted(false);
  //     return;
  //   }

  //   const reader = response.body.getReader();
  //   const decoder = new TextDecoder("utf-8");

  //   let firstIteration = true;
  //   let assistantResponse = '';

  //   while (true) {
  //     const { value, done } = await reader.read();
  //     if (done) break;
  //     const chunk = decoder.decode(value, { stream: true });
  //     console.log(chunk, '======chunk');
  //     const partialResponseSplitted = chunk.split('\n').filter(line => line.startsWith('data: ')).map(line =>{
  //       line = line.replace(/^data: /, "").trim()
  //       return line == '[DONE]' ? '' : `${line}`;
  //     })
  //     const partialResponse = partialResponseSplitted.join(' ');
  //     console.log(partialResponse, '======partial response');

  //     if(firstIteration){
  //       globalLoader(false);
  //       setSubmitted(false);
  //       setIsStreamingInProgress(true);
  //     }
  //     firstIteration = false;

  //     setLatestResponse((prev) => `${prev}${prev.length ? ' ' : ''}${partialResponse}`);
  //     assistantResponse += `${assistantResponse.length ? ' ' : ''}${partialResponse}`;
  //   }

  //   setIsStreamingInProgress(false);
  //   setConversations(prevConversations => [
  //       ...prevConversations,
  //       {content: assistantResponse, role: 'assistant'}
  //   ])    
  //   setLatestResponse('');
  // };

  return (
    <>
      <Breadcrums data={breadcrumbs} />
      <div className="container py-4 bg-dark text-light min-vh-100">
        {conversations.map((message, index) => {
            const isAssistant = message.role === "assistant";
            return (
              <div
                  key={index}
                  className={`d-flex mb-3 ${
                  isAssistant ? "justify-content-start" : "justify-content-end"
                  }`}
              >
                  <div
                    className={`p-3 rounded-4 shadow-sm ${
                        isAssistant
                        ? "bg-grey text-white rounded-start-0"
                        : "bg-primary text-white rounded-end-0"
                    }`}
                    style={{ maxWidth: "75%" }}
                  >
                    <small className="fw-bold text-uppercase d-block mb-1 opacity-75">
                        {message.role}
                    </small>
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {message.content}
                    </p>
                  </div>
              </div>
            );
        })}
        {/* {
          isStreamingInProgess 
          ?
            <div
              className={`d-flex mb-3 "justify-content-start"`}
            >
              <div
                className={`p-3 rounded-4 shadow-sm "bg-grey text-white rounded-start-0"}`}
                style={{ maxWidth: "75%" }}
              >
                <small className="fw-bold text-uppercase d-block mb-1 opacity-75">
                    assistant
                </small>
                <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {latestResponse}
                </p>
              </div>
            </div>
          : null
        } */}
        </div>



        <div className="chat-input-container mt-3">
            <form onSubmit={formik.handleSubmit} className="d-flex align-items-center bg-light rounded-pill shadow-sm px-3 py-2">
                <input
                    name="query"
                    id="query"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.query}
                    className="form-control border-0 bg-transparent"
                    placeholder="✨ Ask the astrologer about your stars..."
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="btn btn-primary rounded-circle ms-2 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "42px", height: "42px" }}
                >
                    <i className="fa fa-arrow-right"></i>
                </button>
            </form>

            {formik.touched.query && formik.errors.query && (
                <div className="text-danger mt-1 small ps-3">
                <CustomError name="query" form={formik} />
                </div>
            )}
        </div>

    </>
  );
};

export default AstroGPT;
