export interface ValidationError {
  field: string;
  message: string;
}

export function validateApplicationForm(formData: FormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
  for (const field of requiredFields) {
    if (!formData.get(field)) {
      errors.push({
        field,
        message: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
      });
    }
  }

  // Email validation
  const email = formData.get('email') as string;
  if (email && !isValidEmail(email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    });
  }

  // Phone validation
  const phone = formData.get('phone') as string;
  if (phone && !isValidPhone(phone)) {
    errors.push({
      field: 'phone',
      message: 'Please enter a valid phone number'
    });
  }

  // LinkedIn URL validation
  const linkedinUrl = formData.get('linkedinUrl') as string;
  if (linkedinUrl && !isValidLinkedInUrl(linkedinUrl)) {
    errors.push({
      field: 'linkedinUrl',
      message: 'Please enter a valid LinkedIn URL'
    });
  }

  // Resume validation
  const resume = formData.get('resume') as File;
  if (!resume) {
    errors.push({
      field: 'resume',
      message: 'Resume is required'
    });
  } else {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(resume.type)) {
      errors.push({
        field: 'resume',
        message: 'Resume must be PDF, DOC, or DOCX format'
      });
    }
    
    // 5MB limit
    if (resume.size > 5 * 1024 * 1024) {
      errors.push({
        field: 'resume',
        message: 'Resume file size must be less than 5MB'
      });
    }
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Basic phone validation - accepts various formats
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function isValidLinkedInUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'linkedin.com' || urlObj.hostname === 'www.linkedin.com';
  } catch {
    return false;
  }
}