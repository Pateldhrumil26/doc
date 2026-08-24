import axiosClient from './axiosClient.js';
import {
  DocumentItem,
  DocumentListResponse,
  DocumentResponse,
} from '../types/document.types.js';

export interface DocumentQueryParams {
  search?: string;
  folder?: string;
  sort?: 'updatedAt' | 'createdAt' | 'title' | 'updatedAt_asc';
  archived?: boolean;
}

export const documentApi = {
  getDocuments: async (params?: DocumentQueryParams): Promise<DocumentListResponse> => {
    const res = await axiosClient.get<DocumentListResponse>('/documents', { params });
    return res.data;
  },

  getDocumentById: async (id: string): Promise<DocumentResponse> => {
    const res = await axiosClient.get<DocumentResponse>(`/documents/${id}`);
    return res.data;
  },

  createDocument: async (payload: Partial<DocumentItem>): Promise<DocumentResponse> => {
    const res = await axiosClient.post<DocumentResponse>('/documents', payload);
    return res.data;
  },

  updateDocument: async (
    id: string,
    payload: Partial<DocumentItem>
  ): Promise<DocumentResponse> => {
    const res = await axiosClient.put<DocumentResponse>(`/documents/${id}`, payload);
    return res.data;
  },

  deleteDocument: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.delete(`/documents/${id}`);
    return res.data;
  },

  duplicateDocument: async (id: string): Promise<DocumentResponse> => {
    const res = await axiosClient.post<DocumentResponse>(`/documents/${id}/duplicate`);
    return res.data;
  },

  renameDocument: async (id: string, title: string): Promise<DocumentResponse> => {
    const res = await axiosClient.put<DocumentResponse>(`/documents/${id}/rename`, {
      title,
    });
    return res.data;
  },
};
