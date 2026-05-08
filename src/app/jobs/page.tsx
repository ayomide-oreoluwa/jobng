"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FiSearch, FiMapPin, FiGrid, FiSliders, FiX, FiList, FiSquare } from "react-icons/fi";
import JobCard from "@/components/shared/JobCard";
import { jobs } from "@/data/jobs";

const locations = ["All Locations", "New York", "Los Angeles", "Miami", "London", "Paris", "Florida", "Nevada", "Washington", "Remote"];
const categories = ["All Categories", "Design", "Development", "Marketing", "Accounting / Finance", "Human Resource", "Health and Care", "Customer", "Project Management", "Automotive Jobs"];
const jobTypes = ["Full Time", "Part Time", "Remote", "Freelance", "Internship"];

function JobsContent() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "All Locations");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All Categories");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState("latest");

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (keyword) result = result.filter((j) => j.title.toLowerCase().includes(keyword.toLowerCase()) || j.company.toLowerCase().includes(keyword.toLowerCase()));
    if (location && location !== "All Locations") result = result.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
    if (category && category !== "All Categories") result = result.filter((j) => j.category === category);
    if (selectedTypes.length > 0) result = result.filter((j) => selectedTypes.includes(j.type));
    if (searchParams.get("filter") === "featured") result = result.filter((j) => j.featured);
    if (sortBy === "salary") result = result.sort((a, b) => a.salary.localeCompare(b.salary));
    return result;
  }, [keyword, location, category, selectedTypes, sortBy, searchParams]);

  const toggleType = (t: string) =>
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const clearFilters = () => {
    setKeyword(""); setLocation("All Locations"); setCategory("All Categories"); setSelectedTypes([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-950 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Browse All Jobs</h1>
          <p className="text-blue-200 text-base">{jobs.length.toLocaleString()}+ jobs available — find the perfect role for you</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[64px] lg:top-[80px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-xl px-3 py-2.5">
              <FiSearch className="text-blue-500 shrink-0" size={16} />
              <input
                type="text"
                placeholder="Job title, company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
              />
              {keyword && <button onClick={() => setKeyword("")}><FiX size={14} className="text-gray-400 hover:text-gray-600" /></button>}
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 min-w-[160px]">
              <FiMapPin className="text-blue-500 shrink-0" size={14} />
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full text-sm outline-none text-gray-700 bg-transparent">
                {locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 min-w-[180px]">
              <FiGrid className="text-blue-500 shrink-0" size={14} />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-sm outline-none text-gray-700 bg-transparent">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${showFilters ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-700 hover:border-blue-300"}`}
            >
              <FiSliders size={14} />
              Filters
              {selectedTypes.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-1.5 rounded-full">{selectedTypes.length}</span>}
            </button>
          </div>

          {/* Filter Chips */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">Job Type:</span>
              {jobTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    selectedTypes.includes(t)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {t}
                </button>
              ))}
              {(selectedTypes.length > 0 || keyword || location !== "All Locations" || category !== "All Categories") && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 ml-2">
                  <FiX size={12} /> Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filtered.length}</span> jobs
          </p>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none text-gray-600"
            >
              <option value="latest">Newest First</option>
              <option value="salary">By Salary</option>
            </select>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <FiList size={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <FiSquare size={14} />
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
            <button onClick={clearFilters} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} variant={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center"><div className="text-gray-500">Loading jobs...</div></div>}>
      <JobsContent />
    </Suspense>
  );
}
