'use client';

import styles from "./page.module.css";
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className='h2 mb-3 text-center ' style={{ color: 'white' }}>Oops!<br /> Something went wrong.</div>
                <Button onClick={() => reset()}>
                    Try again
                </Button>
            </main>
        </div>
    )
}