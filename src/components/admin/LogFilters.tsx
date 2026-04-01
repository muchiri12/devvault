"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";



export default function LogFilters(){
    const router = useRouter();
    const searchParams = useSearchParams();

    // initialize state from the url if it exists 
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [action, setAction] = useState(searchParams.get("action") || "");

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (search) params.set("search" , search);
        if(action) params.set("action" , action);

       // Push the new URL, which automatically triggers the Server Component to refetch!
    router.push(`?${params.toString()}`); 
    };

    const clearFilters = () => {
        setSearch("");
        setAction("");
        router.push("?"); //clears url parameters
    };

    return(
        <form onSubmit={applyFilters}
        className="flex flex-col sm:flex-row gap-3 mb-6 bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-200 dark:border-gray-800"
        >
          {/* Search by username */}
          <input type="text" 
          placeholder="search by Admin username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-black dark:focus:border-gray-500 transition-colors text-sm dark:text-white"
          />

          {/* Filter by Action */}
      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-black dark:focus:border-gray-500 transition-colors text-sm dark:text-white cursor-pointer"
      >
        <option value="">All Actions</option>
        <option value="user.role.updated">Role Updated</option>
        <option value="user.deleted">User Deleted</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
        >
          Filter
        </button>
        {(search || action) && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            Clear
          </button>
        )}
      </div>
        </form>
    );
}