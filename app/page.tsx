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

    try {
      const result = await analyzeDiary(diary);
      setSelectedSentiment(result.sentimentId);
      setAnalysisResult(result.analysis);
    } catch (error: any) {
      alert(error.message || "분석 중 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
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
          
          <div className="mt-4 flex justify-end">
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
        <div className="flex justify-center rounded-[32px] bg-white/40 p-6 shadow-sm backdrop-blur-md border border-white/20">
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-[32px] bg-white p-8 shadow-sm border border-[#7B61FF]/10">
            <h3 className="text-lg font-bold text-[#7B61FF] mb-3 flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#7B61FF]/10">✨</span> AI 일기 감성 분석 결과
            </h3>
            <p className="text-lg leading-relaxed text-[#4A5568] whitespace-pre-wrap">
              {analysisResult}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
