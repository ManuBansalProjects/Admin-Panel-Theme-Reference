import React, { useEffect, useState, useCallback, useRef } from "react";
import { psychicFeedbackList, psychicOverAllRating } from "../../../services/dashboard.services";
import { capitalizeFirstLetter, formateDate } from "../../../../../utils/commonfunction";
import { useTranslation } from "react-i18next";

export default function Feedback() {
    const { t } = useTranslation();
    const [feedbacks, setFeedbacks] = useState([]);
    const [overAllRating, setOverAllRating] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [showTopButton, setShowTopButton] = useState(false);

    const observerRef = useRef(null);

    const loadFeedbacks = useCallback(() => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        psychicFeedbackList({ page })
            .then((feedbacks) => {
                const newFeedbacks = feedbacks?.data?.list;
                setFeedbacks((prevFeedbacks) => [...prevFeedbacks, ...newFeedbacks]);

                setTotalFeedbacks(feedbacks?.data?.total_records || 0);
                setHasMore(newFeedbacks.length > 0 && feedbacks?.data?.list.length < totalFeedbacks);
                setPage((prevPage) => prevPage + 1);
            })
            .catch((err) => {
                console.log("Error fetching feedbacks:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [isLoading, hasMore, page, totalFeedbacks]);

    useEffect(() => {
        loadFeedbacks();
        psychicOverAllRating()
            .then((rating) => {
                setOverAllRating(rating?.data);
            })
            .catch((err) => {
                console.log("Error fetching overall rating:", err);
            });
    }, []);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0,
        };

        if (observerRef.current) {
            const observer = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !isLoading) {
                    loadFeedbacks();
                }
            }, options);

            observer.observe(observerRef.current);

            // Cleanup observer on unmount
            return () => observer.disconnect();
        }
    }, [hasMore, isLoading, loadFeedbacks]);

    useEffect(() => {
        const handleScroll = () => {
            setShowTopButton(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const container = document.querySelector(".feedback-body");

        if (!container) return;

        const handleScroll = () => {
            setShowTopButton(container.scrollTop > 300);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="dashboard-right-container">
            <div className="sticky-buttons">
                {showTopButton && (
                    <button
                        className="btn-icon"
                        title={t("label_go_to_top") || "Go to top"}
                        onClick={() => {
                            const container = document.querySelector(".dashboard-body");
                            if (container) container.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        ⬆️
                    </button>
                )}
                <button className="btn-icon" title={t("label_go_back") || "Go back"} onClick={() => window.history.back()}>
                    🔙
                </button>
            </div>

            <div className="dashboard-header">
                <h2 className="heading-22-bold text-center">{t("label_customer_feedback")}</h2>
            </div>
            <div className="dashboard-body feedback-body" tabIndex={0}>
                <div className="d-flex flex-column gap-4">
                    <div className="dashboard-rating-sec">
                        <h4 className="heading-18-semibold mb-3">{t("label_overall_rating")}</h4>
                        <div className="rating-info-box">
                            <div className="rating-info-item">
                                <h2>{overAllRating?.average_rating}</h2>
                                <div className="rating-start mt-3">
                                    {Array.from({ length: 5 }).map((_, index) => {
                                        const isFullStar = index < Math.floor(overAllRating?.average_rating);
                                        const isHalfStar = index === Math.floor(overAllRating?.average_rating) && overAllRating?.average_rating % 1 >= 0.5;

                                        return <i key={index} className={`ti ${isFullStar ? "ti-star-filled" : isHalfStar ? "ti-star-half-filled" : "ti-star"}`}></i>;
                                    })}
                                </div>
                                <span>{overAllRating?.total_feedbacks}</span>
                            </div>
                            <div className="rating-bars">
                                <div className="rating-bar-item">
                                    <span>5</span>
                                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                                        <div className="progress-bar" style={{ width: `${overAllRating?.star_5_percent}%` }}></div>
                                    </div>
                                </div>
                                <div className="rating-bar-item">
                                    <span>4</span>
                                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                                        <div className="progress-bar" style={{ width: `${overAllRating?.star_4_percent}%` }}></div>
                                    </div>
                                </div>
                                <div className="rating-bar-item">
                                    <span>3</span>
                                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                                        <div className="progress-bar" style={{ width: `${overAllRating?.star_3_percent}%` }}></div>
                                    </div>
                                </div>
                                <div className="rating-bar-item">
                                    <span>2</span>
                                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                                        <div className="progress-bar" style={{ width: `${overAllRating?.star_2_percent}%` }}></div>
                                    </div>
                                </div>
                                <div className="rating-bar-item">
                                    <span>1</span>
                                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                                        <div className="progress-bar" style={{ width: `${overAllRating?.star_1_percent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="customer-feedback-sec">
                        <div className="customer-feedback-list d-flex flex-column gap-3">
                            {feedbacks?.map((feedback, index) => (
                                <div key={feedback?.id || index} className="feedback-list-card" ref={feedbacks.length === index + 1 ? observerRef : null}>
                                    <div className="feedback-list-card-header d-flex gap-3">
                                        <figure className="avatar avatar-sm">
                                            <img alt="user profile" src={feedback?.client_details?.profile_image} />
                                        </figure>
                                        <figcaption className="w-100">
                                            <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                                                <h4 className="heading-16-semibold">{capitalizeFirstLetter(feedback.client_details?.name)}</h4>
                                                <span>{formateDate(feedback?.createdAt)}</span>
                                            </div>
                                            <div className="rating-start">
                                                {Array.from({ length: 5 }).map((_, rowIndex) => (
                                                    <i key={rowIndex} className={`ti ${rowIndex < feedback?.rating ? "ti-star-filled" : "ti-star"}`}></i>
                                                ))}
                                            </div>
                                        </figcaption>
                                    </div>
                                    <div className="feedback-list-card-footer">
                                        <p className="m-0">{feedback?.feedback_text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {isLoading && <div>Loading...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
