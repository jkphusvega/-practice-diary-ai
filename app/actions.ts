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
        analysis: z.string().describe('일기에 대한 따뜻하고 공감되는 감성 분석 메시지'),
      }),
      prompt: `
        다음은 사용자가 작성한 일기 내용입니다. 
        이 일기를 읽고 사용자의 감성을 분석하여 가장 적절한 감성 ID 하나를 선택하고, 
        그 이유와 함께 사용자에게 해줄 수 있는 따뜻한 분석 결과를 작성해 주세요.
        
        감성 ID 목록:
        - happy: 행복, 기쁨, 즐거움
        - sad: 슬픔, 우울, 속상함
        - angry: 화남, 짜증, 분노
        - surprised: 당황, 놀람, 의외의 상황
        - tired: 피곤, 지침, 한숨, 무력함
        
        일기 내용:
        "${content}"
        
        답변은 한국어로 작성해 주세요.
      `,
    });

    return object;
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw new Error('감성 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  }
}
