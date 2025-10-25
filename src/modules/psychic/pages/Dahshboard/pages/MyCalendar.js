import React, { useEffect, useRef, useState } from 'react';
import dayjs from "dayjs";
import cal1 from "../../../../../assets/website/images/cal1.svg"
import cal2 from "../../../../../assets/website/images/cal2.svg"
import cancelIcon from '../../../../../assets/website/images/icon-for-cancel.svg';
import { AddAvailability, CancelBooking, psychicBookingList } from '../../../services/booking.services';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import { LOADER_TIMEOUT_TIME, SERVICES, SWAL_SETTINGS } from '../../../../../utils/Constants';
import { handleServerValidations } from '../../../../../utils/commonfunction';
import { DatePicker } from 'rsuite';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { getCmsPage } from '../../../services/common.services';
import moment from 'moment';
import { CancelAvailability, GetAvailability, scheduleAvailability } from '../../../services/availability.services';
import CustomError from '../../../../../utils/customError';
import * as Yup from "yup";

export default function MyCalendar() {
  const { t } = useTranslation();
  const modalCloseBtnRef = useRef()
  const modalCancelBookingBtnRef = useRef()
  const [viewType, setViewType] = useState("week");
  const [timeFormat, setTimeFormat] = useState("AMPM");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookedSlotCount, setBookedSlotCount] = useState(0);
  const [availableSlotCount, setAvailableSlotCount] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [statsupdate, setStatusUpdate] = useState("false");
  const [availabilityUpdate, setAvailabilityUpdate] = useState("false");
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availabilitySlot, setAvailabilitySlot] = useState([]);
  const [loader, setLoader] = useState(false);
  const [cmsPage, setCmsPage] = useState({});
  const [slotStatus, setSlotStatus] = useState('');
  const [cancellationReason, setCancellationReason] = useState("");
  const [validationError, setValidationError] = useState("");

  const removeModalBackdrops = () => {
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach((item) => {
      item.remove();
    });
  };

  useEffect(() => {
    setLoader(true);
    psychicBookingList({ start_date: "", end_date: "" })
      .then((response) => {
        setAvailabilityData(response?.data?.list);
        setTimeout(() => {
          setLoader(false);
        }, LOADER_TIMEOUT_TIME);
      })
      .catch((err) => {
        setTimeout(() => {
          setLoader(false);
        }, LOADER_TIMEOUT_TIME);
        console.log("Error fetching booking data: ", err);
      })
  }, [statsupdate]);

  const fetchAvailability = () => {
    const formData = new FormData();
    const startDay = dateHeaders[0];
    const endDay = dateHeaders?.length === 1 ? dateHeaders[0] : dateHeaders[dateHeaders.length - 1];
    const startOfDay = moment(startDay).startOf("day").toISOString();
    const endOfDay = moment(endDay).endOf("day").toISOString();

    formData.append("start_date", startOfDay);
    formData.append("end_date", endOfDay);

    GetAvailability(formData)
      .then((response) => {
        const availability = response?.data;
        setAvailabilitySlot(availability);
        // Optionally set formik values here
      })
      .catch((err) => {
        console.error("Error fetching booking data:", err);
      });
  };

  useEffect(() => {
    // const formData = new FormData();
    // const startDay = dateHeaders[0];
    // const endDay = dateHeaders?.length === 1 ? dateHeaders[0] : dateHeaders[dateHeaders.length - 1];
    // const startOfDay = moment(startDay).startOf("day").toISOString();
    // const endOfDay = moment(endDay).endOf("day").toISOString();
    // formData.append("end_date", endOfDay);
    // formData.append("start_date", startOfDay);

    // const getAvailabilityApi = GetAvailability(formData)
    //   .then((response) => {
    //     let availability = response?.data;
    //     setAvailabilitySlot(availability);
    //     // response?.data?.length > 0 && formik.setFieldValue("availability", response?.data);
    //   })
    //   .catch((err) => {
    //     console.log("Error fetching booking data: ", err);
    //   });
    fetchAvailability();
  }, [availabilityUpdate, selectedDate, viewType]);

  // Generate time slots for a full 24-hour period (0 AM - 23 PM)
  // const timeSlots = Array.from({ length: 24 }, (_, i) => i); 
  const generateTimeSlots = (interval) => {
    const timeSlots = [];
    let startTime = dayjs().startOf('day');
    for (let i = 0; i < 24 * 60; i += interval) {
      const endTime = startTime.add(interval, 'minute');
      timeSlots.push({
        start_time: startTime.format(),
        end_time: endTime.format(),
      });
      startTime = endTime;
    }
    return timeSlots;
  };

  const timeSlots = generateTimeSlots(60);

  const getDateHeaders = () => {
    if (viewType === "day") {
      return [selectedDate.startOf("day").toDate().toISOString()];
    }

    if (viewType === "week") {
      return Array.from({ length: 7 }, (_, i) =>
        selectedDate.startOf("week").add(i, "day").toDate().toISOString()
      );
    }

    return [];
  };

  const dateHeaders = getDateHeaders();
  console.log("dateHeaders--------->", dateHeaders);

  // const getBookedSlot = (date, time) => {
  //   const { start_time, end_time } = time;

  //   const targetDate = new Date(date);
  //   const startTime = new Date(start_time);
  //   const endTime = new Date(end_time);

  //   const targetYear = targetDate.getFullYear();
  //   const targetMonth = targetDate.getMonth();
  //   const targetDay = targetDate.getDate();

  //   const startHour = startTime.getHours();
  //   const startMinute = startTime.getMinutes();
  //   const endHour = endTime.getHours();
  //   const endMinute = endTime.getMinutes();

  //   const slot = availabilityData?.find((slot) => {
  //     const slotDate = new Date(slot.date);

  //     const slotYear = slotDate.getFullYear();
  //     const slotMonth = slotDate.getMonth();
  //     const slotDay = slotDate.getDate();
  //     const slotHour = slotDate.getHours();
  //     const slotMinute = slotDate.getMinutes();

  //     const isSameDate = slotYear === targetYear && slotMonth === targetMonth && slotDay === targetDay;

  //     const isInTimeRange = (slotHour > startHour || (slotHour === startHour && slotMinute >= startMinute)) &&
  //       (slotHour < endHour || (slotHour === endHour && slotMinute < endMinute));

  //     return isSameDate && isInTimeRange;
  //   });

  //   return slot ? slot : { booking_status: 'available' };
  // };

  const getBookedSlot = (date, slot) => {
    const { start_time } = slot;

    const startDate = moment(date);
    const startTime = moment(start_time);

    const mergedDateTime = startDate
      .set('hour', startTime.hour())
      .set('minute', startTime.minute())
      .set('second', startTime.second());

    const mergedDateTimeUTC = mergedDateTime.utc();

    const result = availabilityData?.find((item) => {
      return (
        item.booking_status === "booked" &&
        item.date === mergedDateTimeUTC.toISOString()
      );
    });

    return result ? result : { booking_status: 'available' };
  };

  console.log("availabilitySlot---i->", availabilitySlot)
  const isSlotAvailable = (date, slot) => {
    const { start_time } = slot;

    const startDate = moment(date);
    const startTime = moment(start_time);

    const mergedDateTime = startDate
      .set('hour', startTime.hour())
      .set('minute', startTime.minute())
      .set('second', startTime.second());

    const mergedDateTimeUTC = mergedDateTime.utc();
    const isAvailable = availabilitySlot?.some(item => {

      return (
        item.availability_status === "available" &&
        item.date === mergedDateTimeUTC.toISOString()
      );
    });

    return isAvailable;
  };

  useEffect(() => {
    let bookedCount = 0;
    let availableCount = 0;

    timeSlots.forEach((slot) => {
      dateHeaders.forEach((date) => {
        const dayOfWeek = dayjs(date).format('dddd');
        const bookedSlot = getBookedSlot(date, slot);
        const isAvailable = isSlotAvailable(date, slot);

        if (bookedSlot.booking_status === 'booked') {
          bookedCount += 1;
        } else if (isAvailable) {
          availableCount += 1;
        }
      });
    });
    setBookedSlotCount(bookedCount);
    setAvailableSlotCount(availableCount);
  }, [timeSlots, dateHeaders]);

  // Function to format time to either 24-hour format or AM/PM format
  const formatTime = (time) => {
    if (timeFormat === "AMPM") {
      // Convert to AM/PM format (1:00, 2:00, etc.)
      const hour = time % 12 === 0 ? 12 : time % 12;
      const suffix = time < 12 ? "AM" : "PM";
      return `${hour}:00 ${suffix}`;
    } else {
      // 24-hour format (01:00, 02:00, etc.)
      return dayjs().hour(time).format("HH:00");
    }
  };

  // console.log("avavlity+++++++>>>>>", availabilitySlot)
  // console.log("selectedDate+++++++>>>>>", selectedDate)

  const validationSchema = Yup.object().shape({
    slot_type: Yup.string().required("Slot type is required"),
    recurring_end_date: Yup.date().nullable().test(
      "required-if-recurring",
      "Recurring end date is required",
      function (value) {
        const { slot_type } = this.parent;
        if (slot_type === "recurring") {
          return !!value;
        }
        return true;
      }
    ),
  });


  const availabilityFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: selectedSlot?.start_time ? selectedSlot?.start_time : "",
      availability_status: "available",
      slot_type: "",
      recurring_end_date: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("date", values.date);
      formData.append("availability_status", values.availability_status);
      formData.append("slot_type", values.slot_type);
      if (values.slot_type === "recurring") {
        formData.append("recurring_end_date", values.recurring_end_date);
      }
      modalCloseBtnRef?.current?.click();
      scheduleAvailability(formData)
        .then((response) => {
          if (response.success) {
            setAvailabilityUpdate(!availabilityUpdate);
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
          }
        })
        .catch((error) => {
          console.log("error--->", error);
        });
    },
  });

  const formik = useFormik({
    initialValues: {
      availability: [
        {
          day: 'Monday',
          is_available: false,
          slots: [
            {
              start_time: null,
              end_time: null
            }
          ],
        },
        {
          day: 'Tuesday',
          is_available: false,
          slots: [
            {
              start_time: null,
              end_time: null
            }
          ],
        },
        {
          day: 'Wednesday',
          is_available: false,
          slots: [
            {
              start_time: null,
              end_time: null
            }
          ],
        },
        {
          day: 'Thursday',
          is_available: false,
          slots: [
            {
              start_time: null,
              end_time: null
            }
          ],
        },
        {
          day: 'Friday',
          is_available: false,
          slots: [
            {
              start_time: null,
              end_time: null
            }
          ],
        },
        {
          day: 'Saturday',
          is_available: false,
          slots: [
            {
              start_time: null,
              end_time: null
            }
          ],
        },
        {
          day: 'Sunday',
          is_available: false,
          slots: [
            {
              start_time: null,
              end_time: null
            }
          ],
        },
      ]
    },
    onSubmit: (values) => {
      const data = { availability: values.availability };
      AddAvailability(data)
        .then((response) => {
          if (response.success) {
            setAvailabilityUpdate(!availabilityUpdate);
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });
          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
          }
        })
        .catch((error) => {
          console.log("error--->", error);
        });
    },
  });

  function handelOnSlotSchedule(date, slot) {
    console.log("date -->", date);
    console.log("slot -->", slot);

    // Parse the passed date in the local time zone
    const newDateStart = moment(date); // Date in local time
    const newDateEnd = moment(date); // Date in local time
    const startTime = moment(slot.start_time); // Start time in local time
    const endTime = moment(slot.end_time); // End time in local time

    // Merge the new date with the start and end times (without converting to UTC yet)
    const mergedStartTime = newDateStart
      .set('hour', startTime.hour())   // Set the same hour as in the start_time
      .set('minute', startTime.minute()) // Set the same minute as in the start_time
      .set('second', startTime.second()); // Set the same second as in the start_time

    const mergedEndTime = newDateEnd
      .set('hour', endTime.hour())   // Set the same hour as in the end_time
      .set('minute', endTime.minute()) // Set the same minute as in the end_time
      .set('second', endTime.second()); // Set the same second as in the end_time

    // Now, convert the merged start and end times to UTC for storage or further use
    const mergedStartTimeUTC = mergedStartTime.utc(); // Convert to UTC
    const mergedEndTimeUTC = mergedEndTime.utc(); // Convert to UTC

    // Output the merged start and end times in UTC format
    console.log("Merged Start Time (UTC) -->", mergedStartTimeUTC.toISOString());
    console.log("Merged End Time (UTC) -->", mergedEndTimeUTC.toISOString());

    // You can update your selectedSlot state with the new merged times in UTC format
    setSelectedSlot({
      start_time: mergedStartTimeUTC.toISOString(), // UTC format string
      end_time: mergedEndTimeUTC.toISOString() // UTC format string
    });
  }

  const handleSlotClick = (bookedSlot) => {
    setSelectedSlotId(bookedSlot._id);
  };

  const handleCancellationClick = async () => {
    if (!cancellationReason) {
      setValidationError(t("err_cancellation_reason_required"));
      return;
    }
    if (validationError !== "") return;

    if (selectedSlotId) {
      modalCancelBookingBtnRef?.current?.click();
      const formData = new FormData();
      formData.append("o_id", selectedSlotId);
      formData.append("cancellation_reason", cancellationReason);
      CancelBooking(formData)
        .then((response) => {
          setStatusUpdate(!statsupdate);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });

          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
          }
        })
        .catch((error) => {
          console.log("deleteError");
        });
    }
  };

  const handleYesClick = async () => {
    if (selectedSlotId) {
      CancelBooking(selectedSlotId)
        .then((response) => {
          setStatusUpdate(!statsupdate);
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });

          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
          }
        })
        .catch((error) => {
          console.log("deleteError");
        });
    }
  };
  const makeSlotUnavailable = async () => {
    if (selectedSlot.start_time) {
      CancelAvailability(selectedSlot.start_time)
        .then((response) => {
          fetchAvailability();
          if (response.success) {
            Swal.fire({
              icon: "success",
              text: response.message,
              ...SWAL_SETTINGS,
            });

          } else {
            Swal.fire({
              icon: "error",
              text: handleServerValidations(response),
              ...SWAL_SETTINGS,
            });
          }
        })
        .catch((error) => {
          console.log("deleteError");
        });
    }
  };

  const cancelPolicy = () => {
    getCmsPage("psychic_booking_cancel_policy")
      .then((response) => {
        setCmsPage(response?.data[0])
      })
      .catch((err) => {
        console.log("Error fetching privacy policy: ", err);
      })
  };

  // console.log("formik value-->", formik.values)
  console.log("availabilityFormik formic value-->", availabilityFormik.values)
  return (
    <div className='dashboard-right-container'>
      <div className='dashboard-header d-flex justify-content-between'>
        <h2 className='heading-22-bold'>{t("sidebar_my_calender")}</h2>
      </div>
      <div className='dashboard-body'>
        <div className='d-flex flex-column gap-4'>
          <div className='row dashboard-info-card'>
            <div className='col-md-6'>
              <div className='dashboard-info-card-item'>
                <div className='dashboard-info-card-text'>
                  <p>{t("booked_slots")}</p>
                  <h4 className='heading-20-medium'>{bookedSlotCount}</h4>
                </div>
                <div className='dashboard-card-figure'>
                  <img src={cal1} alt="booked-slots" width="100%" />
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='dashboard-info-card-item'>
                <div className='dashboard-info-card-text'>
                  <p>{t("available_slots")}</p>
                  <h4 className='heading-20-medium'>{availableSlotCount}</h4>
                </div>
                <div className='dashboard-card-figure'>
                  <img src={cal2} alt="available-slots" width="100%" />
                </div>
              </div>
            </div>
          </div>
          {/* Calendar start */}
          <div className="calendar-container">
            <div className='calender-status'>
              <ul className='d-flex align-items-center justify-content-center p-0'>
                <li><span className='status-point available-status'></span>{t("label_available")}</li>
                <li><span className='status-point booked-status'></span>{t("label_booked")}</li>
                <li><span className='status-point blocked-status'></span>{t("label_blocked")}</li>
              </ul>
            </div>
            <div className="calendar-header">
              <button className={`btn border ${viewType === "day" && selectedDate.isSame(dayjs(), 'day') ? "active" : ""}`} onClick={() => { setViewType("day"); setSelectedDate(dayjs()) }}>{t("btn_today")}</button>
              <div className='d-flex gap-3 align-items-center date-center'>
                <button aria-label="Previous" className='button-round-calendar' onClick={() => setSelectedDate(selectedDate.subtract(1, viewType))}>
                  <i className='ti ti-chevron-left'></i>
                </button>
                <p>{selectedDate.format(viewType === "day" ? "MMMM D, YYYY" : "MMMM YYYY")}</p>
                <button aria-label="Next" className='button-round-calendar' onClick={() => setSelectedDate(selectedDate.add(1, viewType))}>
                  <i className='ti ti-chevron-right'></i>
                </button>
              </div>
              <div className="calender-day-week-btn">
                <button className={viewType === "week" ? "active" : ""} onClick={() => setViewType("week")}>{t("btn_week")}</button>
                <button className={viewType === "day" ? "active" : ""} onClick={() => setViewType("day")}>{t("btn_day")}</button>
              </div>
            </div>

            {loader ?
              // table skeleton start
             
              <table className="calendar-table table-scroll ">
                <thead>
                  <tr>
                    <th>
                      <Skeleton width="100%" className="skeleton-header" />
                    </th>
                    {Array.from({ length: 7 })?.map((_, index) => (
                      <th key={index}>
                        <Skeleton width="100%" className="skeleton-header" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 })?.map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        <Skeleton width="100%" className="skeleton-time" />
                      </td>
                      {Array.from({ length: 7 })?.map((_, colIndex) => (
                        <td key={colIndex}>
                          <Skeleton width="100%" height={40} className="skeleton-cell" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
           
              // table skeleton end
              :
              <div className='table-responsive'>
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th><i className="ti ti-clock-hour-3" aria-hidden="true"></i></th>
                    {/* <th>{t("label_time")}</th> */}
                    {dateHeaders?.map((date) => (
                      <th style={{ width: "2rem" }} key={date}>{dayjs(date).format("ddd, MM/DD")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots?.map((slot) => (
                    <tr key={slot.start_time}>
                      <td>{dayjs(slot.start_time).format('HH:mm')}</td>
                      {dateHeaders?.map((date) => {
                        const bookedSlot = getBookedSlot(date, slot);
                        // console.log("booked slots --->", bookedSlot.booking_status === 'booked' && bookedSlot)

                        const isAvailable = isSlotAvailable(date, slot);

                        // CSS classes based on status
                        const cellClass = bookedSlot.booking_status === 'booked'
                          ? 'booked'
                          : isAvailable
                            ? 'available'
                            : 'blocked';

                        return (
                          <td key={date} className={cellClass} style={{ padding: 0, height: 'auto', verticalAlign: 'middle' }}>
                            {bookedSlot.booking_status != "booked" && (
                              <div
                                className='text-center cp w-100 h-100'
                                style={{ height: '100%' }}
                                data-bs-toggle="modal"
                                data-bs-target={cellClass === "available" ? "#modalCancel" : "#modalManageSchedule"}
                                onClick={() => { setSlotStatus(cellClass); handelOnSlotSchedule(date, slot); }}
                              >&nbsp;</div>
                            )}
                            {/* {bookedSlot.booking_status === "booked" && (
                              <div className=' text-center cp' data-bs-toggle="modal" data-bs-target="#modalCancel" onClick={() => { handleSlotClick(bookedSlot); setSlotStatus(cellClass); }}>
                                <div>{bookedSlot?.client?.name}</div>
                                <div>{SERVICES[bookedSlot?.service]}</div>
                              </div>
                            )} */}
                            {bookedSlot.booking_status === "booked" && (
                            (() => {
                              const bookingDate = new Date(bookedSlot.date);
                              const today = new Date();

                              const isFutureBooking = bookingDate >= today;
                              return (
                                <div
                                  className={`text-center cp ${!isFutureBooking ? 'disabled' : ''}`}
                                  {...(isFutureBooking && {
                                    "data-bs-toggle": "modal",
                                    "data-bs-target": "#modalCancel",
                                    onClick: () => {
                                      handleSlotClick(bookedSlot);
                                      setSlotStatus(cellClass);
                                    },
                                  })}
                                >
                                  <div>{bookedSlot?.client?.name}</div>
                                  <div>{SERVICES[bookedSlot?.service]}</div>
                                </div>
                              );
                            })()
                          )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            }
          </div>
          {/* Calendar end */}


          {/* cancel confirmation modal */}
          <div className="modal fade" id="modalCancel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-body">
                  <div className='cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4'>
                    <figure className='mb-0'>
                      <img src={cancelIcon} alt="cancel" />
                    </figure>
                    {/* <h4 className='heading-32-semibold'>{t("are_sure_cancel_booking")}</h4> */}
                    <h4 className='heading-32-semibold'>{t(`are_sure_cancel_${slotStatus === "booked" ? "booking" : "available"}`)}</h4>
                    <div className='cancel-modal-btn-group d-flex gap-2 justify-content-center'>
                      <button type='button' className='btn btn-border' data-bs-dismiss="modal" >{t("btn_no")}</button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (slotStatus === "booked") {
                            setCancellationReason("");
                          } else {
                            makeSlotUnavailable();
                          }
                        }}
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                        {...(slotStatus === "booked"
                          ? {
                            'data-bs-toggle': 'modal',
                            'data-bs-target': '#modalCancelReason'
                          }
                          : {})}
                      >
                        {t("btn_yes")}
                      </button>

                    </div>
                    <div className='btn-text cp' onClick={cancelPolicy} data-bs-toggle="modal" data-bs-target="#modalCancelPolicy">{t("cancellation_policy")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* cancel reason input modal */}
          <div className="modal fade" id="modalCancelReason" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="modal-header d-flex justify-content-between align-items-center">
                    <h1 className="heading-20-bold" id="exampleModalLabel">{t("Cancel booking")}</h1>
                    <button ref={modalCancelBookingBtnRef} type="button" className='close-btn-custom' data-bs-dismiss="modal" aria-label="Close">
                      <i className='ti ti-xbox-x' aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className='cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4'>
                    <figure className='mb-0'>
                      <img src={cancelIcon} alt="cancel" />
                    </figure>
                    {/* <h4 className='heading-32-semibold'>{t("are_sure_cancel_booking hiiiiiiii")}</h4> */}
                    <div className=''>
                      <label htmlFor="cancellation_reason" className='form-label'>{t("label_cancellation_reason")}</label>
                      <input
                        className='form-control'
                        type='text'
                        name='cancellation_reason'
                        id='cancellation_reason'
                        value={cancellationReason}
                        placeholder={t("placeholder_cancel_reason")}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCancellationReason(value);

                          const trimmedValue = value.trim();
                          if (trimmedValue.length === 0) {
                            setValidationError(t("cancellation_reason_is_required"));
                          } else if (trimmedValue.length > 200) {
                            setValidationError(t("cancellation_reason_characters_limit_200"));
                          } else if (!/[a-zA-Z]/.test(trimmedValue)) {
                            setValidationError(t("cancellation_reason_include_at_least_one_letter"));
                          } else {
                            setValidationError("");
                          }
                        }}

                      />
                      {validationError && (
                        <div className="validation-error text-danger">
                          {validationError}
                        </div>
                      )}
                    </div>
                    <div className='cancel-modal-btn-group d-flex gap-2 justify-content-center'>
                      <button type='button' onClick={handleCancellationClick} className='btn btn-primary'>{t("btn_submit")}</button>
                      <button type='button' className='btn btn-border' data-bs-dismiss="modal" >{t("btn_cancel")}</button>
                    </div>
                    <div className='btn-text cp' onClick={cancelPolicy} data-bs-toggle="modal" data-bs-target="#modalCancelPolicy">{t("cancellation_policy")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade" id="modalCancelPolicy" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-body">
                  <div className='cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4'>
                    <h4 className='heading-32-semibold'>{cmsPage?.title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: cmsPage?.description }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* manage schedule */}
          <div className="modal fade" id="modalManageSchedule" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <form onSubmit={availabilityFormik.handleSubmit}>
                  <div className="modal-header d-flex justify-content-between align-items-center">
                    <h1 className="heading-20-bold" id="exampleModalLabel">{t("btn_manage_schedule")}</h1>
                    <button ref={modalCloseBtnRef} type="button" className='close-btn-custom' data-bs-dismiss="modal" aria-label="Close">
                      <i className='ti ti-xbox-x' aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    {/* {console.log("=-=selectedSlot date time ---", selectedSlot)} */}
                    <p className="mb-3"><strong>{moment(selectedSlot?.start_time).format('dddd, YYYY/MM/DD')}</strong></p>

                    <div className="mb-3">
                      <i className="fas fa-clock me-1" aria-hidden="true"></i>
                      {moment(selectedSlot?.start_time).format('h:mm A')} - {moment(selectedSlot?.end_time).format('h:mm A')}
                    </div>

                    {/* Slot type selection */}

                    <div className="mb-3">
                      <label className="form-label">{t("slot_type")}</label>
                      <div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="slot_type"
                            id="one_time"
                            onChange={availabilityFormik.handleChange}
                            value="one_time"
                            checked={availabilityFormik?.values?.slot_type === "one_time"}
                          />
                          <label className="form-check-label" htmlFor="one_time">
                            {t("slot_type_one_time")}
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="slot_type"
                            id="recurring"
                            onChange={availabilityFormik.handleChange}
                            value="recurring"
                            checked={availabilityFormik?.values?.slot_type === "recurring"}
                          />
                          <label className="form-check-label" htmlFor="recurring">
                            {t("slot_type_recurring")} {moment(selectedSlot?.start_time).format('dddd')}
                          </label>
                        </div>
                        <CustomError className={"text-danger"} name="slot_type" form={availabilityFormik} />
                      </div>
                    </div>



                    {/* DatePicker for selecting end date */}
                    {availabilityFormik?.values?.slot_type === "recurring" &&
                      <div className="mb-3">
                        <label htmlFor="endDate" className="form-label">{t("select_end_date")}</label>
                        <DatePicker
                          id="endDate"
                          name="end_date"
                          oneTap={true}
                          block
                          format="dd-MM-yyyy"
                          cleanable={false}
                          editable={false}
                          value={availabilityFormik.values.end_date}
                          shouldDisableDate={(date) => date < new Date()}  // Disable past dates
                          onChange={(value) => availabilityFormik.setFieldValue('recurring_end_date', moment(value).endOf("day").toISOString())}
                        />
                        <CustomError className={"text-danger"} name="recurring_end_date" form={availabilityFormik} />
                      </div>
                    }

                  </div>
                  <div className="modal-footer justify-content-start">
                    <button type="button" className="btn btn-border" data-bs-dismiss="modal">{t("btn_cancel")}</button>
                    <button type="submit" className="btn btn-primary" id='schedule' data-bs-dismiss="" >{t("btn_save")}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
