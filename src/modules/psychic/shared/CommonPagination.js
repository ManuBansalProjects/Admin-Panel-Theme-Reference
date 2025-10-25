import React from 'react';

const PsychicPagination = ({
  dataLength,
  itemPerPage,
  currentPage,
  setPage,
  pageLimit = 5,
}) => {
  const totalPages = Math.ceil(dataLength / itemPerPage);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= pageLimit + 2) {
      // Show all pages if small count
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // First page

      let start = Math.max(2, currentPage - Math.floor(pageLimit / 2));
      let end = Math.min(totalPages - 1, currentPage + Math.floor(pageLimit / 2));

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages); // Last page
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Page navigation" className="mt-3">
      <ul className="pagination justify-content-center flex-wrap">
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a
            className="page-link"
            href="#"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              handlePrevClick();
            }}
          >
            <span aria-hidden="true">
              <i className="ti ti-chevron-left"></i>
            </span>
          </a>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((page, idx) => (
          <li
            key={idx}
            className={`page-item ${
              page === currentPage ? 'active' : ''
            } ${page === '...' ? 'disabled' : ''}`}
          >
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page !== '...') handlePageClick(page);
              }}
            >
              {page}
            </a>
          </li>
        ))}

        {/* Next Button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              handleNextClick();
            }}
          >
            <span aria-hidden="true">
              <i className="ti ti-chevron-right"></i>
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default PsychicPagination;
