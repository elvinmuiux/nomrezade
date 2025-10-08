/**
 * User ve authentication ile ilgili type'lar
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPremium: boolean;
  loginTime: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface FeedbackData {
  name: string;
  email: string;
  phone: string;
  rating: string;
  feedbackType: string;
  subject: string;
  message: string;
  date: string;
  timestamp: number;
}

// Register state for server actions
export interface RegisterState {
  message: string | null;
  issues?: { [key: string]: string[] | undefined };
  user?: Omit<User, 'password'>;
  error?: string;
}
