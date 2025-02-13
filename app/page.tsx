"use client";

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import styles from "./page.module.css";
import ChooseAmounts from "./chooseAmounts";

export default function Landing() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Provider store={store}>
          <ChooseAmounts />
        </Provider>
      </main>
    </div>
  );
}
