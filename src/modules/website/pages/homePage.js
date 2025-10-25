import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import heroMain from "./../../../assets/website/images/hero-main.png"
import hero1 from "./../../../assets/website/images/hero-1.png"
import hero2 from "./../../../assets/website/images/hero-2.png"
import about from "./../../../assets/website/images/about.jpg"
import about2 from "./../../../assets/website/images/about2.png"
import coverVideoImg from "./../../../assets/website/images/cover-video.png"
import carVideo from "./../../../assets/website/images/car.mp4"
import service1 from "./../../../assets/website/images/service-1.jpg"
import service2 from "./../../../assets/website/images/service-2.jpg"
import service3 from "./../../../assets/website/images/service-3.jpg"
import service4 from "./../../../assets/website/images/service-4.jpg"
import howWork1 from "./../../../assets/website/images/how-1.svg"
import howWork2 from "./../../../assets/website/images/how-2.svg"
import howWork3 from "./../../../assets/website/images/how-3.svg"
import appStore from "./../../../assets/website/images/app-store.png"
import playStore from "./../../../assets/website/images/play-store.png"
import appImg from "./../../../assets/website/images/app-img.png"
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { GetDataForHomePage } from '../services/website.services';
import { getLocalKey } from '../../../utils/commonfunction';

function WebsiteHomePage() {
  const marqueeRef = useRef();
  const { t } = useTranslation();
  const [homePageData, setHomePageData] = useState([]);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    if (marqueeRef.current) {
      function Marquee(selector, speed) {
        const parentSelector = document.querySelector(selector);
        const clone = parentSelector.innerHTML;
        const firstElement = parentSelector.children[0];
        let i = 0;
        console.log(firstElement);
        parentSelector.insertAdjacentHTML('beforeend', clone);
        parentSelector.insertAdjacentHTML('beforeend', clone);

        setInterval(function () {
          firstElement.style.marginLeft = `-${i}px`;
          if (i > firstElement.clientWidth) {
            i = 0;
          }
          i = i + speed;
        }, 0);
      }
      Marquee('.marquee', 1);
    }
  }, []);

  useEffect(() => {
    GetDataForHomePage()
      .then((response) => {
        setHomePageData(response?.data);
        setTimeout(() => {
          setApiLoaded(true);
        }, 300);
      })
      .catch((error) => {
        console.log("Error===>", error)
        setTimeout(() => {
          setApiLoaded(true);
        }, 300);
      })
  }, [getLocalKey("system_language")]);

  return (
    // <div className="site-wraper" id="website-main-section" tabIndex='-1'>
    //   {/* <!-- hero section --> */}
    //   <section className="hero-section py-12">
    //     <div className="container">
    //       <div className="row align-items-center justify-content-between">
    //         <div className="col-lg-7">
    //           <div className="hero-content">
    //             <h1 className=' mb-2'>{homePageData?.homePage?.main_heading}</h1>
    //             <p>{homePageData?.homePage?.main_description}</p>
    //             <Link to="/inquiry" className="btn btn-primary mt-6 px-5">{t("btn_get_started")}</Link>
    //           </div>
    //         </div>
    //         <div className="col-lg-4">
    //           <figure className="m-0 hero-img-box">
    //             <img src={heroMain} alt="hero-img" width="100%" />
    //             <img className="shape-1" src={hero1} alt="" role='presentation' width="100%" />
    //             <img className="shape-2" src={hero2} alt="" role='presentation' width="100%" />
    //           </figure>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* <!-- about section --> */}
    //   <section className="about-section py-12">
    //     <div className="container">
    //       <div className="row align-items-center justify-content-between">
    //         <div className="col-md-4">
    //           <div className="about-img-box">
    //             <img src={homePageData?.aboutUs?.image1} className="about-main-img" alt="about-us-img" width="100%" />
    //             <img src={about2} className="about-shape" alt="" role='presentation' width="100%" />
    //           </div>
    //         </div>
    //         <div className="col-md-7">
    //           <div className="about-content">
    //             <div className="heading-text-with-icon">{t("about_us")}</div>
    //             <h2 className="h2-heading"> {homePageData?.aboutUs?.heading1}</h2>
    //             {/* <p className="paragraph-16">{t("home_about_us_content1")}</p>
    //             <p className="paragraph-16">{t("home_about_us_content2")}</p> */}
    //             <p className="paragraph-16">
    //               <div dangerouslySetInnerHTML={{ __html: homePageData?.aboutUs?.content1 }}></div>
    //             </p>

    //             <div className="row about-stats">
    //               <div className="col-md-6">
    //                 <div className="about-stats">
    //                   <hr />
    //                   <h2 className="h2-heading">300+</h2>
    //                   <p className="paragraph-16 m-0">{t("tarot_readings")}</p>
    //                 </div>
    //               </div>
    //               <div className="col-md-6">
    //                 <div className="about-stats">
    //                   <hr />
    //                   <h2 className="h2-heading">90+</h2>
    //                   <p className="paragraph-16 m-0">{t("reading_the_future")}</p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* <!-- Psychic join section --> */}
    //   <section className="psychic-join-section py-12">
    //     <div className="container">
    //       <div className="row align-items-center justify-content-center">
    //         <div className="col-md-8">
    //           <div className="psychic-join-content">
    //             <div className="heading-box text-center">
    //               <div className="heading-text-with-icon heading-text-with-icon-black">{t("spiritual_advisor_panel")}</div>
    //               <h2 className="h2-heading m-3">{homePageData?.homePage?.spiritual_advisor_heading}</h2>
    //               <p className="paragraph-16 text-black">{homePageData?.homePage?.spiritual_advisor_description}</p>
    //               <Link to={`/inquiry`} className="btn btn-primary mt-4 px-5">{t("btn_join_now")}</Link>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="psychic-join-video mt-10">
    //         <video poster={coverVideoImg} controls>
    //           {apiLoaded &&
    //             <source src={homePageData?.homePage?.spiritual_advisor_video} type="video/mp4" />
    //           }
    //           {t("your_browser_does_not_support_the_video_tag")}
    //         </video>
    //       </div>
    //     </div>
    //   </section>

    //   {/* <!-- services section --> */}
    //   <section className="services-section py-12 pt-0">
    //     <div className="container">
    //       <div className="heading-box text-center w-75 mx-auto mb-8">
    //         <div className="heading-text-with-icon">{t("services")}</div>
    //         <h2 className="h2-heading m-2">{homePageData?.homePage?.services_heading}</h2>
    //         <p className="paragraph-16">{homePageData?.homePage?.services_description}</p>
    //       </div>
    //       <div className="row service-box-wrapper">
    //         {homePageData?.serviceList?.map((service) => (
    //           <div className="col-md-6" key={service._id}>
    //             <div className="service-box">
    //               <figcaption>
    //                 <h4 className="h4-heading mb-3">{service?.title}</h4>
    //                 <p className="paragraph-16">{service?.description}</p>
    //               </figcaption>
    //               <figure>
    //                 <img src={service?.image} alt={service?.title} width="100%" />
    //               </figure>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   <section className="marquee-section" ref={marqueeRef}>
    //     <div className="marquee">
    //       {/* <marquee behavior="" direction=""></marquee> */}
    //       <div className="marquee-content-items">
    //         <h4>{t("marquee_horoscope")}</h4>
    //         <h4>{t("marquee_zodiac_sign")}</h4>
    //         <h4>{t("marquee_birth_chart")}</h4>
    //         <h4>{t("marquee_tarot_card")}</h4>
    //         <h4>{t("marquee_consultations")}</h4>
    //         <h4>{t("marquee_spiritual_advisor")}</h4>
    //       </div>
    //     </div>
    //   </section>

    //   {/* <!-- how it works section --> */}
    //   <section className="how-it-works-section py-12">
    //     <div className="container">
    //       <div className="how-it-works-heading row align-items-center justify-content-between mb-8">
    //         <div className="col-md-6">
    //           <div className="heading-box">
    //             <div className="heading-text-with-icon">{t("how_we_works")}</div>
    //             <h2 className="h2-heading">{homePageData?.homePage?.how_we_work_heading}</h2>
    //           </div>
    //         </div>
    //         <div className="col-md-6">
    //           <p className="paragraph-16 m-0">{homePageData?.homePage?.how_we_work_description}</p>
    //         </div>
    //       </div>
    //       <div className="row how-it-works-box-wrapper justify-content-center align-items-center">
    //         <div className="col-md-4">
    //           <div className="how-it-works-box">
    //             <span>1</span>
    //             <figure>
    //               <img src={howWork1} alt="create account" width="100%" />
    //             </figure>
    //             <figcaption>
    //               <h4>{t("how_we_works_card1_heading")}</h4>
    //               <p className="paragraph-16">{t("how_we_works_card1_content")}</p>
    //             </figcaption>
    //           </div>
    //         </div>
    //         <div className="col-md-4">
    //           <div className="how-it-works-box">
    //             <span>2</span>
    //             <figure>
    //               <img src={howWork2} alt="setup profile" width="100%" />
    //             </figure>
    //             <figcaption>
    //               <h4>{t("how_we_works_card2_heading")}</h4>
    //               <p className="paragraph-16">{t("how_we_works_card2_content")}</p>
    //             </figcaption>
    //           </div>
    //         </div>
    //         <div className="col-md-4">
    //           <div className="how-it-works-box">
    //             <span>3</span>
    //             <figure>
    //               <img src={howWork3} alt="receive prediction" width="100%" />
    //             </figure>
    //             <figcaption>
    //               <h4>{t("how_we_works_card3_heading")}</h4>
    //               <p className="paragraph-16">{t("how_we_works_card3_content")}</p>
    //             </figcaption>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* <!-- app download section --> */}
    //   <section className="app-download-section py-12 pt-0">
    //     <div className="container">
    //       <div className="app-download-content">
    //         <div className="heading-box">
    //           <div className="heading-text-with-icon text-white">{t("download_app")}</div>
    //           <h2 className="h2-heading text-white">{homePageData?.homePage?.download_app_heading}</h2>
    //           <p className="paragraph-16 text-white">{homePageData?.homePage?.download_app_description} </p>
    //           <div className="app-download-btn mt-8">
    //             <a href="#">
    //               <img src={appStore} alt="app-store-img" width="100%" />
    //             </a>
    //             <a href="#">
    //               <img src={playStore} alt="google-play-img" width="100%" />
    //             </a>
    //           </div>
    //         </div>
    //         <div className="app-download-img">
    //           <img src={appImg} alt="app-download-img" width="100%" />
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    // </div>
    <div>
      <h2>Work is in Progress</h2>
    </div>
  );
}

export default WebsiteHomePage;
