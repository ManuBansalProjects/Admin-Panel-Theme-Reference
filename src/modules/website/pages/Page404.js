import React from 'react';
import img404 from '../../../assets/website/images/img404.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function Page404({homePath="/"}) {
  const {t} = useTranslation();
  return (
    <div className='page-404 py-5'>
      <div className='container'>
        <div className='page-404-wrap'>
          <article>
            <figure>
              <img src={img404} alt='404'/>
            </figure>
            <figcaption>
              <h1>{t("page_not_exist_text")}</h1>
              <p>{t("mistyped_address_text")}</p>
              <Link className='btn btn-primary' to={homePath}>{t("btn_back_to_home")}</Link>
            </figcaption>
          </article>
        </div>
      </div>
    </div>
  )
}

export default Page404
