import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import profileImage from "./../../../../../assets/website/images/user2.jpg"
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const { t } = useTranslation();
  const psychicDetails = useSelector((state) => state?.psychicData?.data);

  return (
    <div className='sidebar'>
      <div className='sidebar-header'>
        <div className='card'>
          <div className='card-body d-flex gap-3'>
            <div className='avatar avatar-sm'>
              <img alt='avatar' src={psychicDetails?.profile_image} />
            </div>
            <div className='profile-info'>
              <h4 className='heading-16-bold'>{psychicDetails?.name}</h4>
              <p className='d-flex align-items-center gap-1'><span className='online-indicator active'></span>Available</p>
              <Link to={`/psychic/profile`} className='btn-text'>{t("edit_profile")}</Link>
            </div>
          </div>
        </div>
      </div>
      <div className='sidebar-body'>
        <div className='slider-menu mt-2'>
          <ul>
            <li>
              <NavLink to={`/psychic`} end>
                <i className='ti ti-table' aria-hidden="true"></i>
                <span>{t("sidebar_dashboard")}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`/psychic/my-calendar`}>
                <i className='ti ti-calendar-week' aria-hidden="true"></i>
                <span>{t("sidebar_my_calender")}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`/psychic/my-earnings`}>
                <i className='ti ti-star' aria-hidden="true"></i>
                <span>{t("sidebar_my_earnings")}</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={`/psychic/chat`}>
                <i className='ti ti-message' aria-hidden="true"></i>
                <span>{t("sidebar_chat")}</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink to={`/psychic/my-bookings`}>
                <i className='ti ti-calendar-check' aria-hidden="true"></i>
                <span>{t("sidebar_my_bookings")}</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={`/psychic/payment-history`}>
                <i className='ti ti-credit-card' aria-hidden="true"></i>
                <span>{t("sidebar_payment_history")}</span>
              </NavLink>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  )
}
