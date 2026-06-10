// مراقب استهلاك الذاكرة - وضع التطوير فقط
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFeedStore } from '../../store/useFeedStore';

interface MemoryStats {
  heapUsed: string;
  heapTotal: string;
  storeRecent: number;
  storeTrending: number;
  blockedUsers: number;
}

export function MemoryMonitor() {
  if (!__DEV__) return null;

  const [stats, setStats] = useState<MemoryStats | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const sample = () => {
      try {
        const state = useFeedStore.getState();
        const recent = (state.posts?.recent || []).length;
        const trending = (state.posts?.trending || []).length;
        const blocked = (state.blockedUsers || []).length;

        // performance.memory متاح في Hermes للتطوير
        const mem = (performance as any).memory;
        const heapUsed = mem
          ? `${(mem.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB`
          : 'N/A';
        const heapTotal = mem
          ? `${(mem.totalJSHeapSize / 1024 / 1024).toFixed(1)}MB`
          : 'N/A';

        setStats({ heapUsed, heapTotal, storeRecent: recent, storeTrending: trending, blockedUsers: blocked });
      } catch {
        // تجاهل إذا كانت واجهة الذاكرة غير متاحة
      }
    };

    sample();
    intervalRef.current = setInterval(sample, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!stats) return null;

  return (
    <View style={localStyles.container} pointerEvents="none">
      <Text style={localStyles.label}>MEM {stats.heapUsed} / {stats.heapTotal}</Text>
      <Text style={localStyles.label}>
        Posts R:{stats.storeRecent} T:{stats.storeTrending} Block:{stats.blockedUsers}
      </Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 99999,
  },
  label: {
    color: '#00ff88',
    fontSize: 10,
    fontFamily: 'Courier',
    lineHeight: 14,
  },
});
