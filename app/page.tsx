import ApplicationForm from './components/ApplicationForm';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Job Application</h1>
        <p className={styles.subtitle}>Submit your application for Software Engineer position</p>
        <ApplicationForm />
      </main>
    </div>
  );
}