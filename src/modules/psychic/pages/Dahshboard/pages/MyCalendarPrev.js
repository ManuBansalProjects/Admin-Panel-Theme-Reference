import React, { useEffect, useState } from 'react';
import dayjs from "dayjs";
import cal1 from "../../../../../assets/website/images/cal1.svg"
import cal2 from "../../../../../assets/website/images/cal2.svg"
import cancelIcon from '../../../../../assets/website/images/icon-for-cancel.svg';
import { AddAvailability, CancelBooking, GetAvailability, psychicBookingList } from '../../../services/booking.services';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import { LOADER_TIMEOUT_TIME, SERVICES, SWAL_SETTINGS } from '../../../../../utils/Constants';
import { handleServerValidations } from '../../../../../utils/commonfunction';
import { TimePicker } from 'rsuite';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { getCmsPage } from '../../../services/common.services';

export default function MyCalendarPrev() {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState("week");
  const [timeFormat, setTimeFormat] = useState("AMPM");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookedSlotCount, setBookedSlotCount] = useState(0);
  const [availableSlotCount, setAvailableSlotCount] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [statsupdate, setStatusUpdate] = useState("false");
  const [availabilityUpdate, setAvailabilityUpdate] = useState("false");
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availabilitySlot, setAvailabilitySlot] = useState([]);
  const [loader, setLoader] = useState(false);
  const [cmsPage, setCmsPage] = useState({});

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

  useEffect(() => {
    GetAvailability()
      .then((response) => {
        let availability = response?.data;
        setAvailabilitySlot(availability);

        response?.data?.length > 0 && formik.setFieldValue("availability", response?.data);
      })
      .catch((err) => {
        console.log("Error fetching booking data: ", err);
      })
  }, [availabilityUpdate]);

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
    if (viewType === "day") return [selectedDate.format("YYYY-MM-DD")];
    if (viewType === "week")
      return Array.from(
        { length: 7 },
        (_, i) => selectedDate.startOf("week").add(i, "day").format("YYYY-MM-DD")
      );
    return [];
  };

  const dateHeaders = getDateHeaders();

  const getBookedSlot = (date, time) => {
    const { start_time, end_time } = time;

    const targetDate = new Date(date);
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    const slot = availabilityData?.find((slot) => {
      const slotDate = new Date(slot.date);

      const slotYear = slotDate.getFullYear();
      const slotMonth = slotDate.getMonth();
      const slotDay = slotDate.getDate();
      const slotHour = slotDate.getHours();
      const slotMinute = slotDate.getMinutes();

      const isSameDate = slotYear === targetYear && slotMonth === targetMonth && slotDay === targetDay;

      const isInTimeRange = (slotHour > startHour || (slotHour === startHour && slotMinute >= startMinute)) &&
        (slotHour < endHour || (slotHour === endHour && slotMinute < endMinute));

      return isSameDate && isInTimeRange;
    });

    return slot ? slot : { booking_status: 'available' };
  };

  // console.log("availabilitySlot---i->", availabilitySlot)
  const isSlotAvailable = (day, startTime) => {
    // console.log('Checking availability for day:', day, 'and start_time:', startTime);
    const dayAvailability = availabilitySlot?.length > 0 && availabilitySlot?.find((item) => item.day.toLowerCase() === day.toLowerCase());
    const startTimeDate = new Date(startTime);

    return (
      dayAvailability &&
      dayAvailability.slots.some((slot) => {
        // dayAvailability && console.log("=-->", day, startTimeDate, startTime, slot)
        const slotStart = new Date(slot.start_time);
        const slotEnd = new Date(slot.end_time);

        let slotStartHour = slotStart.getHours();
        let slotStartMinute = slotStart.getMinutes();
        let slotEndHour = slotEnd.getHours();
        let slotEndMinute = slotEnd.getMinutes();
        if (slotEndHour === 0 && slotEndMinute === 0) {
          slotEndHour = 24;
          slotEndMinute = 0;
        }

        const startTimeHour = startTimeDate.getHours();
        const startTimeMinute = startTimeDate.getMinutes();

        const isStartBeforeOrEqual = (slotStartHour < startTimeHour) || (slotStartHour === startTimeHour && slotStartMinute <= startTimeMinute);
        const isEndAfter = (slotEndHour > startTimeHour) || (slotEndHour === startTimeHour && slotEndMinute > startTimeMinute);

        return isStartBeforeOrEqual && isEndAfter;
      })
    );
  };

  useEffect(() => {
    let bookedCount = 0;
    let availableCount = 0;

    timeSlots.forEach((slot) => {
      dateHeaders.forEach((date) => {
        const dayOfWeek = dayjs(date).format('dddd');
        const bookedSlot = getBookedSlot(date, slot);
        const isAvailable = isSlotAvailable(dayOfWeek, slot?.start_time);

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

  const [isInvalidTime, setIsInvalidTime] = useState(false);

  function validateSlot(start_time, end_time) {
    const isInvalid = new Date(start_time) > new Date(end_time)
    // if(isInvalid !== isInvalidTime && isInvalid === true){
    //   console.log("Invalid slot-=-==-===->",isInvalid)
    //   setIsInvalidTime(isInvalid);
    // }
    return isInvalid;
  }



  const handleSlotClick = (bookedSlot) => {
    setSelectedSlotId(bookedSlot._id);
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
  return (
    <div className='dashboard-right-container'>
      <div className='dashboard-header d-flex justify-content-between'>
        <h2 className='heading-22-bold'>{t("sidebar_my_calender")}</h2>
        <button data-bs-toggle="modal" data-bs-target="#ManageAvailability" className='btn btn-primary'>{t("btn_manage_availability")}</button>
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
                  <img src={cal1} alt="why-choose-us" width="100%" />
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
                  <img src={cal2} alt="why-choose-us" width="100%" />
                </div>
              </div>
            </div>
          </div>
          {/* Calendar start */}
          <div className="calendar-container">

            {/* availability modal */}
            <div className="modal fade" id="ManageAvailability" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header d-flex justify-content-between align-items-center">
                    <h1 className="heading-20-bold" id="exampleModalLabel">{t("btn_manage_availability")}</h1>
                    <button type="button" className='close-btn-custom' data-bs-dismiss="modal" aria-label="Close">
                      <i className='ti ti-xbox-x'></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={formik.handleSubmit}>
                      <div className='manage-time'>
                        {formik.values.availability.map((dayAvailability, index) => (
                          <div key={index} className="manage-time-row">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name={`availability[${index}].is_available`}
                                checked={dayAvailability.is_available}
                                onChange={formik.handleChange}
                                id={`flexCheck${index}`}
                              />
                              <label className="form-check-label" htmlFor={`flexCheck${index}`}>
                                {dayAvailability.day}
                              </label>
                            </div>

                            {/* Manage slots for each day */}
                            <div className="manage-input">
                              {dayAvailability.slots.map((slot, slotIndex) => (
                                <div key={slotIndex} className=' d-flex flex-column'>
                                  <div className="manage-input-row">
                                    <div className="form-group m-0">
                                      <TimePicker
                                        container={() => document.getElementById('ManageAvailability')} // important!
                                        name={`availability[${index}].slots[${slotIndex}].start_time`}
                                        value={slot?.start_time ? new Date(slot.start_time) : null}
                                        format="HH:mm"
                                        className=""
                                        onChange={(value) => {
                                          const updatedSlots = [...dayAvailability.slots];
                                          updatedSlots[slotIndex].start_time = value;
                                          formik.setFieldValue(`availability[${index}].slots`, updatedSlots);
                                        }}
                                        placeholder={`${t("placeholder_start_time_for_slot")} ${slotIndex + 1}`}
                                        hideMinutes={minute => minute % 60 !== 0}
                                        editable={false}
                                      />
                                    </div>

                                    <div className="form-group m-0">
                                      <TimePicker
                                      container={() => document.getElementById('ManageAvailability')} // important!
                                        name={`availability[${index}].slots[${slotIndex}].end_time`}
                                        value={slot?.end_time ? new Date(slot.end_time) : null}
                                        format="HH:mm"
                                        // className=""
                                        onChange={(value) => {
                                          const updatedSlots = [...dayAvailability.slots];
                                          updatedSlots[slotIndex].end_time = value;
                                          formik.setFieldValue(`availability[${index}].slots`, updatedSlots);
                                        }}
                                        placeholder={`${t("placeholder_end_time_for_slot")} ${slotIndex + 1}`}
                                        hideMinutes={minute => minute % 60 !== 0}
                                        editable={false}
                                        showNow={false}
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      className="btn-circle"
                                      onClick={() => {
                                        const updatedSlots = [...dayAvailability.slots];
                                        updatedSlots.splice(slotIndex, 1);
                                        formik.setFieldValue(`availability[${index}].slots`, updatedSlots);
                                      }}
                                    >
                                      <i className="ti ti-x"></i>
                                    </button>
                                  </div>
                                  {/* <span className='text-danger'>{isInvalid ? "Invalid timing" : null}</span> */}
                                  {/* {console.log("-=-=-=-=-=--",slot?.end_time , slot?.end_time, "%%%", new Date(slot?.end_time) > new Date(slot?.end_time))} */}
                                  {/* <span className='text-danger'>{validateSlot((slot?.start_time), (slot?.end_time)) ? "Invalid timing" : null}</span> */}
                                </div>
                              ))}

                              <button
                                type="button"
                                className="add-text-button"
                                onClick={() => {
                                  formik.setFieldValue(`availability[${index}].slots`, [
                                    ...dayAvailability.slots,
                                    { start_time: null, end_time: null },
                                  ]);
                                }}
                              >
                                <i className="ti ti-plus"></i> Add More
                              </button>
                            </div>
                          </div>
                        ))}

                      </div>
                      <div className="modal-footer justify-content-start">
                        <button type="button" className="btn btn-border" data-bs-dismiss="modal">{t("btn_cancel")}</button>
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={isInvalidTime} >{t("btn_save")}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

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
                <button className='button-round-calendar' onClick={() => setSelectedDate(selectedDate.subtract(1, viewType))}>
                  <i className='ti ti-chevron-left'></i>
                </button>
                <p>{selectedDate.format(viewType === "day" ? "MMMM D, YYYY" : "MMMM YYYY")}</p>
                <button className='button-round-calendar' onClick={() => setSelectedDate(selectedDate.add(1, viewType))}>
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
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th>
                      <Skeleton width="100%" className="skeleton-header" />
                    </th>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <th key={index}>
                        <Skeleton width="100%" className="skeleton-header" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        <Skeleton width="100%" className="skeleton-time" />
                      </td>
                      {Array.from({ length: 7 }).map((_, colIndex) => (
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
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th><i className="ti ti-clock-hour-3"></i></th>
                    {/* <th>{t("label_time")}</th> */}
                    {dateHeaders.map((date) => (
                      <th style={{ width: "2rem" }} key={date}>{dayjs(date).format("ddd, MM/DD")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.start_time}>
                      <td>{dayjs(slot.start_time).format('HH:mm')}</td>
                      {dateHeaders.map((date) => {
                        const dayOfWeek = dayjs(date).format('dddd');
                        const bookedSlot = getBookedSlot(date, slot);

                        const isAvailable = isSlotAvailable(dayOfWeek, slot?.start_time);
                        const isBlocked = !isAvailable && bookedSlot.booking_status !== 'booked';

                        // CSS classes based on status
                        const cellClass = bookedSlot.booking_status === 'booked'
                          ? 'booked'
                          : isBlocked
                            ? 'blocked'
                            : 'available';

                        return (
                          <td key={date} className={cellClass}>
                            {bookedSlot.booking_status === "booked" && (
                              <div className=' text-center cp' data-bs-toggle="modal" data-bs-target="#modalCancel" onClick={() => handleSlotClick(bookedSlot)}>
                                {/* <div>{bookedSlot.booking_status}</div> */}
                                <div>{bookedSlot?.client?.name}</div>
                                <div>{SERVICES[bookedSlot?.service]}</div>
                              </div>
                            )}
                            {/* {bookedSlot.booking_status === 'available' && isAvailable && <div>{bookedSlot.booking_status}</div>}
                            {isBlocked && <div>Blocked</div>} */}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
          {/* Calendar end */}


          {/* Cancel modal */}
          <div className="modal fade" id="modalCancel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-body">
                  <div className='cancel-modal-info text-center p-6 px-16 d-flex flex-column gap-4'>
                    <figure className='mb-0'>
                      <img src={cancelIcon} alt="cancel" />
                    </figure>
                    <h4 className='heading-32-semibold'>{t("are_sure_cancel_booking")}</h4>
                    <div className='cancel-modal-btn-group d-flex gap-2 justify-content-center'>
                      <button type='button' className='btn btn-border' data-bs-dismiss="modal">{t("btn_no")}</button>
                      <button type='button' className='btn btn-primary' data-bs-dismiss="modal" onClick={handleYesClick}>{t("btn_yes")}</button>
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

        </div>
      </div>
    </div>
  )
}
