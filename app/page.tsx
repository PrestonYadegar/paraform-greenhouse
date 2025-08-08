'use client';

import { useState } from 'react';
import ApplicationForm from './components/ApplicationForm';
import Header from '../components/Header';
import styles from './page.module.css';

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNavigateBack = () => {
    window.location.href = 'https://paraform.com';
  };

  return (
    <div className={styles.container}>
      <Header onNavigateBack={isSubmitted ? handleNavigateBack : undefined} />
      <main className={styles.main}>
        <h1>Job Application</h1>
        <p className={styles.subtitle}>Submit your application for Software Engineer position</p>
        <ApplicationForm onSubmitSuccess={() => setIsSubmitted(true)} />
        
        {isSubmitted && (
          <div className={styles.successActions}>
            <button 
              onClick={handleNavigateBack}
              className={styles.backButton}
            >
              Return to Paraform
            </button>
          </div>
        )}
      </main>
    </div>
  );
}