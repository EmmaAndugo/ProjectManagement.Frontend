import axiosClient from '../axiosClient'

export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

export interface LoginResponse {
  message: string
  requiresOtp: boolean
  usernameOrEmail: string
  expiresAt: string
}

export interface VerifyOtpRequest {
  usernameOrEmail: string
  code: string
  purpose: string
}

export interface OtpVerificationResponse {
  message: string
  verificationToken: string
  expiresAt: string
}

export interface CompleteLoginRequest {
  verificationToken: string
}

export interface CompleteLoginResponse {
  message: string
  token: string
  user: {
    id: string
    email: string
    username: string
    fullName: string
    avatarUrl?: string | null
    isActive: boolean
    role: string
  }
}

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>(
    '/api/Auth/login',
    credentials
  )

  return response.data
}

export const registerUser = async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await axiosClient.post<RegisterResponse>(
    '/api/Auth/register',
    request
  )

  return response.data
}

export const verifyOtp = async (
  request: VerifyOtpRequest
): Promise<OtpVerificationResponse> => {
  const response = await axiosClient.post<OtpVerificationResponse>(
    '/api/Auth/verify-otp',
    request
  )

  return response.data
}

export const completeLogin = async (
  request: CompleteLoginRequest
): Promise<CompleteLoginResponse> => {
  const response = await axiosClient.post<CompleteLoginResponse>(
    '/api/Auth/complete-login',
    request
  )

  return response.data
}

export interface RegisterRequest {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  message: string
  user: {
    id: string
    email: string
    username: string
    fullName: string
    avatarUrl?: string | null
    isActive: boolean
  }
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  expiresAt: string
}

export const forgotPassword = async (
  request: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await axiosClient.post<ForgotPasswordResponse>(
    '/api/Auth/forgot-password',
    request
  )

  return response.data
}

export interface ResetPasswordRequest {
  verificationToken: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

export const resetPassword = async (
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const response = await axiosClient.post<ResetPasswordResponse>(
    '/api/Auth/reset-password',
    request
  )

  return response.data
}

export interface RequestOtpRequest {
  usernameOrEmail: string
  purpose: string
}

export interface RequestOtpResponse {
  message: string
  expiresAt: string
}

export const requestOtp = async (
  request: RequestOtpRequest
): Promise<RequestOtpResponse> => {
  const response = await axiosClient.post<RequestOtpResponse>(
    '/api/Auth/request-otp',
    request
  )

  return response.data
}