'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    coverLetter: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('linkedinUrl', formData.linkedinUrl);
      submitData.append('coverLetter', formData.coverLetter);
      
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Application submitted successfully!');
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
        setSubmitMessage(result.message || 'Error submitting application. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitMessage('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Job Application</h1>
        <p className={styles.subtitle}>Submit your application for Software Engineer position</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
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
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="linkedinUrl">LinkedIn URL (optional)</label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="resume">Resume *</label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              required
              className={styles.fileInput}
              accept=".pdf,.doc,.docx"
            />
            <p className={styles.fileHint}>Accepted formats: PDF, DOC, DOCX</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coverLetter">Cover Letter (optional)</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              className={styles.textarea}
              rows={6}
              placeholder="Tell us why you're interested in this position..."
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>

          {submitMessage && (
            <p className={`${styles.message} ${submitMessage.includes('Error') ? styles.error : styles.success}`}>
              {submitMessage}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}