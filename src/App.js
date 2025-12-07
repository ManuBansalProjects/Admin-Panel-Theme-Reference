import { Navigate, createBrowserRouter } from "react-router-dom";

/**ADMIN ROUTE START */
import AdminLayout from "./modules/admin/shared/adminlayout";
import Login from "./modules/admin/pages/login";
import PrivateRoute from "./modules/admin/shared/privateRoute";
import PublicRoute from "./modules/admin/shared/publicRoute";
import Profile from "./modules/admin/pages/profile";
import EditProfile from "./modules/admin/pages/editprofile";
import Changepassword from "./modules/admin/pages/changepassword";
import OtpVerificationPage from "./modules/admin/pages/otpverification";
import ForgotPwdPage from "./modules/admin/pages/forgotpassword";
import ResetPwdPage from "./modules/admin/pages/resetpwd";
import Error404 from "./modules/admin/pages/404";
import Dashboard from "./modules/admin/pages/dashboard";
import EmailTemplatesTable from "./modules/admin/pages/cms/automaticemailtemplates/list";
import EmailTempAdd from "./modules/admin/pages/cms/automaticemailtemplates/add";
import EmailTempEdit from "./modules/admin/pages/cms/automaticemailtemplates/edit";
import ViewEmailTemp from "./modules/admin/pages/cms/automaticemailtemplates/view";
import PageTable from "./modules/admin/pages/cms/pages/list";
import PageAdd from "./modules/admin/pages/cms/pages/add";
import PageEdit from "./modules/admin/pages/cms/pages/edit";
import PageView from "./modules/admin/pages/cms/pages/view";
import GlobalSettings from "./modules/admin/pages/cms/settings/settings";


import CompleteAdminProfile from "./modules/admin/pages/completeAdminProfile";

import InvoiceDesign from "./modules/admin/pages/invoiceDesign";
import AdminUnAuthLayout from "./modules/admin/shared/adminUnAuthLayout";
import WebsiteLayout from "./modules/website/shared/layout";
import WebsiteHomePage from "./modules/website/pages/homePage";
import WebsiteAboutUs from "./modules/website/pages/websiteAboutUs";
import WebsiteContactUs from "./modules/website/pages/websiteContactUs";
import WebsiteServices from "./modules/website/pages/websiteServices";
import WebsitePrivacyPolicy from "./modules/website/pages/privacyPolicy";
import WebsiteTermsCondition from "./modules/website/pages/termsCondition";
import Faq from "./modules/website/pages/Faq";
import Page404 from "./modules/website/pages/Page404";
import FAQAdd from "./modules/admin/pages/cms/faq/add";
import FAQEdit from "./modules/admin/pages/cms/faq/edit";
import FAQTable from "./modules/admin/pages/cms/faq/list";
import FAQView from "./modules/admin/pages/cms/faq/view";
import ContactUsTable from "./modules/admin/pages/contactUs/list";
import ViewContactUs from "./modules/admin/pages/contactUs/view";
import PsychicLayout from "./modules/psychic/shared/layout";
import PsychicLogin from "./modules/psychic/pages/PsychicLogin";
import PsychicDashboardLayout from "./modules/psychic/pages/Dahshboard/shared/PsychicDashboardLayout";
import PsychicDashboard from "./modules/psychic/pages/Dahshboard/pages/PsychicDashboard";
import MyCalendar from "./modules/psychic/pages/Dahshboard/pages/MyCalendar";
import MyEarnings from "./modules/psychic/pages/Dahshboard/pages/MyEarnings";
import Chat from "./modules/psychic/pages/Dahshboard/pages/Chat";
import MyBookings from "./modules/psychic/pages/Dahshboard/pages/MyBookings";
import PsychicProfile from "./modules/psychic/pages/PsychicProfile";
import ChangePassword from "./modules/psychic/pages/ChangePassword";
import CustomerFeedback from "./modules/psychic/pages/CustomerFeedback";
import PaymentHistory from "./modules/psychic/pages/Dahshboard/pages/PaymentHistory";
import Notification from "./modules/psychic/pages/Notification";
import PsychicUserTable from "./modules/admin/pages/psychic/list";
import PsychicUserView from "./modules/admin/pages/psychic/view";
import PsychicUserAdd from "./modules/admin/pages/psychic/add";
import PsychicUserEdit from "./modules/admin/pages/psychic/edit";
import InquiryTable from "./modules/admin/pages/inquiry/list";
import ViewInquiry from "./modules/admin/pages/inquiry/view";
import WebsiteInquiry from "./modules/website/pages/websiteInquiry";
import PsychicPrivateRoute from "./modules/psychic/shared/PsychicPrivateRoute";
import QuestionAdd from "./modules/admin/pages/cms/questionSet/add";
import QuestionTable from "./modules/admin/pages/cms/questionSet/list";
import QuestionView from "./modules/admin/pages/cms/questionSet/view";
import QuestionEdit from "./modules/admin/pages/cms/questionSet/edit";
import PsychicPublicRoute from "./modules/psychic/shared/PsychicPublicRoute";
import ForgetPasswordPsychic from "./modules/psychic/pages/auth/forgetPassword";
import PsychicAuthLayout from "./modules/psychic/shared/PsychicAuthLayout";
import PsychicVerifyOtp from "./modules/psychic/pages/auth/OtpVarifivation";
import PsychicResetPassword from "./modules/psychic/pages/auth/PsychicResetPassword";
import UserTable from "./modules/admin/pages/user/list";
import UserView from "./modules/admin/pages/user/view";
import DynamicWebPage from "./modules/website/pages/dynamicPage";
import UserEdit from "./modules/admin/pages/user/edit";
import AboutUsAdd from "./modules/admin/pages/cms/aboutUs/add";
import Feedback from "./modules/psychic/pages/Dahshboard/pages/Feedback";
import NotificationPage from "./modules/psychic/pages/Notification";
import SubscriptionPlanTable from "./modules/admin/pages/subscriptionPlan/list";
import AddSubscriptionPlan from "./modules/admin/pages/subscriptionPlan/add";
import EditSubscriptionPlan from "./modules/admin/pages/subscriptionPlan/edit";
import SubscriptionPlanView from "./modules/admin/pages/subscriptionPlan/view";
import SubscriptionFeature from "./modules/admin/pages/subscription/subscriptionFeatures";
import MyCalendarTest from "./modules/psychic/pages/Dahshboard/pages/MyCalendarPrev";
import ServiceTable from "./modules/admin/pages/cms/services/list";
import ServiceAdd from "./modules/admin/pages/cms/services/add";
import ServiceEdit from "./modules/admin/pages/cms/services/edit";
import ServiceView from "./modules/admin/pages/cms/services/view";
import WebsiteHomeAdd from "./modules/admin/pages/cms/home/add";
import PayableTransactionTable from "./modules/admin/pages/payableTransaction/list";
import MyBookingView from "./modules/psychic/pages/Dahshboard/pages/MyBookingView";
import PayoutTransactionTable from "./modules/admin/pages/payoutTransaction/list";
import QuestionnaireStats from "./modules/admin/pages/questionnaire/QuestionnaireStats";
import SubscriptionBenefit from "./modules/admin/pages/subscription/subscriptionBenefit";
import { Agora } from "./modules/website/pages/agora";
import { Meeting } from "./modules/psychic/pages/Dahshboard/pages/Meeting";
import Messages from "./modules/psychic/pages/Dahshboard/pages/Messages";
import Videocall from "./modules/psychic/pages/Dahshboard/pages/Videocall";
import SessionPaymentChart from "./modules/website/pages/Test";
import TransactionTable from "./modules/admin/pages/transaction/list";
import CouponTable from "./modules/admin/pages/coupons/list";
import AddCoupon from "./modules/admin/pages/coupons/add";
import EditCoupon from "./modules/admin/pages/coupons/edit";
import CouponView from "./modules/admin/pages/coupons/view";
import UserAdd from "./modules/admin/pages/user/add";
import SubscriptionHistoryTable from "./modules/admin/pages/subscriptionHistory/list";
import SubscriptionHistoryView from "./modules/admin/pages/subscriptionHistory/view";
import ViewTransaction from "./modules/admin/pages/transaction/view";
import UserSubscriptionHistoryTable from "./modules/admin/pages/user/user-subscription-history";
import UserSubscriptionHistoryDetails from "./modules/admin/pages/user/user-subscription-details";
import ReferralSettings from "./modules/admin/pages/referral/settings";
import AstroGPT from "./modules/admin/pages/Testing/astrogpt";
import PromotionsList from "./modules/admin/pages/cms/promotions/list";
import BlogAdd from "./modules/admin/pages/cms/blogs/add";
import BlogTable from "./modules/admin/pages/cms/blogs/list";
import BlogEdit from "./modules/admin/pages/cms/blogs/edit";
import BlogView from "./modules/admin/pages/cms/blogs/view";
import PromotionEdit from "./modules/admin/pages/cms/promotions/edit";
import PromotionView from "./modules/admin/pages/cms/promotions/view";
import PromotionAdd from "./modules/admin/pages/cms/promotions/add";
import TestimonialAdd from "./modules/admin/pages/testimonial/add";
import TestimonialView from "./modules/admin/pages/testimonial/view";
import TestimonialTable from "./modules/admin/pages/testimonial/list";
import TestimonialEdit from "./modules/admin/pages/testimonial/edit";
import PersonalizationCategoriesList from "./modules/admin/pages/personalizationCategories/list";
import PersonalizationCategoryEdit from "./modules/admin/pages/personalizationCategories/edit";
import ReferralHistoryTable from "./modules/admin/pages/referral/referral_history";

const router = createBrowserRouter([

  // { path: "/inquiry", element: <Enquire /> },


  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      {
        path: "",
        element: <WebsiteHomePage />,
      },
      { path: "/about-us", element: <WebsiteAboutUs /> },
      { path: "/contact-us", element: <WebsiteContactUs /> },
      { path: "/inquiry", element: <WebsiteInquiry /> },
      { path: "/services", element: <WebsiteServices /> },
      { path: "/privacy-policy", element: <WebsitePrivacyPolicy /> },
      { path: "/terms-conditions", element: <WebsiteTermsCondition /> },
      { path: "/faq", element: <Faq /> },
      { path: "/org-info/:slug", element: <DynamicWebPage /> },
      { path: "/agora", element: <Agora /> }, //seperate testing component for development purpose
      { path: "/test", element: <SessionPaymentChart /> }, // for test
      { path: "*", element: <Page404 /> },
    ],
  },

  // Psychic auth start
  {
    path: "psychic",
    element: <PsychicPublicRoute component={PsychicAuthLayout} />,
    children: [
      {
        path: "/psychic/login",
        element: <PsychicPublicRoute component={PsychicLogin} />,
      },
      {
        path: "/psychic/forget-password",
        element: <PsychicPublicRoute component={ForgetPasswordPsychic} />,
      },
      {
        path: "/psychic/otp-verification",
        element: <PsychicPublicRoute component={PsychicVerifyOtp} />,
      },
      {
        path: "/psychic/reset-password",
        element: <PsychicPublicRoute component={PsychicResetPassword} />,
      },
    ]
  },
    // Psychic auth end

  {
    path: "/psychic",
    element: <PsychicPrivateRoute component={PsychicLayout} />,
    children: [
      {
        path: "",
        element: <PsychicDashboardLayout />,
        children:[
          { path: "", element: <PsychicPrivateRoute component={PsychicDashboard} /> },
          { path: "feedback", element: <PsychicPrivateRoute component={Feedback} /> },
          { path: "my-calendar", element: <PsychicPrivateRoute component={MyCalendar} /> },
          { path: "my-calendar-test", element: <PsychicPrivateRoute component={MyCalendarTest} /> },
          { path: "my-earnings", element: <PsychicPrivateRoute component={MyEarnings} /> },
          // { path: "chat/:roomID?", element: <PsychicPrivateRoute component={Chat} /> },
          { path: "chat/:roomID?", element: <PsychicPrivateRoute component={Messages} /> },
          { path: "my-bookings", element: <PsychicPrivateRoute component={MyBookings} /> },
          { path: "my-booking-view/:id", element: <PsychicPrivateRoute component={MyBookingView} /> },
          { path: "my-booking-view/meeting", element: <PsychicPrivateRoute component={Meeting} /> },
          { path: "payment-history", element: <PsychicPrivateRoute component={PaymentHistory} /> },
        ]
      },
      { path: "profile", element: <PsychicPrivateRoute component={PsychicProfile} /> },
      { path: "change-password", element: <PsychicPrivateRoute component={ChangePassword} /> },
      { path: "customer-feedback", element: <PsychicPrivateRoute component={CustomerFeedback} /> },
      { path: "notification", element: <PsychicPrivateRoute component={NotificationPage} /> },
      { path: "video-call", element: <PsychicPrivateRoute component={Videocall} /> },
      { path: "meeting", element: <PsychicPrivateRoute component={Videocall} /> },
      { path: "*", element: <Page404 /> },
    ],
  },

  /**ADMIN ROUTE START */
  {
    path: "admin",
    element: <PrivateRoute component={AdminLayout} />,
    children: [
      {
        path: "",
        element: <Navigate to={"/admin/dashboard"} />,
      },
      {
        path: "dashboard",
        element: <PrivateRoute component={Dashboard} />,
      },
      {
        path: "invoice-design",
        element: <PrivateRoute component={InvoiceDesign} />,
      },
      {
        path: "profile",
        // element: <Profile />,
        element: <PrivateRoute component={Profile} />,
        children: [
          {
            path: "edit/:id",
            // element: <EditProfile />,
            element: <PrivateRoute component={EditProfile} />,
          },
          {
            path: "change-password/:id",
            // element: <Changepassword />,
            element: <PrivateRoute component={Changepassword} />,
          },
        ],
      },
      {
        /** Psychic User management route start */
      },
      {
        path: "psychic-management/psychic/list/:pgno",
        element: <PsychicUserTable />,
      },
      {
        path: "psychic-management/psychic/view/:id",
        element: <PsychicUserView />,
      },
      {
        path: "psychic-management/psychic/add",
        element: <PsychicUserAdd />,
      },
      {
        path: "psychic-management/psychic/:pgno/edit/:id",
        element: <PsychicUserEdit />,
      },
      {
        /** Psychic User management route end */
      },

      {
        /**  User management route start */
      },
      {
        path: "user-management/user/list/:pgno",
        element: <UserTable />,
      },
      {
        path: "user-management/user/view/:id/:pgno",
        element: <UserView />,
      },
      {
        path: "user-management/user/add",
        element: <UserAdd />,
      },
      {
        path: "user-management/user/:pgno/edit/:id",
        element: <UserEdit />,
      },
      {
        path: "user-management/user/:userListPgno/subscription-history/list/:pgno/:id",
        element: <UserSubscriptionHistoryTable />,
      },
      {
        path: "user-management/user/:userListPgno/subscription-history/:pgno/:userId/view/:id",
        element: <UserSubscriptionHistoryDetails/>,
      },

      {
        /** User management route end */
      },

      {
        /**contact-us route start */
      },
      {
        path: "contact-us/list/:pgno",
        element: <PrivateRoute component={ContactUsTable} />,
      },
      {
        path: "contact-us/view/:id",
        element: <PrivateRoute component={ViewContactUs} />,
      },
      {
        /**contact-us route end */
      },

      /* transaction start */
      // {
      //   path: "payable-transaction/list/:pgno",
      //   element: <PrivateRoute component={PayableTransactionTable} />
      // },
      // {
      //   path: "transaction/list/:pgno",
      //   element: <PrivateRoute component={PayoutTransactionTable} />
      // },
     
      /* transaction end */

      /* Questionnaire stats start */
      {
        path: "questionnaire-stats",
        element: <PrivateRoute component={QuestionnaireStats} />
      },
      /* Questionnaire stats end */

      // Inquiry

      {
        path: "inquiry/list/:pgno",
        element: <PrivateRoute component={InquiryTable} />,
      },
      {
        path: "inquiry/view/:id",
        element: <PrivateRoute component={ViewInquiry} />,
      },

       // Inquiry

      {
        path: "cms/pages/list/:pgno",
        element: <PrivateRoute component={PageTable} />,
      },
      {
        path: "cms/pages/add",
        element: <PrivateRoute component={PageAdd} />,
      },
      {
        path: "cms/pages/:pgno/edit/:id",
        element: <PrivateRoute component={PageEdit} />,
      },
      {
        path: "cms/pages/view/:id",
        element: <PrivateRoute component={PageView} />,
      },

      // Question

      {
        path: "cms/question/list/:pgno",
        element: <PrivateRoute component={QuestionTable} />,
      },
      {
        path: "cms/question/add",
        element: <PrivateRoute component={QuestionAdd} />,
      },
      {
        path: "cms/question/:pgno/edit/:id",
        element: <PrivateRoute component={QuestionEdit} />,
      },
      {
        path: "cms/question/view/:id",
        element: <PrivateRoute component={QuestionView} />,
      },

      // Services

      {
        path: "cms/services/list/:pgno",
        element: <PrivateRoute component={ServiceTable} />,
      },
      {
        path: "cms/services/add",
        element: <PrivateRoute component={ServiceAdd} />,
      },
      {
        path: "cms/services/:pgno/edit/:id",
        element: <PrivateRoute component={ServiceEdit} />,
      },
      {
        path: "cms/services/view/:id",
        element: <PrivateRoute component={ServiceView} />,
      },

       // About Us

      //  {
      //   path: "cms/question/list/:pgno",
      //   element: <PrivateRoute component={QuestionTable} />,
      // },
      {
        path: "cms/about-us",
        element: <PrivateRoute component={AboutUsAdd} />,
      },
      // {
      //   path: "cms/question/:pgno/edit/:id",
      //   element: <PrivateRoute component={QuestionEdit} />,
      // },
      // {
      //   path: "cms/question/view/:id",
      //   element: <PrivateRoute component={QuestionView} />,
      // },

      // cms home

      {
        path: "cms/web-home",
        element: <PrivateRoute component={WebsiteHomeAdd} />,
      },

      // FAQ

      {
        path: "cms/faq/list/:pgno",
        element: <PrivateRoute component={FAQTable} />,
      },
      {
        path: "cms/faq/add",
        element: <PrivateRoute component={FAQAdd} />,
      },
      {
        path: "cms/faq/:pgno/edit/:id",
        element: <PrivateRoute component={FAQEdit} />,
      },
      {
        path: "cms/faq/view/:id",
        element: <PrivateRoute component={FAQView} />,
      },

      {
        path: "cms/settings",
        element: <PrivateRoute component={GlobalSettings} />,
      },

      {
        path: "cms/default-email-template/list/:pgno",
        element: <PrivateRoute component={EmailTemplatesTable} />,
      },
      {
        path: "cms/default-email-template/add",
        element: <PrivateRoute component={EmailTempAdd} />,
      },
      {
        path: "cms/default-email-template/:pgno/edit/:id",
        element: <PrivateRoute component={EmailTempEdit} />,
      },
      {
        path: "cms/default-email-template/view/:id",
        element: <PrivateRoute component={ViewEmailTemp} />,
      },
      /** Email Logs Routing End*/

      /* Promotions */
      {
        path: "cms/promotions/list/:pgno",
        element: <PrivateRoute component={PromotionsList} />,
      },
      {
        path: "cms/promotions/add",
        element: <PrivateRoute component={PromotionAdd} />,
      },
      {
        path: "cms/promotions/:pgno/edit/:id",
        element: <PrivateRoute component={PromotionEdit} />,
      },
      {
        path: "cms/promotions/view/:id",
        element: <PrivateRoute component={PromotionView} />,
      },

      /* Blogs */
      {
        path: "cms/blogs/list/:pgno",
        element: <PrivateRoute component={BlogTable} />,
      },
      {
        path: "cms/blogs/add",
        element: <PrivateRoute component={BlogAdd} />,
      },
      {
        path: "cms/blogs/:pgno/edit/:id",
        element: <PrivateRoute component={BlogEdit} />,
      },
      {
        path: "cms/blogs/view/:id",
        element: <PrivateRoute component={BlogView} />,
      },

      /* Testimonials */
      {
        path: "cms/testimonials/list/:pgno",
        element: <PrivateRoute component={TestimonialTable} />,
      },
      {
        path: "cms/testimonials/add",
        element: <PrivateRoute component={TestimonialAdd} />,
      },
      {
        path: "cms/testimonials/:pgno/edit/:id",
        element: <PrivateRoute component={TestimonialEdit} />,
      },
      {
        path: "cms/testimonials/view/:id",
        element: <PrivateRoute component={TestimonialView} />,
      },


      // Subscription features


      // {
      //   path: "subscription/subscription-feature",
      //   element: <PrivateRoute component={SubscriptionFeature} />,
      // },

      // Subscription benefit
      // {
      //   path: "subscription/subscription-benefit",
      //   element: <PrivateRoute component={SubscriptionBenefit} />,
      // },

      // Subscription-plan
      {
        path: "subscription/subscription-plan/list/:pgno",
        element: <PrivateRoute component={SubscriptionPlanTable} />,
      },
      {
        path: "subscription/subscription-plan/add",
        element: <PrivateRoute component={AddSubscriptionPlan} />,
      },
      {
        path: "subscription/subscription-plan/edit/:id",
        element: <PrivateRoute component={EditSubscriptionPlan} />,
      },
      {
        path: "subscription/subscription-plan/view/:id",
        element: <PrivateRoute component={SubscriptionPlanView} />,
      },

      //Subscription-history
      {
        path: "subscription/history/list/:pgno",
        element: <PrivateRoute component={SubscriptionHistoryTable} />
      },
      {
        path: "subscription/history/:pgno/view/:id",
        element: <PrivateRoute component={SubscriptionHistoryView} />
      },

      //transactions
      {
        path: "subscription/transaction/list/:pgno",
        element: <PrivateRoute component={TransactionTable} />
      },
      {
        path: "subscription/transaction/:pgno/view/:id",
        element: <PrivateRoute component={ViewTransaction} />
      },


      //Coupons
      {
        path: "coupon/list/:pgno",
        element: <PrivateRoute component={CouponTable} />,
      },
      {
        path: "coupon/add",
        element: <PrivateRoute component={AddCoupon} />,
      },
      {
        path: "coupon/edit/:id",
        element: <PrivateRoute component={EditCoupon} />,
      },
      {
        path: "coupon/view/:id",
        element: <PrivateRoute component={CouponView} />,
      },

      //Referrals
      {
        path: "referrals/settings",
        element: <PrivateRoute component={ReferralSettings} />,
      },
      {
        path: "referrals/history/list/:pgno",
        element: <PrivateRoute component={ReferralHistoryTable} />,
      },

      //Global settings
      {
        path: "global-settings",
        element: <PrivateRoute component={GlobalSettings} />,
      },

      //Personalization-categories
      {
        path: "personalization-categories/list/:pgno",
        element: <PrivateRoute component={PersonalizationCategoriesList} />,
      },
      {
        path: "personalization-categories/edit/:id",
        element: <PrivateRoute component={PersonalizationCategoryEdit} />,
      },

      //AstroGPT
      // {
      //   path: "astrogpt",
      //   element: <PrivateRoute component={AstroGPT} />,
      // },
    ],
  },
  {
    path: "admin",
    element: <AdminUnAuthLayout />,
    children: [
      { path: "login", element: <PublicRoute component={Login} /> },
      {
        path: "forget-password",
        element: <PublicRoute component={ForgotPwdPage} />,
      },
      {
        path: "otp-verification/:email",
        element: <PublicRoute component={OtpVerificationPage} />,
      },
      {
        path: "reset-password",
        // element: localStorage.getItem("validate_string") ? <PrivateRoute component={ResetPwdPage} /> : <Navigate to="/admin/login" />
        element: <PublicRoute component={ResetPwdPage} />,
      },
    ],
  },
  {
    path: "admin/complete-profile/:validate_string",
    element: <PublicRoute component={CompleteAdminProfile} />,
  },

  { path: "admin/*", element: <Error404 /> },

]);

export default router;
