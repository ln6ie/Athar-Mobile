import { z } from 'zod';

export const EmailSchema = z.string()
  .email({ message: 'البريد الإلكتروني غير صالح' })
  .trim();

export const RequestOtpSchema = z.object({
  email: EmailSchema,
});

export const OtpVerifySchema = z.object({
  email: EmailSchema,
  code: z.string().length(6, { message: 'يجب أن يتكون الرمز من 6 أرقام' }).regex(/^\d+$/, { message: 'يجب أن يكون الرمز رقمياً فقط' }),
});

export const CreatePostSchema = z.object({
  content: z.string()
    .min(1, { message: 'لا يمكن نشر أثر فارغ' })
    .max(300, { message: 'لا يمكن أن يتجاوز الأثر 300 حرفاً' })
    .trim(),
});
