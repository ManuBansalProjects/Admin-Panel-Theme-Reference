import React from 'react'
import userImg1 from "./../../../assets/website/images/user1.jpg"

export default function CustomerFeedback() {
  return (
    <div className='dashboard-wrapper py-5'>
      <div className='container'>
        <div className='dashboard-container'>
          <div className="dashboard-header"><h2 className="heading-22-bold text-center">Customer Feedback</h2></div>
          <div className='dashboard-body'>
            <div className='dashboard-rating-sec mb-8'>
              <h4 className='heading-18-semibold mb-3'>Overall Rating</h4>
              <div className='rating-info-box'>
                <div className='rating-info-item'>
                  <h2>4.5</h2>
                  <div className='rating-start mt-3'>
                    <i className='ti ti-star-filled'></i>
                    <i className='ti ti-star-filled'></i>
                    <i className='ti ti-star-filled'></i>
                    <i className='ti ti-star-filled'></i>
                    <i className='ti ti-star-filled'></i>
                  </div>
                  <span>1230</span>
                </div>
                <div className='rating-bars'>
                  <div className='rating-bar-item'>
                    <span>5</span>
                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                      <div className="progress-bar" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div className='rating-bar-item'>
                    <span>4</span>
                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                      <div className="progress-bar" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div className='rating-bar-item'>
                    <span>3</span>
                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                      <div className="progress-bar" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className='rating-bar-item'>
                    <span>2</span>
                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                      <div className="progress-bar" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className='rating-bar-item'>
                    <span>1</span>
                    <div className="progress" role="progressbar" aria-valuemax="100" aria-label="Loading progress">
                      <div className="progress-bar" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='customer-feedback-sec'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h4 className='heading-18-semibold'>Customer Feedback</h4>
                <a href='/psychic/feedback' className='btn-text'>View All</a>
              </div>
              <div className='customer-feedback-list d-flex flex-column gap-3 '>
                <div className='feedback-list-card'>
                  <div className='feedback-list-card-header d-flex gap-3'>
                    <figure className="avatar avatar-sm"><img src={userImg1} /></figure>
                    <figcaption className='w-100'>
                      <div className='d-flex align-items-center justify-content-between gap-2 mb-1'>
                        <h4 className="heading-16-semibold">Grusham</h4>
                        <span>10 Jan 2025</span>
                      </div>
                      <div className='rating-start'>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                      </div>
                    </figcaption>
                  </div>
                  <div className='feedback-list-card-footer'>
                    <p className="m-0">The predictions about my career and relationships were so accurate it gave me chills. [Astrologer’s Name] is the real deal.</p>
                  </div>
                </div>
                <div className='feedback-list-card'>
                  <div className='feedback-list-card-header d-flex gap-3'>
                    <figure className="avatar avatar-sm"><img src={userImg1} /></figure>
                    <figcaption className='w-100'>
                      <div className='d-flex align-items-center justify-content-between gap-2 mb-1'>
                        <h4 className="heading-16-semibold">Grusham</h4>
                        <span>10 Jan 2025</span>
                      </div>
                      <div className='rating-start'>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                      </div>
                    </figcaption>
                  </div>
                  <div className='feedback-list-card-footer'>
                    <p className="m-0">The predictions about my career and relationships were so accurate it gave me chills. [Astrologer’s Name] is the real deal.</p>
                  </div>
                </div>
                <div className='feedback-list-card'>
                  <div className='feedback-list-card-header d-flex gap-3'>
                    <figure className="avatar avatar-sm"><img src={userImg1} /></figure>
                    <figcaption className='w-100'>
                      <div className='d-flex align-items-center justify-content-between gap-2 mb-1'>
                        <h4 className="heading-16-semibold">Grusham</h4>
                        <span>10 Jan 2025</span>
                      </div>
                      <div className='rating-start'>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                      </div>
                    </figcaption>
                  </div>
                  <div className='feedback-list-card-footer'>
                    <p className="m-0">The predictions about my career and relationships were so accurate it gave me chills. [Astrologer’s Name] is the real deal.</p>
                  </div>
                </div>
                <div className='feedback-list-card'>
                  <div className='feedback-list-card-header d-flex gap-3'>
                    <figure className="avatar avatar-sm"><img src={userImg1} /></figure>
                    <figcaption className='w-100'>
                      <div className='d-flex align-items-center justify-content-between gap-2 mb-1'>
                        <h4 className="heading-16-semibold">Grusham</h4>
                        <span>10 Jan 2025</span>
                      </div>
                      <div className='rating-start'>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                      </div>
                    </figcaption>
                  </div>
                  <div className='feedback-list-card-footer'>
                    <p className="m-0">The predictions about my career and relationships were so accurate it gave me chills. [Astrologer’s Name] is the real deal.</p>
                  </div>
                </div>
                <div className='feedback-list-card'>
                  <div className='feedback-list-card-header d-flex gap-3'>
                    <figure className="avatar avatar-sm"><img src={userImg1} /></figure>
                    <figcaption className='w-100'>
                      <div className='d-flex align-items-center justify-content-between gap-2 mb-1'>
                        <h4 className="heading-16-semibold">Grusham</h4>
                        <span>10 Jan 2025</span>
                      </div>
                      <div className='rating-start'>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                        <i className='ti ti-star-filled'></i>
                      </div>
                    </figcaption>
                  </div>
                  <div className='feedback-list-card-footer'>
                    <p className="m-0">The predictions about my career and relationships were so accurate it gave me chills. [Astrologer’s Name] is the real deal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
