import { useState, useCallback } from 'react';
import { ApplicationFormData } from '@/app/types/greenhouse';

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: string, value: string | File | null): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        }
        if (typeof value === 'string' && value.length < 2) {
          return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        }
        break;

      case 'email':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'Email is required';
        }
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
          }
        }
        break;

      case 'phone':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'Phone number is required';
        }
        if (typeof value === 'string') {
          const phoneDigits = value.replace(/\D/g, '');
          if (phoneDigits.length < 10) {
            return 'Phone number must be at least 10 digits';
          }
        }
        break;

      case 'linkedinUrl':
        if (value && typeof value === 'string' && value.trim()) {
          try {
            const url = new URL(value);
            if (!url.hostname.includes('linkedin.com')) {
              return 'Please enter a valid LinkedIn URL';
            }
          } catch {
            return 'Please enter a valid URL';
          }
        }
        break;

      case 'resume':
        if (!value) {
          return 'Resume is required';
        }
        if (value instanceof File) {
          const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          if (!validTypes.includes(value.type)) {
            return 'Resume must be PDF, DOC, or DOCX format';
          }
          if (value.size > 5 * 1024 * 1024) {
            return 'Resume file size must be less than 5MB';
          }
        }
        break;
    }

    return '';
  }, []);

  const validateForm = useCallback((formData: ApplicationFormData, resumeFile: File | null): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
      }
    });

    // Validate resume
    const resumeError = validateField('resume', resumeFile);
    if (resumeError) {
      newErrors.resume = resumeError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    setFieldError,
    setErrors
  };
}