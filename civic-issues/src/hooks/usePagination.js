import { useState } from 'react';

/**
 * Pagination hook.
 * Returns { page, limit, setPage, setLimit, totalPages, hasNext, hasPrev, goToPage, nextPage, prevPage }
 */
const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    if (hasNext) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (hasPrev) setPage((prev) => prev - 1);
  };

  const reset = () => {
    setPage(initialPage);
  };

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    setPage,
    setLimit,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    reset,
  };
};

export default usePagination;