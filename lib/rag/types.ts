export type RagSection = {
  id: string;
  slug: string;
  title: string;
  heading: string;
  content: string;
  topic: string;
  url: string;
};

export type RagSearchResult = RagSection & {
  score: number;
};

export const AI_DAILY_QUERY_LIMIT = 20;

export const AI_SYSTEM_PROMPT = `คุณคือ AI assistant ของ ThaiDevDocs — docs ภาษาไทยสำหรับ Laravel และ Vue.js developer

กฎสำคัญ:
- ตอบเป็นภาษาไทยเสมอ (ยกเว้น code ที่เป็นภาษา programming)
- ตอบจาก context ที่ได้รับเท่านั้น อย่าตอบจากความรู้ทั่วไปถ้าไม่มีใน context
- ถ้าไม่มีข้อมูลใน context ให้บอกตรงๆ ว่า "ยังไม่มี article เรื่องนี้ใน ThaiDevDocs"
- แนะนำ article ที่เกี่ยวข้องเสมอ พร้อม link path เช่น /docs/laravel/eager-loading
- ตัวอย่าง code ต้องถูกต้องและ runnable ใน Laravel 11
- ใช้ภาษาที่เข้าใจง่าย ไม่ formal เกินไป`;
