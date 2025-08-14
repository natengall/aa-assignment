import { useMemo, useState } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { reviews } from '../utils/mockReviews';

type ReviewTag = "Bad Service" | "Unexpected" | "Great" | "Excellent" | "Best Service";
type ReviewStatus = "all" | "published" | "deleted";

const ALL_TAGS: ReviewTag[] = [
   "Bad Service",
   "Unexpected",
   "Great",
   "Excellent",
   "Best Service",
];
const STAR_EMPTY = (
   <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
      width="15" height="15" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" >
      <path fill="#c4c4c4" d="M62.799,23.737c-0.47-1.399-1.681-2.419-3.139-2.642l-16.969-2.593L35.069,2.265
      C34.419,0.881,33.03,0,31.504,0c-1.527,0-2.915,0.881-3.565,2.265l-7.623,16.238L3.347,21.096c-1.458,0.223-2.669,1.242-3.138,2.642
      c-0.469,1.4-0.115,2.942,0.916,4l12.392,12.707l-2.935,17.977c-0.242,1.488,0.389,2.984,1.62,3.854
      c1.23,0.87,2.854,0.958,4.177,0.228l15.126-8.365l15.126,8.365c0.597,0.33,1.254,0.492,1.908,0.492c0.796,0,1.592-0.242,2.269-0.72
      c1.231-0.869,1.861-2.365,1.619-3.854l-2.935-17.977l12.393-12.707C62.914,26.68,63.268,25.138,62.799,23.737z"/>
   </svg>
);
const STAR_FULL = (
   <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
      width="15" height="15" viewBox="0 0 64 64" enableBackground="new 0 0 64 64">
      <path fill="#ff8723" d="M62.799,23.737c-0.47-1.399-1.681-2.419-3.139-2.642l-16.969-2.593L35.069,2.265
         C34.419,0.881,33.03,0,31.504,0c-1.527,0-2.915,0.881-3.565,2.265l-7.623,16.238L3.347,21.096c-1.458,0.223-2.669,1.242-3.138,2.642
         c-0.469,1.4-0.115,2.942,0.916,4l12.392,12.707l-2.935,17.977c-0.242,1.488,0.389,2.984,1.62,3.854
         c1.23,0.87,2.854,0.958,4.177,0.228l15.126-8.365l15.126,8.365c0.597,0.33,1.254,0.492,1.908,0.492c0.796,0,1.592-0.242,2.269-0.72
         c1.231-0.869,1.861-2.365,1.619-3.854l-2.935-17.977l12.393-12.707C62.914,26.68,63.268,25.138,62.799,23.737z"/>
   </svg>
);

function Stars({ value }: { value: number }) {
   const full = Math.round(value);
   return (
      <div className="flex items-center gap-1 text-amber-400">
         {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < full ? STAR_FULL : STAR_EMPTY}</span>
         ))}
      </div>
   );
}

export default function Reviews() {
   const [tab, setTab] = useState<ReviewStatus>("all");
   const [currentPage, setCurrentPage] = useState(1);
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const [showTagPicker, setShowTagPicker] = useState(false);
   const [tagFilters, setTagFilters] = useState<ReviewTag[]>([]);
   const [minRating, setMinRating] = useState<number | null>(null);
   const [alphaSort, setAlphaSort] = useState<"asc" | "desc" | null>(null);
   const [idSort, setIdSort] = useState<"asc" | "desc" | null>(null);

   const PER_PAGE = 5;

   const filtered = useMemo(() => {
      let filteredReviews = reviews;
      if (tab !== "all") {
         filteredReviews = filteredReviews.filter((r) => r.status === tab);
      }
      if (minRating !== null) {
         filteredReviews = filteredReviews.filter((r) => r.rating == minRating);
      }
      if (tagFilters.length > 0) {
         filteredReviews = filteredReviews.filter((r) =>
            tagFilters.every((t) => r.tags.includes(t))
         );
      }
      if (idSort) {
         filteredReviews = [...filteredReviews].sort((a, b) => (idSort === "asc" ? a.id - b.id : b.id - a.id));
      }
      if (alphaSort) {
         filteredReviews = [...filteredReviews].sort((a, b) =>
            alphaSort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
         );
      }
      return filteredReviews;
   }, [reviews, tab, minRating, tagFilters, alphaSort, idSort]);

   const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
   const page = Math.min(currentPage, pageCount);
   const startIndex = (page - 1) * PER_PAGE;
   const visible = filtered.slice(startIndex, startIndex + PER_PAGE);

   const toggleTag = (tag: ReviewTag) => {
      setTagFilters((prev) =>
         prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
   };

   const chip = (text: string, active: boolean) => {
      // Base classes that apply to all chips
      const baseClasses = "inline-flex items-center rounded-full border-2 px-3 py-[2px] text-xs font-medium tracking-tight transition-colors";
      // Determine color classes based on text and active state
      const getColorClasses = () => {
         const isNegative = text === "Bad Service" || text === "Unexpected";

         if (isNegative) {
            return active
               ? "border-red-500/50 text-white bg-red-500 dark:border-red-800/30 dark:bg-red-900/10 dark:text-red-300/80"
               : "border-red-500 text-red-600 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300";
         } else {
            return active
               ? "border-blue-500/50 text-white bg-blue-500 dark:border-blue-800/30 dark:bg-blue-900/10 dark:text-blue-300/80"
               : "border-blue-500 text-blue-600 dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-300";
         }
      };

      return (
         <span className={`${baseClasses} ${getColorClasses()}`}>
            {text.toUpperCase()}
         </span>
      );
   };

   return (
      <>
         <PageMeta title="Reviews" description="Customer reviews with filters and pagination" />
         <PageMeta
            title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
            description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
         />
         <PageBreadcrumb pageTitle="Reviews" />

         {/* Tabs and Actions */}
         <div className="flex items-center justify-between gap-4 pt-6 relative">
            <div className="flex items-center gap-6 bg-white px-8 rounded-2xl shadow-theme-xs dark:border-white/[0.06] dark:border dark:bg-gray-900">
               {([
                  { key: "all", label: "All Reviews" },
                  { key: "published", label: "Published" },
                  { key: "deleted", label: "Deleted" },
               ] as { key: ReviewStatus; label: string }[]).map((t) => (
                  <button
                     key={t.key}
                     onClick={() => setTab(t.key)}
                     className={`relative pb-4 py-4 px-2 text-sm font-medium transition-colors ${tab === t.key
                        ? "text-[#2572ed] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-full after:rounded-full after:bg-brand-500"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                  >
                     {t.label}
                  </button>
               ))}
            </div>
            {/* Tag Absolute Picker */}
            {showTagPicker && (
               <div className="absolute w-full flex justify-center -top-10 items-center z-10">
                  <div className="flex flex-wrap items-center gap-[2px] px-8 py-2 rounded-2xl border border-gray-200 bg-[#d0cbcb] p-3 shadow-theme-md dark:border-white/[0.06] dark:bg-gray-900">
                     {ALL_TAGS.map((t) => (
                        <button key={t} onClick={() => toggleTag(t)}
                           className={`focus:outline-hidden`}
                        >
                           {chip(t, tagFilters.includes(t))}
                        </button>
                     ))}
                  </div>
               </div>
            )}
            <div className="relative ml-auto flex items-center gap-3">
               {/* Filter options bar */}
               <div className="relative">
                  <div
                     className={`absolute border right-67 top-1/2 -translate-y-1/2 pl-4 pr-10 py-3 bg-[#b1b6bf] rounded-2xl flex items-center gap-2 overflow-hidden transition-all duration-300 ${isFilterOpen ? "opacity-100" : "w-0 opacity-0"
                        } dark:border-white/[0.06] dark:bg-gray-900`}
                  >
                     {/* Rating filter */}
                     <div className="flex items-center gap-2">
                        <div className="flex justify-between items-center gap-1">
                           <button
                              onClick={() => {
                                 setMinRating((r) => {
                                    if (r === null || r <= 1) {
                                       return null;
                                    }
                                    return r - 1;
                                 });
                              }}
                              className="w-10 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-white/[0.06] dark:text-gray-200"
                              title="Click to cycle min rating 1-5"
                           >
                              -
                           </button>
                           <span className="w-[55px] py-1 text-center text-xs font-medium text-gray-700  dark:text-gray-200">{minRating} {minRating === null ? "No.Rating" : "Rating"}</span>
                           <div className="hidden sm:flex">
                              <Stars value={minRating ?? 0} />
                           </div>
                           <button
                              onClick={() => {
                                 setMinRating((r) => {
                                    if (r === null) {
                                       return 1;
                                    } else if (r >= 5) return 5
                                    return r + 1;
                                 });
                              }}
                              className="w-10 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-white/[0.06] dark:text-gray-200"
                              title="Click to cycle min rating 1-5"
                           >
                              +
                           </button>
                           <span className="text-gray-400">|</span>
                        </div>

                     </div>

                     {/* Alpha sort */}
                     <button
                        onClick={() => {
                           setAlphaSort((s) => (s === "asc" ? "desc" : s === "desc" ? null : "asc"));
                           setIdSort(null);
                        }}
                        className={`w-[70px] rounded-full px-3 py-1 text-xs font-medium ${alphaSort
                           ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
                           : "bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-200"
                           }`}
                     >
                        ABC {alphaSort === "asc" ? "↑" : alphaSort === "desc" ? "↓" : ""}
                     </button>

                     {/* Id sort */}
                     <button
                        onClick={() => {
                           setIdSort((s) => (s === "asc" ? "desc" : s === "desc" ? null : "asc"));
                           setAlphaSort(null);
                        }}
                        className={`w-[70px] rounded-full px-3 py-1 text-xs font-medium ${idSort
                           ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300"
                           : "bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-200"
                           }`}
                     >
                        #123 {idSort === "asc" ? "↑" : idSort === "desc" ? "↓" : ""}
                     </button>

                     {/* Tag selector */}
                     <button
                        onClick={() => setShowTagPicker((v) => !v)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${tagFilters.length > 0
                           ? " bg-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300"
                           : "bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-200"
                           }`}
                     >
                        TAG
                     </button>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-4">
                     {/* Filter button */}
                     <button
                        onClick={() => {
                           setIsFilterOpen((v) => !v);
                           setShowTagPicker(false);
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#216fed] px-8 py-3 text-sm font-medium text-white shadow-theme-sm hover:bg-brand-600"
                     >
                        <svg className="stroke-current fill-white dark:fill-gray-800" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.29004 5.90393H17.7067" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17.7075 14.0961H2.29085" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z" fill="" stroke="" strokeWidth="1.5"></path><path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z" fill="#fff" stroke="" strokeWidth="1.5"></path></svg>
                        Filter
                     </button>
                     <button
                        onClick={() => {
                           setMinRating(null);
                           setAlphaSort(null);
                           setIdSort(null);
                           setTagFilters([]);
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl bg-orange-400 px-8 py-3 text-sm font-medium text-white shadow-theme-sm hover:bg-orange-500"
                     >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M3 3V8M3 8H8M3 8L6 5.29168C7.59227 3.86656 9.69494 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.71683 21 4.13247 18.008 3.22302 14"
                              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Refresh
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Reviews list */}
         <div className="mt-6 space-y-4">
            {visible.map((r) => (
               <div
                  key={`${r.id}`}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-white/[0.06] dark:bg-gray-900"
               >
                  <div className="flex justify-between items-start gap-6">
                     {/* Left: Avatar & User Info */}
                     <div className="flex items-start gap-4" style={{ width: "23%" }}>
                        <div className="w-20 overflow-hidden bg-gray-100 rounded-2xl">
                           <img src={r.avatar} alt={r.name} className="h-full w-full object-cover rounded-2xl" />
                        </div>
                        <div className="space-y-1 w-full">
                           <div className="flex items-center gap-2 text-xs text-blue-500">C0{r.id}</div>
                           <div className="text-sm font-semibold text-gray-900 dark:text-white/90">{r.name}</div>
                           <div className="text-[10px] text-gray-500 dark:text-gray-400">Joined on {r.joinDate}</div>
                           {r.status === "deleted" && (
                              <span className="inline-block mt-1 px-2 py-[2px] rounded-full bg-red-100 text-red-600 text-[10px] font-semibold">
                                 Deleted
                              </span>
                           )}
                        </div>
                     </div>

                     {/* Middle: Message & Tags */}
                     <div
                        className="flex flex-col justify-between h-full min-h-[90px]"
                        style={{ width: "60%" }}
                     >
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                           {r.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                           {r.tags.map((t) => (
                              <span
                                 key={t}
                                 className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-tight ${t === "Bad Service" || t === "Unexpected"
                                    ? "border-red-200 text-red-600 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300"
                                    : "border-blue-200 text-blue-600 dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-300"
                                    }`}
                              >
                                 {t.toUpperCase()}
                              </span>
                           ))}
                        </div>
                     </div>

                     {/* Right: Rating & Actions */}
                     <div className="flex flex-col items-end gap-4" style={{ width: "17%" }}>
                        <div className="flex items-center gap-2">
                           <div className="text-sm font-bold text-gray-900 dark:text-white/90">{r.rating.toFixed(1)}</div>
                           <Stars value={r.rating} />
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                           <button className="rounded-3xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.04]">
                              Archive
                           </button>
                           <button className="rounded-3xl bg-emerald-500 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-600">
                              Approve
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Footer - pagination */}
         <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-xs text-gray-500 dark:text-gray-400">
               Showing {Math.min(PER_PAGE, filtered.length - startIndex)} from {filtered.length} data
            </div>

            <div className="flex items-center gap-2">
               <button
                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
               >
                  Previous
               </button>
               {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                     <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`size-8 rounded-full text-xs font-medium ${page === pageNum
                           ? "bg-gray-300 text-gray-800 dark:bg-white/20 dark:text-white"
                           : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-300"
                           }`}
                     >
                        {pageNum}
                     </button>
                  );
               })}
               <button
                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page >= pageCount}
               >
                  Next
               </button>
            </div>
         </div>
      </>
   );
}