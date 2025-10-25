import React from 'react'
import { Link } from 'react-router-dom'

function Breadcrums(props) {
  const breadcrumbs = props.data && props.data.length > 0 ? props.data : [];

  return (
    <>
      <nav className="breadcrumb-5">
        <div className="breadcrumb flat ps-0 pt-0">
          {breadcrumbs.map((item, index) => {
            // console.log(breadcrumbs)
            return (
                <Link
                  to={item.url}
                  key={index}
                  className={
                    item.url === "" ? "active disableclick" : ""
                  }
                >
                  {/* <span className="badge badge-light mr-3">{index + 1}</span> */}
                  {item.title}
                </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
export default Breadcrums