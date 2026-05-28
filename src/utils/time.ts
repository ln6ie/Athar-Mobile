/**
 * Time utility helper functions for the Athar app.
 * Follows strict TypeScript and zero-emoji guidelines.
 */

export const getRemainingTimeText = (createdAtStr: string): string => {
  const createdAt = new Date(createdAtStr).getTime();
  const expiresAt = createdAt + 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();
  const diffMs = expiresAt - now;

  if (diffMs <= 0) {
    return 'انتهى المنشور';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (diffHours > 0) {
    if (diffHours === 1) {
      return remainingMinutes > 0 
        ? `ينتهي بعد ساعة و ${remainingMinutes} دقيقة`
        : 'ينتهي بعد ساعة';
    }
    if (diffHours === 2) {
      return remainingMinutes > 0 
        ? `ينتهي بعد ساعتين و ${remainingMinutes} دقيقة`
        : 'ينتهي بعد ساعتين';
    }
    if (diffHours >= 3 && diffHours <= 10) {
      return remainingMinutes > 0
        ? `ينتهي بعد ${diffHours} ساعات و ${remainingMinutes} دقيقة`
        : `ينتهي بعد ${diffHours} ساعات`;
    }
    return remainingMinutes > 0
      ? `ينتهي بعد ${diffHours} ساعة و ${remainingMinutes} دقيقة`
      : `ينتهي بعد ${diffHours} ساعة`;
  } else {
    if (diffMinutes === 1) {
      return 'ينتهي بعد دقيقة';
    }
    if (diffMinutes === 2) {
      return 'ينتهي بعد دقيقتين';
    }
    if (diffMinutes >= 3 && diffMinutes <= 10) {
      return `ينتهي  بعد ${diffMinutes} دقائق`;
    }
    return `ينتهي بعد ${diffMinutes} دقيقة`;
  }
};
