import axiosClient from './axiosClient.js';
import {
  TemplateItem,
  TemplateListResponse,
  TemplateResponse,
} from '../types/template.types.js';

export const templateApi = {
  getTemplates: async (): Promise<TemplateListResponse> => {
    const res = await axiosClient.get<TemplateListResponse>('/templates');
    return res.data;
  },

  getTemplateById: async (id: string): Promise<TemplateResponse> => {
    const res = await axiosClient.get<TemplateResponse>(`/templates/${id}`);
    return res.data;
  },

  createTemplate: async (payload: Partial<TemplateItem>): Promise<TemplateResponse> => {
    const res = await axiosClient.post<TemplateResponse>('/templates', payload);
    return res.data;
  },

  deleteTemplate: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.delete(`/templates/${id}`);
    return res.data;
  },
};
