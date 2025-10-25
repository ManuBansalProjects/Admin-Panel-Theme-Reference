import React from 'react'

const PsychicGlobalLoader = () => {
    return (
        <>
            <div id="global-loader">
                <div className="text-center">
                    <div className="spinner-grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PsychicGlobalLoader;
