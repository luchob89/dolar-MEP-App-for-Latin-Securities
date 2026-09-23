"use client";

import styles from "./page.module.css";
import ChooseAmounts from "./chooseAmounts";

export default function Landing() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ChooseAmounts />
      </main>
    </div>
  );
}
