'use client';

import { useState, useCallback } from 'react';
import { ApplicationFormData } from '@/app/types/greenhouse';
import { useFormValidation } from '@/app/hooks/useFormValidation';
import styles from '../page.module.css';

export default function ApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    coverLetter: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const { errors, validateField, validateForm, clearError, setErrors } = useFormValidation();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      clearError(name);
    }

    // Validate on blur
    if (e.type === 'blur') {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  }, [errors, validateField, clearError, setErrors]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      
      // Validate file immediately
      const error = validateField('resume', file);
      if (error) {
        setErrors(prev => ({ ...prev, resume: error }));
      } else {
        clearError('resume');
      }
    }
  }, [validateField, clearError, setErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm(formData, resumeFile)) {
      setSubmitStatus('error');
      setSubmitMessage('Please correct the errors above');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('Your application has been submitted successfully!');
        setApplicationId(result.data?.candidateId || null);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          linkedinUrl: '',
          coverLetter: '',
        });
        setResumeFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('resume') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Error submitting application');
        
        // Handle validation errors from server
        if (result.data?.errors) {
          const newErrors: { [key: string]: string } = {};
          result.data.errors.forEach((error: any) => {
            newErrors[error.field] = error.message;
          });
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
    handleInputChange(e);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            onBlur={handleInputChange}
            required
            className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
          />
          {errors.firstName && <p className={styles.fieldError}>{errors.firstName}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            onBlur={handleInputChange}
            required
            className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
          />
          {errors.lastName && <p className={styles.fieldError}>{errors.lastName}</p>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleInputChange}
          required
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
        />
        {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          onBlur={handleInputChange}
          required
          className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
        />
        {errors.phone && <p className={styles.fieldError}>{errors.phone}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="linkedinUrl">LinkedIn URL (optional)</label>
        <input
          type="url"
          id="linkedinUrl"
          name="linkedinUrl"
          value={formData.linkedinUrl}
          onChange={handleInputChange}
          onBlur={handleInputChange}
          className={`${styles.input} ${errors.linkedinUrl ? styles.inputError : ''}`}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        {errors.linkedinUrl && <p className={styles.fieldError}>{errors.linkedinUrl}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="resume">Resume *</label>
        <input
          type="file"
          id="resume"
          name="resume"
          onChange={handleFileChange}
          required
          className={`${styles.fileInput} ${errors.resume ? styles.fileInputError : ''}`}
          accept=".pdf,.doc,.docx"
        />
        {errors.resume && <p className={styles.fieldError}>{errors.resume}</p>}
        <p className={styles.fileHint}>Accepted formats: PDF, DOC, DOCX</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="coverLetter">Cover Letter (optional)</label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleInputChange}
          className={`${styles.textarea} ${errors.coverLetter ? styles.textareaError : ''}`}
          rows={6}
          placeholder="Tell us why you're interested in this position..."
        />
        {errors.coverLetter && <p className={styles.fieldError}>{errors.coverLetter}</p>}
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>

      {submitMessage && (
        <p className={`${styles.message} ${submitStatus === 'error' ? styles.error : styles.success}`}>
          {submitMessage}
        </p>
      )}
    </form>
  );
}