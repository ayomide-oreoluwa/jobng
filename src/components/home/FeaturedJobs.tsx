"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import JobCard from "@/components/shared/JobCard";
import SectionHeader from "@/components/shared/SectionHeader";
import { getFeaturedJobs } from "@/data/jobs";

const featuredJobs = getFeaturedJobs();

export default function FeaturedJobs() {
  return (
    <section style={{ padding: "80px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 40 }}>
          <SectionHeader
            subtitle="Hot Opportunities"
            title="Featured Jobs"
            description="Know your worth and find the job that qualifies your life"
            center={false}
          />
          <Link
            href="/jobs?filter=featured"
            style={{
              fontSize: 13, fontWeight: 600, color: "#1967D2",
              textDecoration: "none", border: "1.5px solid #bfdbfe",
              padding: "8px 18px", borderRadius: 8, whiteSpace: "nowrap",
              marginBottom: 40,
            }}
          >
            Browse All Jobs →
          </Link>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          style={{ paddingBottom: 48 }}
        >
          {featuredJobs.map((job) => (
            <SwiperSlide key={job.id} style={{ height: "auto" }}>
              <JobCard job={job} variant="grid" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
