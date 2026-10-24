'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  return (

    <div className={styles.page}>
      <div className={styles.main}>
                
          <h1>KrakenLabs</h1>
          <p>Se Identifique:</p>

  
          <button
            className={styles.botao}
            type="button"
            onClick={() => router.push('/professor')}
          >
            Professor
          </button>
          <br>
          </br>
          <button
            className={styles.botao}
            type="button"
            onClick={() => router.push('/aluno')}
          >
            Aluno
          </button>

          <br/>
         
      </div>
          <span className={styles.rodape}>
              KrakenLabs <br/>
              &copy; Feito pelos REAIS devs Seniors P. Felix e H. Pompei
          </span>
    </div>
   
  );
}