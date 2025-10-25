import React, { useEffect, useRef, useState } from 'react'
import { getDashboardData, psychicEarningsByDate, psychicFeedbackList, psychicOverAllRating } from '../../../services/dashboard.services';
import { capitalizeFirstLetter, formateDate, getDate } from '../../../../../utils/commonfunction';
import { Link, useNavigate } from 'react-router-dom';
import { LOADER_TIMEOUT_TIME } from '../../../../../utils/Constants';
import { psychicUpcomingBookingList } from '../../../services/booking.services';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { DateRangePicker } from 'rsuite';
import logo from '../../../../../assets/admin/img/calenderLogo.png';

export default function PsychicDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [overAllRating, setOverAllRating] = useState({});
  const [bookingData, setBookingData] = useState({});
  const [itemPerPage] = useState(4);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [ratingLoader, setRatingLoader] = useState(false);
  const chartRef = useRef(null);
  const [earningDataByDate, setEarningDataByDate] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [selectedDate, setSelectedDate] = useState({
    start_date: moment().subtract(30, 'days').startOf('day'),
    end_date: moment().endOf('day'),
  });
  const figRef = useRef(null);
  const [accessibleSummary, setAccessibleSummary] = useState('');

  useEffect(() => {
    if (earningDataByDate.length > 0) {
      const earningsText = earningDataByDate
        .map(entry => `${entry.date}: €${entry.totalAmount.toFixed(2)}`)
        .join('. ');
      const fullText = `${t("label_earnings_from")} ${selectedDate.start_date.format("DD MMM YYYY")} ${t("label_to")} ${selectedDate.end_date.format("DD MMM YYYY")}. ${t("label_total_entries")}: ${earningDataByDate.length}. ${earningsText}`;
      setAccessibleSummary(fullText);

      // Optional: move screen reader focus to figcaption
      setTimeout(() => {
        figRef.current?.focus();
      }, 100);
    }
  }, [earningDataByDate, selectedDate, t]);


  useEffect(() => {
    psychicFeedbackList({ "page": 1, "per_page": 5 })
      .then(feedbacks => {
        setFeedbacks(feedbacks?.data?.list);
      })
      .catch(err => {
        console.log("error ====>", err);
      })
    setRatingLoader(true);
    psychicOverAllRating()
      .then((rating) => {
        setOverAllRating(rating?.data)
        setTimeout(() => {
          setRatingLoader(false)
        }, LOADER_TIMEOUT_TIME);
      })
      .catch(err => {
        console.log("error ====>", err);
        setTimeout(() => {
          setRatingLoader(false)
        }, LOADER_TIMEOUT_TIME);
      })
  }, []);

  useEffect(() => {
    setLoader(true);
    const formData = new FormData();
    formData.append("page", page);
    formData.append("per_page", itemPerPage);
    psychicUpcomingBookingList(formData)
      .then((response) => {
        setBookingData(response?.data?.list);
        setTimeout(() => {
          setLoader(false);
        }, LOADER_TIMEOUT_TIME);
      })
      .catch((error) => {
        console.log('Error fetching booking data: ', error);
        setTimeout(() => {
          setLoader(false);
        }, LOADER_TIMEOUT_TIME);
      })
  }, []);

  useEffect(() => {
    getDashboardData()
      .then((response) => {
        setDashboardData(response?.data);
      })
      .catch((err) => {
        console.log("Error===>", err);
      })
  }, []);

  function currentBooking(bookingDate) {
    const bookingUtc = new Date(bookingDate).toISOString();
    const currentUtc = new Date().toISOString();
    return bookingUtc <= currentUtc;
  }

  useEffect(() => {
    psychicEarningsByDate({ selected_date: selectedDate })
      .then((response) => {
        console.log("earnings-=-=-->", response);
        setEarningDataByDate(response?.data?.list)
      })
      .catch((error) => {
        console.log("Error-=-==>", error)
      })
  }, [selectedDate]);

  // Set up your chart options
  const options = {
    chart: {
      id: "chartId",
      height: 280,
      type: 'area',
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: []
        },
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#FDD39E', '#32F474'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        gradientToColors: ['#FDD39E'],
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100, 90],

        // opacityFrom: 0.7,
        // opacityTo: 0.9,
        // stops: [0, 90, 100],
      }
    },
    xaxis: {
      type: 'datetime',
      categories: earningDataByDate ? earningDataByDate?.map((item) => item?.date) : [],
      // min: earningData && earningData.length > 0 ? new Date(earningData[0].date).getTime() : undefined
    },
    yaxis: {
      labels: {
        formatter: (value) => `€ ${value?.toFixed(2)}`, // Format the y-axis labels with the Yen symbol
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return `(€ ${value?.toFixed(2)})`; // Adds brackets around the value
        }
      },

      followCursor: true,
      intersect: false,
    },
    legend: {
      position: 'top'
    },
    grid: {
      show: true,
      borderColor: '#EEE',
      strokeDashArray: 2,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    },
    markers: {
      size: 3,
      colors: ['#fff'],
      strokeColors: ['#5A045A', '#008000'],
      strokeWidth: 1,
      fillOpacity: 1,
      hover: {
        size: undefined,
        sizeOffset: 0
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    }
  };

  // Populate the series with the data from the `earningData`
  const series = [
    {
      name: t('title_amount'),
      data: earningDataByDate ? earningDataByDate?.map((item) => item?.totalAmount) : []
    },
  ];

  const CustomBase64Caret = () => (
    <img
      src={logo}
      alt="Custom Caret"
      style={{ width: 20, height: 20 }}
    />
  );

  const handleJoin = (booking) => {
    if (booking?.mode_of_consultation.toLowerCase() === 'chat') {
      navigate(`/psychic/chat/${booking._id}?receiverID=${booking?.client?._id}`, {
        state: { receiver: booking?.client },
      });
    } else {
      navigate('/psychic/meeting');
    }
  };

  return (
    <div className='dashboard-right-container' id="dashboard-right-container" tabIndex="-1">
      <div className='dashboard-header'>
        <h2 className='heading-22-bold'>{t("link_dashboard")}</h2>
      </div>
      <div className='dashboard-body'>
        <div className='d-flex flex-column gap-4'>
          <div className='row dashboard-info-card'>
            <div className='col-md-4'>
              <div className='dashboard-info-card-item'>
                <p>{t("dashboard_today_schedule")}</p>
                <h4 className='heading-20-medium'>{dashboardData?.todayBookings ? dashboardData?.todayBookings : 0 } {t("dashboard_tab_session")}</h4>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='dashboard-info-card-item'>
                <p>{t('dashboard_total_earnings')}</p>
                <h4 className='heading-20-medium'>$ {dashboardData?.totalEarning ? dashboardData?.totalEarning?.toFixed(2) : 0 }</h4>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='dashboard-info-card-item'>
                <p>{t("dashboard_total_sessions")}</p>
                <h4 className='heading-20-medium'>{dashboardData?.totalBookings ? dashboardData?.totalBookings : 0 } {t("dashboard_tab_session")}</h4>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="chart-container">
              <div className='d-flex justify-content-between'>
                <h4 className='heading-18-semibold'>{t("label_my_earning")}</h4>
                <div className='d-flex gap-1'>
                  <button onClick={() => setSelectedDate({ start_date: moment().subtract(7, 'days').startOf("day"), end_date: moment(), duration: "week" })} className='btn btn-secondary'>{t("btn_last7_days")}</button>
                  <button onClick={() => setSelectedDate({ start_date: moment().subtract(30, 'days').startOf("day"), end_date: moment(), duration: "month" })} className='btn btn-secondary'>{t("btn_last30_days")}</button>
                  <DateRangePicker
                    format="dd-MM-yyyy"
                    cleanable={true}
                    placeholder={t("menu_of_page_custom")}
                    classPrefix="userInput"
                    caretAs={CustomBase64Caret}
                    value={
                      selectedDate.duration === "custom"
                        ? [selectedDate.start_date.toDate(), selectedDate.end_date.toDate()]
                        : null
                    }
                    onChange={(value) => {
                      if (value) {
                        setSelectedDate({
                          start_date: moment(value[0]).startOf("day"),
                          end_date: moment(value[1]).endOf("day"),
                          duration: "custom",
                        });
                      } else {
                        setSelectedDate({
                          start_date: null,
                          end_date: null,
                          duration: null,
                        });
                      }
                    }}
                  />

                </div>
              </div>
              {/* <ReactApexChart ref={chartRef} options={options} series={series} type="area" height={350} className="dayReport" /> */}
              <figure>
                <figcaption
                  ref={figRef}
                  tabIndex="-1"
                  className="sr-only"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {accessibleSummary}
                </figcaption>

                <div
                  role="img"
                  aria-label={`Earnings from ${selectedDate.start_date.format("DD MMM YYYY")} to ${selectedDate.end_date.format("DD MMM YYYY")}. Total entries: ${earningDataByDate.length}`}
                >
                  <ReactApexChart
                    ref={chartRef}
                    options={options}
                    series={series}
                    type="area"
                    height={350}
                    className="dayReport"
                  />
                </div>

                <table className="sr-only">
                  <caption>{t("caption_my_earnings_over_time")}</caption>
                  <thead>
                    <tr>
                      <th scope="col">{t("table_header_date")}</th>
                      <th scope="col">{t("table_header_earnings_euro")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningDataByDate.map((entry, idx) => (
                      <tr key={idx}>
                        <td>{entry.date}</td>
                        <td>€ {entry.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            </div>
          </div>

          {/* upcomming bookings */}

          {bookingData?.length > 0 &&
            <div className='upcoming-appointment-sec'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h4 className='heading-18-semibold'>{t("label_upcoming_appointments")}</h4>
                <Link to='/psychic/my-bookings' className=' btn-text'>{t("link_view_all")}</Link>
              </div>
              { }
              <div className='row row-gap-3 appointment-list'>
                {loader ?
                  <div className='row row-gap-3 appointment-list'>
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className='col-md-6'>
                        <div className='upcoming-appointment-card d-flex gap-3'>
                          <figure className='avatar avatar-md'>
                            <Skeleton circle height={50} width={50} />
                          </figure>
                          <figcaption className='d-flex flex-column gap-1'>
                            <Skeleton width="150px" height="20px" />
                            <Skeleton width="100px" height="15px" />
                            <Skeleton width="120px" height="15px" />
                          </figcaption>
                          <div className='appointment-card-action d-flex flex-column gap-2 justify-content-between'>
                            <Skeleton width="100px" height="15px" />
                            <Skeleton width="80px" height="30px" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  :
                  bookingData?.map((booking) => (
                    <div className='col-md-6'>
                      <div className='upcoming-appointment-card d-flex gap-3'>
                        <figure className='avatar avatar-md'>
                          <img alt='avatar' src={booking?.client?.profile_image} />
                        </figure>
                        <figcaption className='d-flex flex-column gap-1'>
                          <h4 className='heading-18-semibold'>{capitalizeFirstLetter(booking?.client?.name)}</h4>
                          <p className='m-0'>{getDate(booking?.date)}</p>
                          <p className='m-0'>{t("consultation")}: {capitalizeFirstLetter(booking?.mode_of_consultation)}</p>
                        </figcaption>
                        <div className='appointment-card-action d-flex flex-column gap-2 justify-content-between'>
                          <span className='d-block text-end'>{t("duration")}: 1 {t("label_hour")}</span>
                          {
                            currentBooking(booking?.date) &&
                            <button className="btn btn-primary" onClick={() => handleJoin(booking)}>
                              {t("btn_join")}
                            </button>
                          } 
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          }

          {/* Over all rating section  */}

          {overAllRating && overAllRating?.total_feedbacks > 0 &&
            <div className='dashboard-rating-sec'>
              <h4 className='heading-18-semibold mb-3'>{t("label_overall_rating")}</h4>
              {ratingLoader ? <div className='rating-info-box'>
                <div className='rating-info-item'>
                  <h2><Skeleton width="50px" height="30px" /></h2>
                  <div className='rating-start mt-3'>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} circle width={20} height={20} style={{ display: 'inline-block', margin: '0 3px' }} />
                    ))}
                  </div>
                  <span><Skeleton width="60px" height="20px" /></span>
                </div>
                <div className='rating-bars'>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div className='rating-bar-item' key={star}>
                      <span><Skeleton width="10px" height="15px" /></span>
                      <div className="progress" role="progressbar" aria-valuemax="100" >
                        <div className="progress-bar">
                          <Skeleton />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                :
                <div className='rating-info-box'>
                  <div className='rating-info-item'>
                    <h2>{overAllRating?.average_rating}</h2>
                    <div className='rating-start mt-3'>
                      {Array.from({ length: 5 }).map((_, index) => {
                        const isFullStar = index < Math.floor(overAllRating?.average_rating);
                        const isHalfStar = index === Math.floor(overAllRating?.average_rating) && overAllRating?.average_rating % 1 >= 0.5;

                        return (
                          <i
                            key={index}
                            className={`ti ${isFullStar ? 'ti-star-filled' : isHalfStar ? 'ti-star-half-filled' : 'ti-star'}`}
                          ></i>
                        );
                      })}
                    </div>
                    <span>{overAllRating?.total_feedbacks}</span>
                  </div>
                  <div className='rating-bars'>
                    <div className='rating-bar-item'>
                      <span>5</span>
                      <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                        <div className="progress-bar" style={{ width: `${overAllRating?.star_5_percent}%` }}></div>
                      </div>
                    </div>
                    <div className='rating-bar-item'>
                      <span>4</span>
                      <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                        <div className="progress-bar" style={{ width: `${overAllRating?.star_4_percent}%` }}></div>
                      </div>
                    </div>
                    <div className='rating-bar-item'>
                      <span>3</span>
                      <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                        <div className="progress-bar" style={{ width: `${overAllRating?.star_3_percent}%` }}></div>
                      </div>
                    </div>
                    <div className='rating-bar-item'>
                      <span>2</span>
                      <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                        <div className="progress-bar" style={{ width: `${overAllRating?.star_2_percent}%` }}></div>
                      </div>
                    </div>
                    <div className='rating-bar-item'>
                      <span>1</span>
                      <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                        <div className="progress-bar" style={{ width: `${overAllRating?.star_1_percent}%` }}></div>
                      </div>
                    </div>
                  </div>

                </div>
              }
            </div>
          }

          {/* Customer feedback  */}

          {feedbacks?.length > 0 &&
            <div className='customer-feedback-sec'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h4 className='heading-18-semibold'>{t("label_customer_feedback")}</h4>
                <Link to='/psychic/feedback' className='btn-text'>{t("link_view_all")}</Link>
              </div>
              <div className='customer-feedback-list d-flex flex-column gap-3 '>
                {feedbacks?.map((feedback) => (
                  <div className='feedback-list-card'>
                    <div className='feedback-list-card-header d-flex gap-3'>
                      <figure className="avatar avatar-sm"><img alt='avatar' src={feedback?.client_details?.profile_image} /></figure>
                      <figcaption className='w-100'>
                        <div className='d-flex align-items-center justify-content-between gap-2 mb-1'>
                          <h4 className="heading-16-semibold">{capitalizeFirstLetter(feedback.client_details?.name)}</h4>
                          <span>{formateDate(feedback?.createdAt)}</span>
                        </div>
                        <div className='rating-start'>
                          {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <i
                              key={rowIndex}
                              className={`ti ${rowIndex < feedback?.rating ? 'ti-star-filled' : 'ti-star'}`}
                            ></i>
                          ))}
                        </div>

                      </figcaption>
                    </div>
                    <div className='feedback-list-card-footer'>
                      <p className="m-0">{feedback?.feedback_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
