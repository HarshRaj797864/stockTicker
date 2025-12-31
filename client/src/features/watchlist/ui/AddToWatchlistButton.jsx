import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../shared/lib/api";
import { useAddToWatchlist } from "../api/mutations";

const useMyWatchlists = () => {
  return useQuery({
    queryKey: ["watchlists"],
    queryFn: async () => {
      const res = await api.get("/watchlists");
      return res.data;
    },
  });
};

export const AddToWatchlistButton = ({ ticker }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: watchlists } = useMyWatchlists();
  const mutation = useAddToWatchlist();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAdd = (watchlistId) => {
    mutation.mutate({ watchlistId, ticker });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            setIsOpen(!isOpen);
        }}
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition z-10 relative"
      >
        + Add
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-xl z-20 p-2">
          <p className="text-xs text-gray-500 mb-2 px-2">Select Watchlist:</p>
          {watchlists?.length > 0 ? (
            watchlists.map((list) => (
              <button
                key={list.id}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAdd(list.id);
                }}
                className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded text-gray-800"
              >
                {list.name}
              </button>
            ))
          ) : (
            <p className="text-xs text-red-500 px-2">No watchlists found.</p>
          )}
        </div>
      )}
    </div>
  );
};
