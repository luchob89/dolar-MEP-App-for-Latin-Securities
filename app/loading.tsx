import styles from "./page.module.css";
import Spinner from 'react-bootstrap/Spinner';

export default function Loading() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Spinner animation="border" variant='light' role="status">
                <span className="visually-hidden">Loading...</span>
                </Spinner>
            </main>
        </div>
  );
}