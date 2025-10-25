import React, { useEffect, useRef, useState } from 'react';
import bannerAbout from "./../../../assets/website/images/banner-about.jpg"
import about2 from "./../../../assets/website/images/about2.png"
import whyChooseUs from "./../../../assets/website/images/whyChooseUs.jpg"
import logoCircle from "./../../../assets/website/images/logoCircle.svg"
import { Link } from 'react-router-dom';
import { GetAboutUs } from '../services/website.services';
import RecordNotFound from '../shared/RecordNotFound';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import { getLocalKey } from '../../../utils/commonfunction';

function WebsiteAboutUs() {

  const { t } = useTranslation();
  const [aboutUsData, setAboutUsData] = useState({});
  const [apiLoaded, setApiLoaded] = useState(false);
  const marqueeRef = useRef();
  const [systemLang, setSystemLang] = useState(getLocalKey("system_language"));
  
    useEffect(() => {
      const handleLanguageChange = () => {
        const updatedLang = getLocalKey("system_language");
        setSystemLang(updatedLang);
      };
    
      document.addEventListener("language_change", handleLanguageChange);
    
      return () => {
        document.removeEventListener("language_change", handleLanguageChange);
      };
    }, []);

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
  }, [apiLoaded]);

  useEffect(() => {
    GetAboutUs()
      .then((response) => {
        setApiLoaded(true);
        setAboutUsData(response?.data);
      })
      .catch((error) => {
        console.log("Error===>", error)
      })
  }, [systemLang]);

  return (
      <>
          <div className="inner-wraper">
              <div className="banner-inner-head">
                  <div className="container-fluid">
                      <div className="banner-inner-wrap d-flex align-items-center justify-content-center">
                          <img alt="about-us-banner" className="banner-bg" src={bannerAbout} />
                          <div className="banner-content d-flex flex-column gap-4">
                              <h1>{t("about_us")}</h1>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="breadcrumb-container container-fluid">
                  <nav aria-label="breadcrumb" className="mt-4">
                      <ol className="breadcrumb gap-2 justify-content-start align-items-center">
                          <li className="breadcrumb-item">
                              <Link to={`/`}>{t("header_home")}</Link>
                          </li>
                          <li className="breadcrumb-item active" aria-current="page">
                              {t("about_us")}
                          </li>
                      </ol>
                  </nav>
              </div>
              {apiLoaded ? (
                  Object.keys(aboutUsData).length !== 0 ? (
                      <div className="inner-content">
                          <div className="about-section py-12">
                              <div className="container">
                                  <div className="row align-items-center justify-content-between">
                                      <div className="col-md-4">
                                          <div className="about-img-box">
                                              {/* <img src={about} className="about-main-img" alt="about-img" width="100%" /> */}
                                              <img src={aboutUsData?.image1} className="about-main-img" alt="about-img" width="100%" />
                                              <img src={about2} className="about-shape" alt="" aria-hidden="true" width="100%" />
                                          </div>
                                      </div>
                                      <div className="col-md-7">
                                          <div className="about-content">
                                              {/* <div className='heading-text-with-icon'>About Us</div> */}
                                              {/* <h2 className="h2-heading mb-4"> Guided by the Stars</h2> */}
                                              <h2 className="h2-heading mb-4">{aboutUsData?.heading1}</h2>
                                              {/* <p className="paragraph-16">Discover a space where celestial wisdom meets everyday life. Our mission is to bring the transformative power of astrology to your fingertips, offering personalized insights and practical guidance. Whether you're a seasoned stargazer or new to the zodiac, we’re here to help you decode the mysteries of the universe and align with your true path. With a passion for the stars and a commitment to your growth, we’re dedicated to making astrology accessible, inspiring, ...</p> */}
                                              {/* <p className="paragraph-16">Whether you're seeking clarity about your future, understanding your strengths, or aligning with your true purpose, the wisdom of the cosmos is here to guide you. Explore the mysteries of the universe and unlock the secrets written in the stars to live a life of intention and harmony.</p> */}
                                              <p className="paragraph-16">
                                                  <div dangerouslySetInnerHTML={{ __html: aboutUsData?.content1 }}></div>
                                              </p>
                                              <div className="row about-stats">
                                                  <div className="col-md-6">
                                                      <div className="about-stats">
                                                          <hr />
                                                          <h2 className="h2-heading fw-semibold">300+</h2>
                                                          <p className="paragraph-16 m-0">{t("tarot_readings")}</p>
                                                      </div>
                                                  </div>
                                                  <div className="col-md-6">
                                                      <div className="about-stats">
                                                          <hr />
                                                          <h2 className="h2-heading fw-semibold">90+</h2>
                                                          <p className="paragraph-16 m-0">{t("reading_the_future")}</p>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <section className="marquee-section" ref={marqueeRef}>
                              <div className="marquee">
                                  {/* <marquee behavior="" direction=""></marquee> */}
                                  <div className="marquee-content-items">
                                      <h4>{t("marquee_horoscope")}</h4>
                                      <h4>{t("marquee_zodiac_sign")}</h4>
                                      <h4>{t("marquee_birth_chart")}</h4>
                                      <h4>{t("marquee_tarot_card")}</h4>
                                      <h4>{t("marquee_consultations")}</h4>
                                      <h4>{t("marquee_spiritual_advisor")}</h4>
                                  </div>
                              </div>
                          </section>
                          <section className="why-choose-us-section">
                              <div className="container">
                                  <div className="row align-items-center justify-content-between why-choose-container">
                                      <div className="col-md-5">
                                          <div className="why-choose-us-content py-14">
                                              <div className="logo-circle">
                                                  <img src={logoCircle} alt="Reloaded logo" width="100%" />
                                              </div>
                                              {/* <h2 className="h2-heading mb-2">Why Choose an Astrology App?</h2> */}
                                              <h2 className="h2-heading mb-2">{aboutUsData?.heading2}</h2>
                                              {/* <p className="paragraph-16">Astrology apps offer a convenient and personalized way to explore the mysteries of the cosmos and gain insights into your life. Whether you're seeking daily horoscopes, compatibility guidance, or in-depth birth chart analysis, these apps provide a user-friendly platform to connect with ancient wisdom. By combining traditional astrological knowledge with modern technology, they make it easy to access customized predictions and spiritual guidance anytime, anywhere. Whether you're a beginner or an astrology enthusiast, an astrology app can serve as a trusted companion in your journey of self-discovery.</p> */}
                                              <p className="paragraph-16">
                                                  <div dangerouslySetInnerHTML={{ __html: aboutUsData?.content2 }}></div>
                                              </p>
                                          </div>
                                      </div>
                                      <figure>
                                          <img src={whyChooseUs} alt="why-choose-us" width="100%" />
                                      </figure>
                                  </div>
                              </div>
                          </section>
                          <section className="team-sec py-12">
                              <div className="container">
                                  <div className="heading-box text-center w-75 mx-auto mb-8">
                                      <h2 className="h2-heading mb-2">{t("our_team")}</h2>
                                      <p className="paragraph-16">{t("our_team_content")}</p>
                                  </div>
                                  <div className="row justify-content-center">
                                      {aboutUsData?.option?.map((opt, i) => (
                                          <div key={i} className="col-md-4">
                                              <figure className="team-img-box">
                                                  <img src={opt.option_image} alt="team-img" width="100%" />
                                                  <figcaption>
                                                      <div className="team-info-details">
                                                          <h4>{opt.option_name}</h4>
                                                          <span>{opt.option_designation}</span>
                                                      </div>
                                                  </figcaption>
                                              </figure>
                                          </div>
                                      ))}
                                      {/* <div className='col-md-4'>
                      <figure className='team-img-box'>
                        <img src={team2} alt="team-img" width="100%" />
                        <figcaption>
                          <div className='team-info-details'>
                            <h4>Nancy Wilson</h4>
                            <span>Chief Technology Officer</span>
                          </div>
                        </figcaption>
                      </figure>
                    </div> */}
                                      {/* <div className='col-md-4'>
                      <figure className='team-img-box'>
                        <img src={team3} alt="team-img" width="100%" />
                        <figcaption>
                          <div className='team-info-details'>
                            <h4>Emily Chen</h4>
                            <span>Chief Marketing Officer</span>
                          </div>
                        </figcaption>
                      </figure>
                    </div> */}
                                  </div>
                              </div>
                          </section>
                      </div>
                  ) : (
                      <RecordNotFound heading="Record not found" />
                  )
              ) : (
                  <section className="section-padding">
                      <div className="container">
                          <div className="row justify-content-center">
                              <div className="col-md-12">
                                  <div className="card m-5">
                                      <div className="card-body">
                                          <Skeleton className="rounded-1" height={50} count={3} />
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>
              )}
          </div>
      </>
  );
}

export default WebsiteAboutUs;
