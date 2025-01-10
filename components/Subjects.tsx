"use client";

import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import {
  BookImageIcon,
  BuildingIcon,
  CarIcon,
  EllipsisIcon,
  PaletteIcon,
  PawPrintIcon,
} from "lucide-react";

import { allSubjects } from "@/data";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const Subjects = () => {
  return (
    <div className="sticky z-header-1 top-20 left-0 py-6 bg-white">
      <div className="container">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={30}
          modules={[Navigation]}
          className="mySwiper"
        >
          {allSubjects.map((subject) => (
            <SwiperSlide key={subject} className="!w-fit">
              <Link
                href={`/categories/${subject.toLowerCase()}`}
                className="flex flex-col items-center w-max px-4 text-gray-500 hover:text-neutral-800"
              >
                {subject === "CAR" && (
                  <>
                    <CarIcon className="size-8" />
                    <SubjectTitle>Cars and Bikes</SubjectTitle>
                  </>
                )}
                {subject === "PORTRAIT" && (
                  <>
                    <BookImageIcon className="size-8" />
                    <SubjectTitle>Portrait</SubjectTitle>
                  </>
                )}
                {subject === "BUILDING" && (
                  <>
                    <BuildingIcon className="size-8" />
                    <SubjectTitle>Buildings and House</SubjectTitle>
                  </>
                )}
                {subject === "ART" && (
                  <>
                    <PaletteIcon className="size-8" />
                    <SubjectTitle>Art</SubjectTitle>
                  </>
                )}
                {subject === "ANIMAL" && (
                  <>
                    <PawPrintIcon className="size-8" />
                    <SubjectTitle>Animals</SubjectTitle>
                  </>
                )}
                {subject === "OTHER" && (
                  <>
                    <EllipsisIcon className="size-8" />
                    <SubjectTitle>Other</SubjectTitle>
                  </>
                )}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Subjects;

const SubjectTitle = ({ children }: { children: React.ReactNode }) => {
  return <span className="font-medium">{children}</span>;
};
