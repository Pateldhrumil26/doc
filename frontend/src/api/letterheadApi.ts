import axiosClient from './axiosClient.js';
import { CompanyProfile } from '../components/dashboard/CompanyProfileModal.js';

export interface LetterheadProfilesResponse {
  success: boolean;
  data: {
    profiles: Array<{
      _id: string;
      name: string;
      companyName: string;
      logo: string;
      phone: string;
      email: string;
      website: string;
      address: string;
      isDefault: boolean;
      createdAt?: string;
      updatedAt?: string;
    }>;
  };
}

export interface LetterheadProfileResponse {
  success: boolean;
  message?: string;
  data: {
    profile: {
      _id: string;
      name: string;
      companyName: string;
      logo: string;
      phone: string;
      email: string;
      website: string;
      address: string;
      isDefault: boolean;
    };
  };
}

export const letterheadApi = {
  getProfiles: async (): Promise<LetterheadProfilesResponse> => {
    const res = await axiosClient.get<LetterheadProfilesResponse>('/letterhead-profiles');
    return res.data;
  },

  createProfile: async (payload: Partial<CompanyProfile>): Promise<LetterheadProfileResponse> => {
    const res = await axiosClient.post<LetterheadProfileResponse>('/letterhead-profiles', payload);
    return res.data;
  },

  updateProfile: async (
    id: string,
    payload: Partial<CompanyProfile>
  ): Promise<LetterheadProfileResponse> => {
    const res = await axiosClient.put<LetterheadProfileResponse>(
      `/letterhead-profiles/${id}`,
      payload
    );
    return res.data;
  },

  deleteProfile: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.delete(`/letterhead-profiles/${id}`);
    return res.data;
  },
};
