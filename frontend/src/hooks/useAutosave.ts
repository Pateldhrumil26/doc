import { useEffect, useRef, useState, useCallback } from 'react';
import { documentApi } from '../api/documentApi.js';
import { DocumentItem } from '../types/document.types.js';
import { SaveStatus } from '../components/editor/EditorNavbar.js';

interface UseAutosaveProps {
  documentId?: string;
  data: Partial<DocumentItem>;
  debounceMs?: number;
  enabled?: boolean;
}

export const useAutosave = ({
  documentId,
  data,
  debounceMs = 1500,
  enabled = true,
}: UseAutosaveProps) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDataRef = useRef<Partial<DocumentItem>>(data);
  const isInitialMount = useRef<boolean>(true);

  latestDataRef.current = data;

  const performSave = useCallback(
    async (payloadToSave?: Partial<DocumentItem>) => {
      if (!documentId) return;

      try {
        setSaveStatus('saving');
        const payload = payloadToSave || latestDataRef.current;
        await documentApi.updateDocument(documentId, payload);
        setSaveStatus('saved');
      } catch (error) {
        console.error('Autosave failed:', error);
        setSaveStatus('failed');
      }
    },
    [documentId]
  );

  useEffect(() => {
    if (!enabled || !documentId) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('unsaved');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, documentId, debounceMs, enabled, performSave]);

  return {
    saveStatus,
    setSaveStatus,
    saveNow: performSave,
  };
};
