import type { IdentityResult } from '@incode/identity-sdk'
import styles from './ResultStep.module.css'

interface ResultStepProps {
  result: IdentityResult
  onRetry: () => void
}

export function ResultStep({ result, onRetry }: ResultStepProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Verification Result</h3>
        <p className={styles.subtitle}>
          {result.status === 'verified'
            ? 'Your identity has been verified. You may proceed to checkout.'
            : 'Verification failed. You can retry or abandon checkout.'}
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          <img className={styles.image} src={result.selfieUrl} alt='Captured selfie' />

          <div className={styles.details}>
            <div className={styles.row}>
              <span className={styles.label}>Phone</span>
              <span>{result.phone}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Address</span>
              <span>
                {result.address.street}, {result.address.city}, {result.address.state},{' '}
                {result.address.country} {result.address.postalCode}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Score</span>
              <span>{result.score}/100</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Status</span>
              <span className={result.status === 'verified' ? styles.success : styles.error}>
                {result.status === 'verified' ? 'Verified' : 'Failed'}
              </span>
            </div>
          </div>
        </div>

        {result.status === 'failed' ? (
          <button className={styles.retryButton} onClick={onRetry} type='button'>
            Retry Verification
          </button>
        ) : null}
      </div>
    </div>
  )
}
