This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🛠️ 개발 프롬프트 기록 (Implementation Steps)

프로젝트 구축 과정에서 사용된 핵심적인 요청사항들을 단계별로 정리했습니다.

### 1단계: 프리미엄 UI 및 기본 구조 설계

- "연한 블루그레이 배경과 보라색 포인트 컬러를 사용한 세련된 AI 일기 분석 웹을 만들어줘. 실시간 날짜 표시와 감성적인 이모지 인터페이스가 포함되어야 해."
- "일기를 쓰고 엔터를 누르면 바로 분석이 시작되도록 로직을 짜줘. (Shift+Enter는 줄바꿈)"

### 2단계: Gemini AI 연동 및 분석 로직 고도화

- "Gemini 3.1 Flash-Lite 모델을 사용해서 일기 내용을 분석하고, '행복/슬픔/화남/놀람/지침' 중 하나를 선택해줘. 분석 메시지는 따뜻하고 공감되는 말투로 작성해줘."
- "일기 내용을 요약해서 5~10자 내외의 감성적인 제목을 자동으로 생성해서 이모지 위에 보여줘."

### 3단계: 로컬 저장소 및 일기 목록 보기

- "브라우저의 localStorage를 사용해서 일기를 저장하고, '일기 목록' 버튼을 누르면 모달창으로 그동안 쓴 일기들을 볼 수 있게 해줘. 삭제 기능도 포함해줘."

### 4단계: 구글 시트 연동 (Server-side Sync)

- "Google Apps Script(GAS)를 사용해서 작성한 일기를 구글 시트에 실시간으로 동기화하는 기능을 추가해줘. 날짜, 제목, 내용, 감정, 분석결과가 각각 열로 들어가야 해."

### 5단계: 배포 최적화 및 디버깅

- "Vercel 배포 시 발생하는 Server Component 에러를 고치기 위해, 에러 발생 시 상세 원인을 화면에 띄워주는 디버깅 로직을 추가해줘."
- "구글 시트 저장 시 로딩 상태를 보여주는 스피너와 '저장 중' 표시를 버튼에 추가해줘."
