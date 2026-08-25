import axiosClient from './axiosClient.js';
import {
  DocumentVersionListResponse,
  DocumentVersionResponse,
} from '../types/document.types.js';

export const versionApi = {
  getVersions: async (docId: string): Promise<DocumentVersionListResponse> => {
    const res = await axiosClient.get<DocumentVersionListResponse>(`/documents/${docId}/versions`);
    return res.data;
  },

  getVersionById: async (docId: string, versionId: string): Promise<DocumentVersionResponse> => {
    const res = await axiosClient.get<DocumentVersionResponse>(
      `/documents/${docId}/versions/${versionId}`
    );
    return res.data;
  },

  createVersion: async (
    docId: string,
    changeSummary?: string
  ): Promise<DocumentVersionResponse> => {
    const res = await axiosClient.post<DocumentVersionResponse>(`/documents/${docId}/versions`, {
      changeSummary,
    });
    return res.data;
  },

  restoreVersion: async (docId: string, versionId: string): Promise<DocumentVersionResponse> => {
    const res = await axiosClient.post<DocumentVersionResponse>(
      `/documents/${docId}/versions/${versionId}/restore`
    );
    return res.data;
  },

  deleteVersion: async (
    docId: string,
    versionId: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.delete(`/documents/${docId}/versions/${versionId}`);
    return res.data;
  },
};
