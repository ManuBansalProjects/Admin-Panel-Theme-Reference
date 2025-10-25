import React, { useEffect, useState } from 'react'
import serviceBanner from "./../../../assets/website/images/service-banner.jpg"
import service1 from "./../../../assets/website/images/service-1.jpg"
import service2 from "./../../../assets/website/images/service-2.jpg"
import service3 from "./../../../assets/website/images/service-3.jpg"
import service4 from "./../../../assets/website/images/service-4.jpg"
import service5 from "./../../../assets/website/images/service-5.jpg"
import service6 from "./../../../assets/website/images/service-6.jpg"
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GetServicesList } from '../services/website.services'
import { getLocalKey } from '../../../utils/commonfunction'
import RecordNotFound from '../shared/RecordNotFound'
import Skeleton from 'react-loading-skeleton'

const WebsiteServices = () => {
  const { t } = useTranslation();
  const [servicesList, setServicesList] = useState([]);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    GetServicesList()
      .then((response) => {
        setServicesList(response?.data?.list);
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
    <div className='inner-wraper'>
      <div className='banner-inner-head'>
        <div className='container-fluid'>
          <div className='banner-inner-wrap d-flex align-items-center justify-content-center'>
            <img alt='service-banner' className='banner-bg' src={serviceBanner} />
            <div className='banner-content d-flex flex-column gap-4'>
              <h1>{t("services")}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='breadcrumb-container container-fluid'>
        <nav aria-label="breadcrumb" className='mt-4'>
          <ol className="breadcrumb gap-2 justify-content-start align-items-center">
            <li className="breadcrumb-item"><Link to={`/`}>{t("header_home")}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{t("services")}</li>
          </ol>
        </nav>
      </div>

      <div className='inner-content'>
        <div className='service-section-inner py-12'>
          <div className='container'>
            <div className='row row-gap-5'>
              {apiLoaded ?
                servicesList?.length ?
                  servicesList?.map((service, index) => (
                    <div className='col-md-6'>
                      <div className='service-box-card'>
                        <figure className='object-fit'>
                          <img src={service?.image} alt={service?.title} width="100%" />
                        </figure>
                        <figcaption>
                          <h3>{service?.title}</h3>
                          <p>{service?.description}</p>
                        </figcaption>
                      </div>
                    </div>
                  )) :
                  <div className='d-flex justify-content-center align-content-center'>
                    <RecordNotFound heading={t("no_record_found_text")} />
                  </div>
                :
                Array.from({ length: 4 }).map((_, index) => (
                  <div className='col-md-6' key={index}>
                    <div className='service-box-card'>
                      <figure className='object-fit'>
                        <Skeleton height={200} width={'100%'} />
                      </figure>
                      <figcaption style={{ paddingTop: '1rem' }}>
                        <h3><Skeleton width={'60%'} height={24} /></h3>
                        <p><Skeleton count={3} /></p>
                      </figcaption>
                    </div>
                  </div>
                ))
              }
              {/* <div className='col-md-6'>
                <div className='service-box-card'>
                  <figure className='object-fit'>
                    <img src={service2} alt="service" width="100%" />
                  </figure>
                  <figcaption>
                    <h3>{t("birth_chart_analysis")}</h3>
                    <p>{t("services_birth_chart_analysis_card_content")}</p>
                  </figcaption>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='service-box-card'>
                  <figure className='object-fit'>
                    <img src={service3} alt="service" width="100%" />
                  </figure>
                  <figcaption>
                    <h3>Love compatibility</h3>
                    <p>{t("services_health_calendar_card_content")}</p>
                  </figcaption>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='service-box-card'>
                  <figure className='object-fit'>
                    <img src={service4} alt="service" width="100%" />
                  </figure>
                  <figcaption>
                    <h3>{t("tarot_card_reading")}</h3>
                    <p>{t("services_tarot_card_reading_card_content")}</p>
                  </figcaption>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='service-box-card'>
                  <figure className='object-fit'>
                    <img src={service5} alt="service" width="100%" />
                  </figure>
                  <figcaption>
                    <h3>{t("biorhythm_analysis")}</h3>
                    <p>{t("services_biorhythm_analysis_card_content")}</p>
                  </figcaption>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='service-box-card'>
                  <figure className='object-fit'>
                    <img src={service6} alt="service" width="100%" />
                  </figure>
                  <figcaption>
                    <h3>Romantic personality</h3>
                    <p>{t("services_beauty_calendar_card_content")}</p>
                  </figcaption>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebsiteServices;
