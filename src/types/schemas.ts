// مخططات التحقق من صحة البيانات باستخدام Zod
import { z } from 'zod';
import i18n from '../constants/locales';

export const EmailSchema = z.string()
  .email({ message: i18n.t('validation.email_invalid') })
  .trim();

export const RequestOtpSchema = z.object({
  email: EmailSchema,
});

export const OtpVerifySchema = z.object({
  email: EmailSchema,
  code: z.string().length(6, { message: i18n.t('validation.code_length') }).regex(/^\d+$/, { message: i18n.t('validation.code_digits') }),
});

export const CreatePostSchema = z.object({
  content: z.string()
    .min(1, { message: i18n.t('validation.content_empty') })
    .max(300, { message: i18n.t('validation.content_max') })
    .trim(),
});
