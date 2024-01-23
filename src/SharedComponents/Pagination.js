import React from 'react'

function Pagination({currentPage, totalPages, setCurrentPage}) {

    const range = 2;
    const paginationItems = [];
    const startPage = Math.max(currentPage - range, 0); 
    const endPage = Math.min(currentPage + range, totalPages - 1);
    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
      };

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePagination(i)}
        >
          <span className="page-link">{i + 1}</span>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li
            className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
            onClick={() => handlePagination(0)}
          >
            <span className="page-link">First</span>
          </li>
          {paginationItems}
          <li
            className={`page-item ${
              currentPage === totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() => handlePagination(totalPages - 1)}
          >
            <span className="page-link">Last</span>
          </li>
        </ul>
      </nav>
    );
}

export default Pagination