import React, { useState } from 'react';
import '../App.css'

const Pagination = ({ totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(10); // totalPages can be dynamic

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 1) return pages; // No pagination if there's only 1 page

    // Show first 3 pages
    for (let i = 1; i <= 3; i++) {
      if (i <= totalPages) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>
        );
      }
    }

    // Show ellipsis if current page is greater than 4
    if (currentPage > 4) {
      pages.push(<span key="left-ellipsis">...</span>);
    }

    // Show middle pages around current page (if current page is not near the ends)
    if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push(
        <button
          key={currentPage}
          onClick={() => handlePageChange(currentPage)}
          className="active"
        >
          {currentPage}
        </button>
      );
    }

    // Show ellipsis before the last 3 pages if there is a gap
    if (currentPage < totalPages - 3) {
      pages.push(<span key="right-ellipsis">...</span>);
    }

    // Show last 3 pages
    for (let i = totalPages - 2; i <= totalPages; i++) {
      if (i > 3) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>
        );
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &lt;
      </button>
      {renderPageNumbers()}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};


export default Pagination;
