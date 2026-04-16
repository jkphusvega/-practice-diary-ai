'use server';

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function analyzeDiary(content: string) {
  if (!content || content.trim().length < 5) {
    throw new Error('일기 내용이 너무 짧습니다. 조금 더 자세히 적어보세요.');
  }

  try {
    const { object } = await generateObject({
      model: google('gemini-3.1-flash-lite-preview'),
      schema: z.object({
        sentimentId: z.enum(['happy', 'sad', 'angry', 'surprised', 'tired']),
        title: z.string().describe('일기 내용을 한 문장으로 요약한 감성적인 제목'),
        analysis: z.string().describe('일기에 대한 따뜻하고 공감되는 감성 분석 메시지'),
      }),
      prompt: `
        다음은 사용자가 작성한 일기 내용입니다. 
        이 일기를 읽고 다음 작업을 수행해 주세요:
        1. 사용자의 감성을 분석하여 가장 적절한 감성 ID 하나 선택
        2. 일기 내용을 요약하는 감성적이고 짧은 제목 생성 (5~10자 내외)
        3. 그 이유와 함께 사용자에게 해줄 수 있는 따뜻한 분석 결과 작성
        
        감성 ID 목록:
        - happy: 행복, 기쁨, 즐거움
        - sad: 슬픔, 우울, 속상함
        - angry: 화남, 짜증, 분노
        - surprised: 당황, 놀람, 의외의 상황
        - tired: 피곤, 지침, 한숨, 무력함
        
        일기 내용:
        "${content}"
        
        대화하듯 한국어로 따뜻하게 답변해 주세요.
      `,
    });

    return object;
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw new Error('감성 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  }
}

export async function saveToGoogleSheet(data: {
  date: string;
  title: string;
  content: string;
  sentiment: string;
  analysis: string;
}) {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) {
    throw new Error('Google Script URL이 설정되지 않았습니다.');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('구글 시트 저장에 실패했습니다.');
    }

    return true;
  } catch (error) {
    console.error('Google Sheet Sync Error:', error);
    throw new Error('서버와 통신 중 오류가 발생했습니다.');
  }
}
