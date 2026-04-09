"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { analyzeDiary } from "./actions";

const SENTIMENTS = [
  { id: "happy", emoji: "😊", label: "행복함" },
  { id: "sad", emoji: "😢", label: "슬픔" },
  { id: "angry", emoji: "😡", label: "화남" },
  { id: "surprised", emoji: "😮", label: "놀람" },
  { id: "tired", emoji: "😮‍💨", label: "한숨" },
];

export default function Home() {
  const [diary, setDiary] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const months = date.getMonth() + 1;
    const days = date.getDate();
    return `${months}월 ${days}일`;
  };

  const formatDayAndTime = (date: Date) => {
    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const day = days[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    return `${day} • ${period} ${displayHours}:${minutes}`;
  };

  const handleAnalyze = async () => {
    if (!diary.trim()) return;
    
    setAnalyzing(true);
    setSelectedSentiment(null);
    setAnalysisResult("");
    setDiaryTitle("");

    try {
      const result = await analyzeDiary(diary);
      setSelectedSentiment(result.sentimentId);
      setDiaryTitle(result.title);
      setAnalysisResult(result.analysis);
    } catch (error: any) {
      alert(error.message || "분석 중 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRestart = () => {
    if (confirm("일기를 초기화하고 다시 작성하시겠습니까?")) {
      setDiary("");
      setSelectedSentiment(null);
      setAnalysisResult("");
      setDiaryTitle("");
    }
  };

  const handleSave = () => {
    alert("일기가 성공적으로 저장되었습니다!");
    // Later, this could save to a database.
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F1F4F9] px-6 py-12 font-sans text-[#1A202C]">
      <div className="w-full max-w-2xl flex flex-col gap-8 mt-2">
        {/* Header Section */}
        <header className="flex justify-between items-start">
          <div className="flex flex-col">
            <h1 className="text-5xl font-extrabold tracking-tight text-[#2D3748]">
              {formatDate(currentTime)}
            </h1>
            <p className="mt-2 text-lg font-medium text-[#718096]">
              {formatDayAndTime(currentTime)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 mt-1">
            <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-[#4A5568] shadow-sm transition-all hover:bg-gray-50 active:scale-95">
              <svg className="w-4 h-4 text-[#7B61FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              일기 목록
            </button>
            <span className="text-xl font-bold text-[#2D3748]">오늘의 일기 회고</span>
          </div>
        </header>

        {/* Input Area */}
        <div className="relative flex flex-col overflow-hidden rounded-[40px] bg-white p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)]">
          <textarea
            className="h-64 w-full resize-none border-none text-xl leading-relaxed text-[#4A5568] placeholder:text-[#CBD5E0] focus:outline-none focus:ring-0"
            placeholder="오늘 하루는 어떠셨나요? 당신의 마음을 들려주세요. (Enter를 눌러 분석)"
            value={diary}
            onChange={(e) => setDiary(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
          />
          
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 rounded-2xl bg-gray-50 px-6 py-3 text-base font-bold text-[#718096] transition-all hover:bg-gray-100 hover:text-[#4A5568] active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              재시작
            </button>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !diary.trim()}
              className={`flex items-center gap-2 rounded-3xl px-8 py-4 text-lg font-bold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50
                ${analyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95]'}
              `}
            >
              {analyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  분석 중...
                </div>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5zM6 14l1 3.5L10.5 15 7 14l-1-3.5zM18 14l1 3.5L22.5 15 19 14l-1-3.5z" />
                  </svg>
                  AI 분석하기
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sentiment Display */}
        <div className="flex flex-col items-center gap-6 rounded-[32px] bg-white/40 p-10 shadow-sm backdrop-blur-md border border-white/20">
          {diaryTitle && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500 mb-2">
              <h2 className="text-2xl font-black text-[#2D3748] tracking-tight bg-white/80 px-6 py-2 rounded-2xl shadow-sm border border-white/50">
                "{diaryTitle}"
              </h2>
            </div>
          )}
          <div className="flex w-full justify-between items-center max-w-lg px-4">
            {SENTIMENTS.map((s) => (
              <div
                key={s.id}
                className={`flex h-20 w-20 flex-col items-center justify-center rounded-full transition-all duration-500
                  ${selectedSentiment === s.id 
                    ? "scale-125 shadow-2xl bg-white ring-4 ring-[#7C3AED]/10 z-10 opacity-100" 
                    : "bg-[#E2E8F0]/40 opacity-50 grayscale hover:opacity-80 hover:grayscale-0"}
                `}
              >
                <span className="text-4xl translate-y-[-1px]">{s.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Result Text Area */}
        {analysisResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-[32px] bg-white p-10 shadow-sm border border-[#7B61FF]/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#7B61FF] flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#7B61FF]/10 text-2xl">✨</span> AI 일기 감성 분석 결과
              </h3>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#7B61FF] to-[#6366F1] px-6 py-3 text-base font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                분석 결과 저장
              </button>
            </div>
            <p className="text-xl leading-relaxed text-[#4A5568] whitespace-pre-wrap">
              {analysisResult}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
