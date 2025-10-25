import React, { useEffect, useState } from "react";
import { CMSPageDetails } from "../services/website.services";
import Skeleton from "react-loading-skeleton";
import RecordNotFound from "../shared/RecordNotFound";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import bannerFaq from "./../../../assets/website/images/banner-faq.jpg";
import { capitalizeFirstLetter, getLocalKey } from "../../../utils/commonfunction";
import { useTranslation } from "react-i18next";

function DynamicWebPage() {
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const pageSlug = searchParams.get("page_slug");
    const [CMSPageData, setCMSPageData] = useState({});
    const [apiLoaded, setApiLoaded] = useState(false);
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
        CMSPageDetails(params.slug)
            .then((response) => {
                setApiLoaded(true);
                setCMSPageData(response && response?.data ? response?.data : {});
            })
            .catch((error) => {
                console.log("Error===>", error);
            });
    }, [navigate, params.slug, systemLang]);

    return (
        <>
            {apiLoaded ? (
                Object.entries(CMSPageData)?.length ? (
                    <div className="inner-wraper">
                        {/* <div className="banner-inner-head">
                          <div className="container-fluid">
                              <div className="banner-inner-wrap d-flex align-items-center justify-content-center">
                                  <img
                                      alt={`${CMSPageData?.title
                                          ?.toLowerCase()
                                          .replace(/[^a-z0-9\s]/g, "")
                                          .replace(/\s+/g, "-")}-banner`}
                                      className="banner-bg"
                                      src={bannerFaq}
                                  />
                                  <div className="banner-content d-flex flex-column gap-4">
                                      <h1>{capitalizeFirstLetter(CMSPageData?.title)}</h1>
                                      <nav aria-label="breadcrumb">
                                          <ol className="breadcrumb gap-2 justify-content-center">
                                              <li className="breadcrumb-item">
                                                  <Link to={`/`}>Home</Link>
                                              </li>
                                              <li className="breadcrumb-item active" aria-current="page">
                                                  {capitalizeFirstLetter(CMSPageData?.title)}
                                              </li>
                                          </ol>
                                      </nav>
                                  </div>
                              </div>
                          </div>
                      </div> */}
                        {/* Banner Section */}
                        <div className="banner-inner-head">
                            <div className="container-fluid">
                                <div className="banner-inner-wrap d-flex align-items-center justify-content-center">
                                    <img
                                        alt={`${CMSPageData?.title
                                            ?.toLowerCase()
                                            .replace(/[^a-z0-9\s]/g, "")
                                            .replace(/\s+/g, "-")}-banner`}
                                        className="banner-bg"
                                        src={bannerFaq}
                                    />
                                    <div className="banner-content d-flex flex-column gap-4">
                                        <h1>{capitalizeFirstLetter(CMSPageData?.title)}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Breadcrumb Section */}
                        <div className="breadcrumb-container container-fluid">
                            <nav aria-label="breadcrumb" className="mt-4">
                                <ol className="breadcrumb gap-2 justify-content-start align-items-center">
                                    <li className="breadcrumb-item">
                                        <Link to={`/`}>{t("header_home")}</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {capitalizeFirstLetter(CMSPageData?.title)}
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        {/* <div className='innerpage-padding'>
              <div className="container">
                <div className="row justify-content-center"> */}
                        <div className="inner-content">
                            <div className="cms-content py-12">
                                <div className="container">
                                    <div className="cms-content-wraper row row-gap-4">
                                        {/* <div className="col-md-12"> */}
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: CMSPageData?.description ? CMSPageData?.description : <RecordNotFound heading="web_record_not_found_heading" />,
                                            }}
                                        ></div>
                                        {/* </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <RecordNotFound heading="web_record_not_found_heading" />
                )
            ) : (
                // <section className="section-padding">
                //   <div className="row">
                //     <div className="col-lg-3 col-md-4 ">
                //       <Skeleton className='rounded-4' height={200} />
                //     </div>
                //     <div className="col-lg-3 col-md-4  d-none d-md-block">
                //       <Skeleton className='rounded-4' height={200} />
                //     </div>
                //     <div className="col-lg-3 col-md-4  d-none d-md-block">
                //       <Skeleton className='rounded-4' height={200} />
                //     </div>
                //     <div className="col-lg-3 col-md-4  d-none d-lg-block">
                //       <Skeleton className='rounded-4' height={200} />
                //     </div>
                //   </div>
                // </section>
                <section className="section-padding">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <div className="card m-5">
                                    <div className="card-body">
                                        <Skeleton className="rounded-1" height={400} count={1} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

export default DynamicWebPage;
