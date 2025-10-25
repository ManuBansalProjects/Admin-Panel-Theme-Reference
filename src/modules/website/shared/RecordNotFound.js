import React from 'react';
import { useTranslation } from 'react-i18next';
import notFoundImg from '../../../assets/website/images/not-found.svg';

export default function RecordNotFound({ heading = "no_record_found_text", text = null }) {
    const { t } = useTranslation();
    return (
        <div className='page-not-found-ui'>
            <img src={notFoundImg} alt={t(heading)} />
            <h4>{t(heading)}</h4>
            {text ? <p>{t(text)}</p> : null}
        </div>
    );
}