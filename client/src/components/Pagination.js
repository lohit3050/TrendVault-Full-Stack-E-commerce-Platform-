import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }
    
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination">
      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className={`page-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        {/* First Page */}
        {visiblePages[0] > 1 && (
          <>
            <button
              className="page-btn page-number"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {visiblePages[0] > 2 && <span className="pagination-dots">...</span>}
          </>
        )}

        {/* Visible Page Numbers */}
        {visiblePages.map(page => (
          <button
            key={page}
            className={`page-btn page-number ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* Last Page */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="pagination-dots">...</span>
            )}
            <button
              className="page-btn page-number"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          className={`page-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
      
      <div className="pagination-info">
        Showing page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
