import React, { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { addQueryParam } from '../../../utils/commonfunction';

const CustomPagination = (props) => {
  const params = useParams()
  const [query] = useSearchParams();
  const navigate = useNavigate()
  const pages = [];
  let pageno = 0;
  if(props.query){
    pageno = props.custompath ? Number(params[props.custompath]) : Number(query.get(props.paramName||'page'));
  }else{
    pageno = props.custompath ? Number(params[props.custompath]) : Number(params.pgno);
  }
  if(props.modalPagination){
    pageno = props.currentPage
  }
  const totalPages = Math.ceil(props.datalength / props.itemperpage);
  
  useEffect(() => {
    if (props.currentPage > totalPages) {
      props.setPage(totalPages);
      if(props.query){
        navigate(props && props.pageRoute && props.pageRoute[0].path ? (addQueryParam(props.pageRoute[0].path, props.paramName||'page',totalPages)) : ("#"))
      }else{
        navigate(props && props.pageRoute && props.pageRoute[0].path ? (props.pageRoute[0].path + '/' + totalPages) : ("/#"))
      }
    }
  }, [totalPages, navigate, props]);

  let start = props.currentPage || 1;
  if (start < 1) {
    start = 1;
  } else {
    if (start < 5) {
      start = 1;
    } else {
      start = start - 3;
    }
  }
  let end = start + 6;
  end = end <= totalPages ? end : totalPages;

  // pagination functions start//
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  const handleprepage = () => {
    if(props.modalPagination){
      if (Number(pageno) !== 1) {
        props.setPage(Number(pageno - 1))
        // navigate(props && props.pageRoute && props.pageRoute[0].path ? (props.pageRoute[0].path + '/' + Number(pageno - 1)) : ("/#"))
      }
    }else{
      if (Number(pageno) !== 1) {
        props.setPage(Number(pageno - 1))
        if(props.query){
          navigate(props && props.pageRoute && props.pageRoute[0].path ? (addQueryParam(props.pageRoute[0].path, props.paramName||'page',Number(pageno - 1))) : ("#"))
        }else{
          navigate(props && props.pageRoute && props.pageRoute[0].path ? (props.pageRoute[0].path + '/' + Number(pageno - 1)) : ("/#"))
        }
      }
    }
    
  }

  const handlePagniation = (pageno) => {
    if(props.modalPagination){
      if (pageno) {
        props.setPage(Number(pageno))
        // navigate(props && props.pageRoute && props.pageRoute[0].path ? (props.pageRoute[0].path + '/' + (pageno)) : ("/#"))
      }
    }else{
      if (pageno) {
        props.setPage(Number(pageno))
        if(props.query){
          navigate(props && props.pageRoute && props.pageRoute[0].path ? (addQueryParam(props.pageRoute[0].path, props.paramName||'page',Number(pageno))) : ("#"))
        }else{
          navigate(props && props.pageRoute && props.pageRoute[0].path ? (props.pageRoute[0].path + '/' + (pageno)) : ("/#"))
        }
      }  
    }
  }

  const handleNextpage = () => {
    if(props.modalPagination){
      if (pageno < props.datalength / props.itemperpage) {
        let pageCount = Number(++pageno)
        props.setPage(pageCount)
        // navigate(props && props.pageRoute && props.pageRoute[0].path ? (props.pageRoute[0].path + '/' + pageCount) : ("/#"))
      }
    }else{
      if (pageno < props.datalength / props.itemperpage) {
        let pageCount = Number(++pageno)
        props.setPage(pageCount)
        
        if(props.query){
          navigate(props && props.pageRoute && props.pageRoute[0].path ? ((addQueryParam(props.pageRoute[0].path, props.paramName||'page',pageCount))) : ("/#"))
        }else{
          navigate(props && props.pageRoute && props.pageRoute[0].path ? (props.pageRoute[0].path + '/' + pageCount) : ("/#"))
        }
      }
    }
    
  }
  // pagination end

  return (
    <>
      <div className="text-right">
        <nav>
          <ul className="pagination">
            <li className={"page-item " + (Number(pageno) === 1 || pageno === 1 ? " disabled" : " cp")} onClick={handleprepage}>
              <button type="button" className="page-link">‹</button>
            </li>
            {start !== 1 && start !== 2 ?
              <>
                <li className={"page-item cp" + (Number(pageno) === 1 ? " active disabled" : " cp")} aria-current="page" onClick={() => { handlePagniation(1) }}>
                  <span className="page-link">{1}</span>
                </li>
                <li className={"page-item disabled"} aria-current="page">
                  <span className="page-link">...</span>
                </li>
              </>
              : ""
            }
            {pages.length && pages.map((pgno, i) => {
              return <li key={i} className={"page-item" + ((Number(pageno ) === pgno || pageno === pgno) && Number(pageno) === props.currentPage ? " active disabled" : " cp")} aria-current="page" onClick={() => { handlePagniation(pgno) }}><span className="page-link">{pgno}</span></li>
            })}
            {end !== totalPages - 1 && end !== totalPages ?
              <>
                <li className={"page-item disabled"} aria-current="page">
                  <span className="page-link">...</span>
                </li>
                <li className={"page-item " + (Number(pageno) === totalPages ? " active disabled" : " cp")} aria-current="page" onClick={() => { handlePagniation(totalPages) }}>
                  <span className="page-link">{totalPages}</span>
                </li>
              </>
              : ""
            }
            <li className={"page-item " + (Number(pageno) === totalPages || pageno === totalPages ? " disabled" : " cp")} onClick={handleNextpage}>
              <button type="button" className="page-link">›</button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
export default CustomPagination