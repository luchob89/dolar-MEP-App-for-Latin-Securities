"use client";

import Link from 'next/link';
import styles from './page.module.css';
 
export default function NotFound() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.not_found_container}>
            <h1>Not Found</h1>
            <p>Could not find requested resource.</p>
            <Link href="/">Return Home</Link>
        </div>
      </main>
    </div>
  )
}