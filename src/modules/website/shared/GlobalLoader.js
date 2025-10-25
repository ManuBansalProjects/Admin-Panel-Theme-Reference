import React from 'react'

export default function GlobalLoaderWeb() {
    return (
        <>
            <div id="global-loader">
                <div className="text-center">
                    {/* <div className="lds-ripple"><div></div><div></div></div> */}
                    <div class="spinner-grow" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </>
    )
}
