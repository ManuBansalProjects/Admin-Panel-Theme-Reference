import React, { useEffect, useState } from 'react'
import { GetAllFAQ } from '../services/website.services';
import Skeleton from 'react-loading-skeleton';
import RecordNotFound from '../shared/RecordNotFound';
import { Link } from 'react-router-dom';
import bannerFaq from "./../../../assets/website/images/banner-faq.jpg"
import { useTranslation } from 'react-i18next';
import { getLocalKey } from '../../../utils/commonfunction';
function Faq() {
  const [faqData, setFaqData] = useState([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const { t } = useTranslation();
  // console.log("getLocalKey(system_language)--->",getLocalKey("system_language"))

  useEffect(() => {
    GetAllFAQ()
      .then((response) => {
        setApiLoaded(true);
        setFaqData(response?.data?.list);
      })
      .catch((error) => {
        console.log("Error===>", error)
      })
  }, [getLocalKey("system_language")]);

  return (
    <>
      <div className='banner-inner-head'>
        <div className='container-fluid'>
          <div className='banner-inner-wrap d-flex align-items-center justify-content-center'>
            <img alt='faq-banner' className='banner-bg' src={bannerFaq} />
            <div className='banner-content d-flex flex-column gap-4'>
              <h1>{t("frequently_asked_questions")}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='breadcrumb-container container-fluid'>
        <nav aria-label="breadcrumb" className='mt-4'>
          <ol className="breadcrumb gap-2 justify-content-start align-items-center">
            <li className="breadcrumb-item"><Link to={`/`}>{t("nav_link_home")}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{t("frequently_asked_questions")}</li>
          </ol>
        </nav>
      </div>
      {apiLoaded ?
        faqData?.length ?
          <div className='faq-pages py-12'>
            <div className='innerpage-padding'>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <div className="faq-content">
                      <div className="faq-body">
                        <div className="accordion accordion-flush" id="accordionFlushExample">
                          {faqData?.map((data, index) => (
                            <div key={index} className="accordion-item">
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls={`flush-collapse${index}`}>
                                  {data?.title}
                                </button>
                              </h2>
                              <div id={`flush-collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body" dangerouslySetInnerHTML={{ __html: data?.description }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          : <RecordNotFound heading='Record not found' />
        :
        <section className="section-padding">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card m-5">
                  <div className="card-body">
                    <Skeleton className='rounded-1' height={50} count={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  )
}

export default Faq

