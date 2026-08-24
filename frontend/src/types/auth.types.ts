export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyGst?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyGst?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}
