interface PaginationProps {
  pokemonsPerPage: number;
  totalPokemonNumbers: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
  showNextPage: () => void;
  showPrevPage: () => void;
}

function Pagination({
  pokemonsPerPage,
  totalPokemonNumbers,
  paginate,
  currentPage,
  showNextPage,
  showPrevPage,
}: PaginationProps): React.JSX.Element {
  const totalPages = Math.ceil(totalPokemonNumbers / pokemonsPerPage);

  function getVisiblePages(currentPage: number, totalPages: number): number[] {
    const visibleCount = 5;
    const halfVisible = Math.floor(visibleCount / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (endPage - startPage + 1 < visibleCount) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + visibleCount - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - visibleCount + 1);
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div>
      <ul className="pagination">
        <button
          className="page-link prev"
          onClick={() => showPrevPage()}
        ></button>
        {visiblePages.map((number) => (
          <li
            className={`page-item ${currentPage === number ? 'active' : ''}`}
            key={number}
          >
            <a href="#" className="page-link" onClick={() => paginate(number)}>
              {number}
            </a>
          </li>
        ))}{' '}
        <button
          className="page-link next"
          onClick={() => showNextPage()}
        ></button>
      </ul>
    </div>
  );
}

export default Pagination;
