"use client";
import React, { useState, useEffect } from "react";
import styles from "./jonfairInterns.module.css";
import { Banner } from "@/components/common/Banner/Banner";
import { SubHeadNavbar } from "@/components/common/SubHeadNavbar";
import { SearchInput } from "@/components/common/SearchInput";
import { Dropdown } from "@/components/common/Dropdown/Dropdown";
import { VideoCard } from "@/components/common/VideoCard/VideoCard";
import { CommonAxios } from "@/utils/CommonAxios/CommonAxios";

interface Interview {
  id: number;
  title: string;
  youtubeId: string;
  year: number;
  talkerBelonging: string;
  talkerName: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const YEARS = ["전체", "2024", "2023", "2022", "2021"];

const InternsPage = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInterviews = async () => {
    try {
      const response = await CommonAxios.get("/jobInterviews", {
        params: {
          year: selectedYear !== "전체" ? selectedYear : undefined, // "All"이면 연도 필터를 적용하지 않음
          search: searchQuery || undefined, // 검색어 필터
          page: 0,
          size: 100,
        },
      });

      const filteredInterviewss = response.data.content.filter(
        (item: Interview) => item.category === "INTERN" // category 필터
      );
      console.log("API Response:", response.data);
      setInterviews(filteredInterviewss);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [selectedYear, searchQuery]);

  const filteredInterviews = interviews.filter((interview) => {
    const searchLower = searchQuery.trim().normalize("NFC").toLowerCase(); // 검색어 소문자로 변환 및 공백 제거
    const interviewTitle = interview.title.normalize("NFC").toLowerCase();
    const isMatchingSearch =
      !searchQuery || // 검색어가 없으면 무조건 true
      interviewTitle.includes(searchLower);

    const isMatchingYear =
      !selectedYear || // 선택된 연도가 없으면 무조건 true
      selectedYear === "전체" || // "All" 선택 시 모든 연도 허용
      String(interview.year) === selectedYear;

    return isMatchingSearch && isMatchingYear; // 검색어와 연도 둘 다 만족하는 경우
  });

  const handleYearSelect = (year: string) => {
    setSelectedYear(year); // 선택된 연도 업데이트
  };

  return (
    <div>
      <div className={styles.container}>
        <SubHeadNavbar title="Job Fair" />
        <Banner
          type="PROJECT"
          title="잡페어"
          subtitle="Job Fair"
          text="S-TOP Job Fair는 현업에 종사하고 있는 선배 개발자님들과 실무 경험을 얻고자 하는 학생들을 연결하여, IT 인재 양성 문화를 함께 만들기 위해 기획되었습니다."
        />
      </div>
      <div className={styles.backColor}>
        <div className={styles.search}>
          <h2 className={styles.title}>인턴들의 이야기</h2>
          <div className={styles.searchArea}>
            <SearchInput placeholder="영상 검색" onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className={styles.dropdown}>
            <Dropdown
              options={YEARS}
              placeholder="연도 선택"
              selectedOption={selectedYear}
              onOptionClick={handleYearSelect}
            />
          </div>
        </div>
        <div className={styles.videoGrid}>
          {filteredInterviews.map((interview) => (
            <VideoCard
              key={interview.id}
              title={interview.title}
              subtitle={interview.talkerName}
              videoUrl={`https://www.youtube.com/embed/${interview.youtubeId}`}
              bookmarked={false}
              onBookmarkToggle={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternsPage;