export interface CandidateData {
  first_name: string;
  last_name: string;
  email_addresses: EmailAddress[];
  phone_numbers: PhoneNumber[];
  social_media_addresses: SocialMediaAddress[];
  applications: Application[];
  attachments: Attachment[];
}

export interface EmailAddress {
  value: string;
  type: 'personal' | 'work' | 'other';
}

export interface PhoneNumber {
  value: string;
  type: 'mobile' | 'home' | 'work' | 'other';
}

export interface SocialMediaAddress {
  value: string;
}

export interface Application {
  job_id: number;
}

export interface Attachment {
  filename: string;
  type: 'resume' | 'cover_letter' | 'other';
  content: string;
  content_type: string;
}

export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  coverLetter: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface GreenhouseCandidate {
  id: number;
  first_name: string;
  last_name: string;
  email_addresses: EmailAddress[];
  created_at: string;
  updated_at: string;
}