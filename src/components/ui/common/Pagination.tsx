'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Reusable pagination component with ellipsis for large page counts
 * Provides consistent navigation behavior across the application
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
  size = 'default',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range around current page
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, currentPage + halfVisible);

      // Adjust if we're near the beginning or end
      if (currentPage <= halfVisible) {
        end = maxVisiblePages;
      } else if (currentPage > totalPages - halfVisible) {
        start = totalPages - maxVisiblePages + 1;
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('ellipsis');
        }
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  return (
    <nav
      className={cn('flex items-center justify-center space-x-1', className)}
      aria-label='Pagination'
    >
      {/* First page button */}
      {showFirstLast && currentPage > 1 && (
        <Button
          variant='outline'
          size={buttonSize}
          onClick={() => onPageChange(1)}
          aria-label='Go to first page'
        >
          First
        </Button>
      )}

      {/* Previous page button */}
      {showPrevNext && (
        <Button
          variant='outline'
          size={buttonSize}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label='Go to previous page'
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only sm:not-sr-only sm:ml-1'>Previous</span>
        </Button>
      )}

      {/* Page numbers */}
      {visiblePages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <div
              key={`ellipsis-${index}`}
              className='flex h-10 w-10 items-center justify-center'
              aria-hidden='true'
            >
              <MoreHorizontal className='h-4 w-4' />
            </div>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size={buttonSize}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}

      {/* Next page button */}
      {showPrevNext && (
        <Button
          variant='outline'
          size={buttonSize}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label='Go to next page'
        >
          <span className='sr-only sm:not-sr-only sm:mr-1'>Next</span>
          <ChevronRight className='h-4 w-4' />
        </Button>
      )}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          variant='outline'
          size={buttonSize}
          onClick={() => onPageChange(totalPages)}
          aria-label='Go to last page'
        >
          Last
        </Button>
      )}
    </nav>
  );
}

/**
 * Simple pagination info component
 * Shows current page and total pages information
 */
export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
}: {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}) {
  const startItem =
    totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : null;

  return (
    <div className={cn('text-sm text-muted-foreground', className)}>
      {totalItems && startItem && endItem ? (
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
      ) : (
        <span>
          Page {currentPage} of {totalPages}
        </span>
      )}
    </div>
  );
}
