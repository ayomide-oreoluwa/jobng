import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiBriefcase, FiCalendar, FiDollarSign, FiClock, FiBookmark, FiShare2, FiArrowLeft, FiExternalLink, FiCheckCircle } from "react-icons/fi";
import { getJobById, jobs } from "@/data/jobs";
import { getEmployerById } from "@/data/employers";
import JobCard from "@/components/shared/JobCard";

export function generateStaticParams() {
  return jobs.map((j) => ({ id: j.id }));
}

const typeColors: Record<string, string> = {
  "Full Time": "bg-blue-100 text-blue-700",
  "Part Time": "bg-green-100 text-green-700",
  "Remote": "bg-purple-100 text-purple-700",
  "Freelance": "bg-orange-100 text-orange-700",
  "Internship": "bg-pink-100 text-pink-700",
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = getJobById(params.id);
  if (!job) notFound();
  const employer = getEmployerById(job.employerId);
  const relatedJobs = jobs.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
            <FiArrowLeft size={14} /> Back to Jobs
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 bg-white shrink-0">
              <Image src={job.companyLogo} alt={job.company} width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-blue-200">
                <span>{job.company}</span>
                <span className="flex items-center gap-1"><FiMapPin size={12} />{job.location}</span>
                <span className="flex items-center gap-1"><FiCalendar size={12} />Posted {job.postedDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {job.urgent && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Urgent</span>}
              {job.featured && <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Featured</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Meta Quick Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-sm">
              {[
                { icon: FiDollarSign, label: "Salary", value: job.salary },
                { icon: FiBriefcase, label: "Job Type", value: job.type },
                { icon: FiClock, label: "Experience", value: job.experience },
                { icon: FiCalendar, label: "Deadline", value: job.deadline },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="text-blue-600" size={16} />
                  </div>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-gray-600">
                    <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" size={16} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2.5">
                {job.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-gray-600">
                    <FiCheckCircle className="text-blue-500 mt-0.5 shrink-0" size={16} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Skills & Tags</h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Jobs</h2>
                <div className="space-y-4">
                  {relatedJobs.map((j) => <JobCard key={j.id} job={j} />)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Apply Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-28">
              <div className="text-center mb-5">
                <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4 ${typeColors[job.type] ?? "bg-gray-100 text-gray-600"}`}>
                  {job.type}
                </span>
                <div className="text-2xl font-bold text-blue-600">{job.salary}</div>
                <p className="text-xs text-gray-400 mt-1">Competitive salary package</p>
              </div>
              <Link
                href="/login"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center transition-colors text-sm mb-3"
              >
                Apply Now
              </Link>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <FiBookmark size={14} /> Save
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <FiShare2 size={14} /> Share
                </button>
              </div>
            </div>

            {/* Company Info */}
            {employer && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">About the Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                    <Image src={employer.logo} alt={employer.name} width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{employer.name}</p>
                    <p className="text-xs text-gray-500">{employer.industry}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{employer.description}</p>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex justify-between"><span>Founded</span><span className="font-medium text-gray-700">{employer.founded}</span></div>
                  <div className="flex justify-between"><span>Employees</span><span className="font-medium text-gray-700">{employer.employees}</span></div>
                  <div className="flex justify-between"><span>Location</span><span className="font-medium text-gray-700">{employer.location}</span></div>
                  <div className="flex justify-between"><span>Open Jobs</span><span className="font-medium text-blue-600">{employer.openJobs}</span></div>
                </div>
                <Link
                  href={`/employers/${employer.id}`}
                  className="mt-4 flex items-center justify-center gap-2 w-full border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  <FiExternalLink size={13} /> View Company
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
