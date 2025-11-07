"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "flex-living-approved-reviews";

const ensureArrayOfNumbers = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const parsed = Number(item);
      return Number.isFinite(parsed) ? parsed : null;
    })
    .filter((item): item is number => item !== null);
};

export const useApprovedReviews = (initialValue: number[] = []) => {
  const [approvedIds, setApprovedIds] = useState<number[]>(initialValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setApprovedIds(ensureArrayOfNumbers(parsed));
      }
    } catch (error) {
      console.warn("[Flex Living] Unable to read approved reviews from storage", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(approvedIds));
    } catch (error) {
      console.warn("[Flex Living] Unable to persist approved reviews to storage", error);
    }
  }, [approvedIds]);

  const isApproved = useCallback(
    (id: number) => approvedIds.includes(id),
    [approvedIds],
  );

  const approve = useCallback(
    (id: number) => {
      setApprovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [],
  );

  const unapprove = useCallback(
    (id: number) => {
      setApprovedIds((prev) => prev.filter((existingId) => existingId !== id));
    },
    [],
  );

  const toggle = useCallback(
    (id: number) => {
      setApprovedIds((prev) => (prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]));
    },
    [],
  );

  const clear = useCallback(() => setApprovedIds([]), []);

  const approvedSet = useMemo(() => new Set(approvedIds), [approvedIds]);

  return {
    approvedIds,
    approvedSet,
    setApprovedIds,
    isApproved,
    approve,
    unapprove,
    toggle,
    clear,
  };
};

