// دوال مساعدة لتنسيق الوقت والتواريخ بالعربية
import i18n from 'i18next';

export const getRemainingTimeText = (createdAtStr: string): string => {
  const createdAt = new Date(createdAtStr).getTime();
  const expiresAt = createdAt + 24 * 60 * 60 * 1000;
  const now = Date.now();
  const diffMs = expiresAt - now;

  if (diffMs <= 0) {
    return i18n.t('time.expired');
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (diffHours > 0) {
    if (diffHours === 1) {
      return remainingMinutes > 0
        ? i18n.t('time.expires_in_hour_minutes', { minutes: remainingMinutes })
        : i18n.t('time.expires_in_hour');
    }
    if (diffHours === 2) {
      return remainingMinutes > 0
        ? i18n.t('time.expires_in_2hours_minutes', { minutes: remainingMinutes })
        : i18n.t('time.expires_in_2hours');
    }
    if (diffHours >= 3 && diffHours <= 10) {
      return remainingMinutes > 0
        ? i18n.t('time.expires_in_hours_minutes', { hours: diffHours, minutes: remainingMinutes })
        : i18n.t('time.expires_in_hours', { hours: diffHours });
    }
    return remainingMinutes > 0
      ? i18n.t('time.expires_in_hour_single_minutes', { hours: diffHours, minutes: remainingMinutes })
      : i18n.t('time.expires_in_hour_single', { hours: diffHours });
  } else {
    if (diffMinutes === 1) {
      return i18n.t('time.expires_in_minute');
    }
    if (diffMinutes === 2) {
      return i18n.t('time.expires_in_2minutes');
    }
    if (diffMinutes >= 3 && diffMinutes <= 10) {
      return i18n.t('time.expires_in_minutes_plural', { minutes: diffMinutes });
    }
    return i18n.t('time.expires_in_minutes_single', { minutes: diffMinutes });
  }
};
