# 🖋️ AI 일기 감성 분석 프로젝트 워크플로우

이 문서는 **AI Diary Sentiment Analysis** 프로젝트의 구현 과정, 주요 기능, 그리고 기술적 스택을 정리한 문서입니다.

## 🚀 프로젝트 개요
사용자가 작성한 일기를 AI(Gemini)가 분석하여 감정 상태를 파악하고, 어울리는 제목을 생성하며, 분석 결과를 구글 시트와 로컬 스토리지에 저장하는 웹 애플리케이션입니다.

## 🛠 기술 스택
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **AI**: Gemini 3.1 Flash-Lite Preview (via Vercel AI SDK)
- **Database/Sync**: 
  - Browser LocalStorage (개인 기기 저장)
  - Google Sheets (via Google Apps Script Web App)
- **Deployment**: Vercel

## 📅 주요 구현 단계

### 1. 기본 UI 및 디자인 시스템 구축
- 연한 블루그레이 배경과 보라색 포인트 컬러를 사용한 프리미엄 디자인.
- 실시간 날짜/시간 표시 및 부드러운 애니메이션(`animate-in`) 적용.
- 감성 상태를 시각적으로 보여주는 이모지 인터페이스 구현.

### 2. AI 분석 기능 (Gemini 연동)
- `app/actions.ts`에 Server Action 구현.
- 사용자의 일기를 읽고 `sentimentId`, `title`, `analysis`를 구조화된 데이터(Zod)로 추출.
- 엔터 키를 활용한 빠른 분석 트리거 설정.

### 3. 데이터 저장 및 목록 기능
- 일기 목록 관리 기능 추가 (LocalStorage 연동).
- 개별 일기 삭제 및 AI 분석 결과 요약 보기 기능.
- [재시작] 버튼을 통한 입력란 초기화 기능.

### 4. 구글 시트 연동 (GAS)
- Google Apps Script를 활용하여 웹 앱 URL 생성.
- `POST` 요청을 통해 일기 데이터를 구글 시트에 실시간 전송 및 기록.
- `Content-Type: text/plain` 설정을 통한 GAS 호환성 최적화.

### 5. 배포 및 환경 설정
- Vercel 배포 가이드 및 필수 환경 변수 설정 (`GEMINI_API_KEY`, `GOOGLE_SCRIPT_URL`).
- 배포 환경에서의 에러 추적을 위한 상세 에러 반환 로직 구현.

## 📝 환경 변수 설정 (.env.local)
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
GOOGLE_SCRIPT_URL=your_gas_web_app_url
```

## 💡 향후 개선 아이디어
- 사용자 인증(Login) 기능 추가를 통한 개인화 서비스.
- 기간별 감정 통계를 보여주는 차트 시각화.
- 일기 에디터 기능 강화 (이미지 첨부 등).

---
**작성일**: 2026-04-16
**상태**: 기본 기능 구현 및 배포 완료 (V1.0)
