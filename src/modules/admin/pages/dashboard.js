import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as dashboardService from "../services/dashboard.services";
import { useTranslation } from "react-i18next";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";

const Dashboard = () => {
    const chartRef = useRef(null);
    const { t } = useTranslation();
    const [filter, setFilter] = useState("lastMonth");
    const [showDashboardCount, setShowDashboardCount] = useState({});
    const [earningDateWise, setEarningDateWise] = useState([]);
    const [bookingDateWise, setBookingDateWise] = useState([]);

    useEffect(() => {
        dashboardService
            .Counts()
            .then((response) => {
                setShowDashboardCount(response && response.data ? response.data : {});
            })
            .catch((error) => {
                console.log("error ====> ", error);
            });
    }, []);

    useEffect(() => {
        dashboardService
            .DateWiseTransaction()
            .then((response) => {
                const rawData = response?.data?.list || [];
                const filteredData = filterDataByRange(rawData, filter);
                const aggregated = shouldGroupByMonth(filter) ? groupByMonth(filteredData) : filteredData;
                setEarningDateWise(aggregated);
            })
            .catch((error) => {
                console.log("error ====> ", error);
            });
    }, [filter]);

    useEffect(() => {
        dashboardService
            .DateWiseBooking()
            .then((response) => {
                const rawData = response?.data?.list || [];
                const filteredData = filterDataByRange(rawData, filter);
                const aggregated = shouldGroupByMonth(filter) ? groupByMonth(filteredData) : filteredData;
                setBookingDateWise(aggregated);
            })
            .catch((error) => {
                console.log("error ====> ", error);
            });
    }, [filter]);

    const filterDataByRange = (data, rangeType) => {
        const now = dayjs();
        let startDate;

        switch (rangeType) {
            case "lastWeek":
                startDate = now.subtract(7, "day");
                break;
            case "lastMonth":
                startDate = now.subtract(1, "month");
                break;
            case "last2Months":
                startDate = now.subtract(2, "month");
                break;
            case "last6Months":
                startDate = now.subtract(6, "month");
                break;
            case "lastYear":
                startDate = now.subtract(1, "year");
                break;
            default:
                startDate = now.subtract(1, "month");
        }

        return data.filter((item) => dayjs(item.date).isAfter(startDate));
    };

    const shouldGroupByMonth = (filter) => filter === "last6Months" || filter === "lastYear";

    // Grouping earnings by month
    const groupByMonth = (data) => {
        const grouped = {};

        data.forEach((item) => {
            const monthKey = dayjs(item.date).format("YYYY-MM");
            if (!grouped[monthKey]) {
                grouped[monthKey] = { date: monthKey, totalAmount: 0 };
            }
            grouped[monthKey].totalAmount += item.totalAmount;
        });

        return Object.values(grouped);
    };

    const formattedCategories = earningDateWise.map((item) => {
        return shouldGroupByMonth(filter)
            ? dayjs(item.date).format("MMM YYYY") // Month format
            : dayjs(item.date).format("YYYY-MM-DD"); // Exact date
    });

    const options = {
        chart: {
            id: "chartId",
            height: 280,
            type: "area",
            zoom: {
                enabled: false,
            },
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
                    customIcons: [],
                },
                autoSelected: "zoom",
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: ["#7e8af2"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                gradientToColors: ["#FDD39E"],
                inverseColors: true,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 100, 90],
            },
        },
        xaxis: {
            categories: formattedCategories,
            labels: {
                rotate: -45,
            },
        },
        yaxis: {
            labels: {
                formatter: (value) => `€ ${value.toFixed(2)}`,
            },
        },
        tooltip: {
            y: {
                formatter: (value) => `(€ ${value.toFixed(2)})`,
            },
            followCursor: true,
            intersect: false,
        },
        legend: {
            position: "top",
        },
        grid: {
            show: true,
            borderColor: "#EEE",
            strokeDashArray: 2,
            position: "back",
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        markers: {
            size: 3,
            colors: ["#fff"],
            strokeColors: ["#5A045A", "#008000"],
            strokeWidth: 1,
            fillOpacity: 1,
            hover: {
                size: undefined,
                sizeOffset: 0,
            },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
    };
    const bookingOptions = {
        chart: {
            id: "chartId",
            height: 280,
            type: "area",
            zoom: {
                enabled: false,
            },
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
                    customIcons: [],
                },
                autoSelected: "zoom",
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: ["#4CAF50"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                gradientToColors: ["#A5D6A7"],
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 100, 90],
            },
        },
        xaxis: {
            categories: formattedCategories,
            labels: { rotate: -45 },
        },
        yaxis: {
            labels: {
                formatter: (value) => Math.round(value).toString(),
            },
        },
        tooltip: {
            y: {
                formatter: (value) => `${Math.round(value)} bookings`,
            },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
    };

    const series = [
        {
            name: "Earnings",
            data: earningDateWise.map((item) => item.totalAmount),
        },
    ];
    const bookingSeries = [
        {
            name: "Bookings",
            data: bookingDateWise.map((item) => item.count),
        },
    ];

    // useEffect(() => {
    //   dashboardService
    //     .DateWiseTransaction()
    //     .then((response) => {
    //       setEarningDateWise(response && response.data ? response?.data?.list : []);
    //     })
    //     .catch((error) => {
    //       console.log("error ====> ", error);
    //     });
    // }, []);

    //  // Set up your chart options
    // const options = {
    //   chart: {
    //     id: "chartId",
    //     height: 280,
    //     type: 'area',
    //     toolbar: {
    //       show: true,
    //       offsetX: 0,
    //       offsetY: 0,
    //       tools: {
    //         download: false,
    //         selection: false,
    //         zoom: false,
    //         zoomin: false,
    //         zoomout: false,
    //         pan: false,
    //         reset: false,
    //         customIcons: []
    //       },
    //       autoSelected: 'zoom'
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   colors: ['#7e8af2', '#32F474'],
    //   fill: {
    //     type: 'gradient',
    //     gradient: {
    //       shadeIntensity: 1,
    //       gradientToColors: ['#FDD39E'],
    //       inverseColors: true,
    //       opacityFrom: 0.7,
    //       opacityTo: 0.3,
    //       stops: [0, 100, 90],

    //       // opacityFrom: 0.7,
    //       // opacityTo: 0.9,
    //       // stops: [0, 90, 100],
    //     }
    //   },
    //   xaxis: {
    //     type: 'datetime',
    //     categories: earningDateWise ? earningDateWise?.map((item) => item?.date) : [],
    //   },
    //   yaxis: {
    //     labels: {
    //       formatter: (value) => `€ ${value?.toFixed(2)}`, // Format the y-axis labels with the Yen symbol
    //     },
    //   },
    //   tooltip: {
    //     y: {
    //       formatter: function (value) {
    //         return `(€ ${value?.toFixed(2)})`; // Adds brackets around the value
    //       }
    //     },

    //     followCursor: true,
    //     intersect: false,
    //   },
    //   legend: {
    //     position: 'top'
    //   },
    //   grid: {
    //     show: true,
    //     borderColor: '#EEE',
    //     strokeDashArray: 2,
    //     position: 'back',
    //     xaxis: {
    //       lines: {
    //         show: true
    //       }
    //     },
    //     yaxis: {
    //       lines: {
    //         show: true
    //       }
    //     },
    //   },
    //   markers: {
    //     size: 3,
    //     colors: ['#fff'],
    //     strokeColors: ['#5A045A', '#008000'],
    //     strokeWidth: 1,
    //     fillOpacity: 1,
    //     hover: {
    //       size: undefined,
    //       sizeOffset: 0
    //     }
    //   },
    //   stroke: {
    //     curve: 'smooth',
    //     width: 2
    //   }
    // };

    // // Populate the series with the data
    // const series = [
    //   {
    //     name: t('title_amount'),
    //     data: earningDateWise ? earningDateWise?.map((item) => item?.totalAmount) : []
    //   },
    // ];

    return (
        <>
            <div className="row row-sm animation_fade">
                <div className="col-sm-12 col-lg-12 col-xl-12">
                    <div className="row row-sm">

                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                            <div className="card custom-card">
                                <div className="card-body cp">
                                    <Link to={`/admin/user-management/user/list/1`}>
                                        <div className="card-item">
                                            <div className="card-item-icon card-icon cp ">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" className="bi bi-people-fill" viewBox="0 0 16 16">
                                                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                                </svg>
                                            </div>
                                            <div className="card-item-title mb-2">
                                                <label className="main-content-label tx-13 font-weight-bold mb-1">{t("sidebar_link_users")}</label>
                                            </div>
                                            <div className="card-item-body">
                                                <div className="card-item-stat">
                                                    <h4 className="font-weight-bold">{showDashboardCount && showDashboardCount?.users?.total_users ? showDashboardCount?.users?.total_users : "0"}</h4>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-3">
                                                <div className="card-item-title mb-2">
                                                    <label className="main-content-label tx-13 font-weight-bold mb-1">Active: {showDashboardCount?.users?.active_users || 0}</label>
                                                </div>
                                                <div className="card-item-title mb-2">
                                                    <label className="main-content-label tx-13 font-weight-bold mb-1">In-Active: {showDashboardCount?.users?.inactive_users || 0}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                            <div className="card custom-card">
                                <div className="card-body cp">
                                    <Link to={``}>
                                        <div className="card-item">
                                            <div className="card-item-icon card-icon cp">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="currentColor" className="bi bi-bookmarks-fill">
                                                    <path d="M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4ZM4 6v12h16V6H4Zm9 3h4v2h-4V9Zm0 4h4v2h-4v-2Z" />
                                                </svg>
                                            </div>

                                            <div className="card-item-title mb-2">
                                                <label className="main-content-label tx-13 font-weight-bold mb-1">Active Subscriptions</label>
                                            </div>
                                            <div className="card-item-body">
                                                <div className="card-item-stat">
                                                    <h4 className="font-weight-bold">{showDashboardCount?.subscriptions?.active_subscriptions || "0"}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4">
                            <div className="card custom-card">
                                <div className="card-body cp">
                                    <Link to={``}>
                                        <div className="card-item">
                                            <div className="card-item-icon card-icon cp">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="currentColor" className="bi bi-bookmarks-fill">
                                                    <path d="M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4ZM4 6v12h16V6H4Zm9 3h4v2h-4V9Zm0 4h4v2h-4v-2Z" />
                                                </svg>
                                            </div>

                                            <div className="card-item-title mb-2">
                                                <label className="main-content-label tx-13 font-weight-bold mb-1">Total Revenue</label>
                                            </div>
                                            <div className="card-item-body">
                                                <div className="card-item-stat">
                                                    <h4 className="font-weight-bold">{showDashboardCount?.transactions?.total_revenue || '0'}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/*
                        <div col-12>
                            <div className="row" style={{ marginBottom: "10px" }}>
                                <div className="col-auto">
                                    <select className="form-select cp" onChange={(e) => setFilter(e.target.value)}>
                                        <option value="lastMonth">Last Month</option>
                                        <option value="lastWeek">Last Week</option>
                                        <option value="last6Months">Last 6 Months</option>
                                        <option value="lastYear">Last Year</option>
                                    </select>
                                </div>
                            </div>
                            <ReactApexChart ref={chartRef} options={options} series={series} type="area" height={350} className="dayReport" />
                            <h4 className="text-center">Earnings</h4>
                            <hr className="my-2 py-4"></hr>
                            <ReactApexChart ref={chartRef} options={bookingOptions} series={bookingSeries} type="area" height={350} className="dayReport" />
                            <h4 className="text-center">Bookings</h4>
                            <hr className="my-2 py-4"></hr>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
