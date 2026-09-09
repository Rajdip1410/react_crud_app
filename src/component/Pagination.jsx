import React from "react";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import { cn } from "../utils/cn";
import { redirect } from "react-router-dom";

export const Pagination = ({
  currentPage,
  lastPage,
  total,
  limit,
  setLimit,
  onpagechange = () => {},
}) => {
  if (!lastPage || lastPage <= 1) return;

  const pages = [];
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(lastPage, currentPage + 1);

  if (start > 1) {
    pages.push(1);

    if (start > 2) pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < lastPage) {
    if (end < lastPage - 1) pages.push("...");
    pages.push(lastPage);
  }

  return (
    <div className="flex items-center justify-between gap-1 mt-6 border-t pt-6 ">
      <span className=" text-indigo-600">
        showing <i>{(currentPage - 1) * limit + 1}</i> to{" "}
        <i>{(currentPage - 1) * limit + limit}</i> from <b>{total}</b> results
      </span>

      <div className="flex items-center justify-center gap-1">
        <select
          className="bg-gray-200 border border-gray-500 hover:border-blue-500 hover:bg-gray-50 text-gray-900 font-medium px-4 py-2 pr-8 rounded-lg shadow-sm cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          name="limit"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            onpagechange(1);
          }}
        >
          <option value="5">5 / page</option>
          <option value="10">10 / page</option>
          <option value="15">15 / page</option>
          <option value="20">20 / page</option>
          <option value="25">25 / page</option>
        </select>

        <button
          disabled={currentPage === 1}
          onClick={() => onpagechange(currentPage - 1)}
          className={cn(
            "w-8 h-8 ml-3 flex items-center justify-center rounded-full curdor-pointer hover:border hover:border-gray-200 hover:bg-gray-100",
            currentPage === 1
              ? "cursor-not-allowed text-gray-400 "
              : "cursor-pointer text-gray-600 ",
          )}
        >
          <GrFormPrevious className="h-6 w-6" />
        </button>
        {pages.map((page, index) =>
          pages === "..." ? (
            <span key={index} className="bg-gray-600">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onpagechange(page)}
              className={`h-8 w-8 flex items-center justify-center border cursor-pointer ${currentPage === page ? "bg-indigo-600 text-white rounded-full" : "bg-gray-200 rounded-full"}`}
            >
              {page}
            </button>
          ),
        )}
        <button
          // disabled={(currentPage - 1) * limit + 10 === total}
          disabled={currentPage === lastPage}
          onClick={() => onpagechange(currentPage + 1)}
          className={cn(
            "w-8 h-8 ml-3 flex items-center justify-center rounded-full curdor-pointer hover:border hover:border-gray-200 hover:bg-gray-100",
            currentPage === lastPage
              ? "cursor-not-allowed text-gray-400 "
              : "cursor-pointer text-gray-600 ",
          )}
        >
          <GrFormNext className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
