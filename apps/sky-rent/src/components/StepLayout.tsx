import styles from './StepLayout.module.css'
import appStyles from '../App.module.css'

interface StepDef {
  key: string
  label: string
}

export interface StepLayoutProps {
  children: React.ReactNode
  steps: StepDef[]
  currentStepKey: string
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
  nextDisabled?: boolean
  showBack?: boolean
  showNext?: boolean
}

export function StepLayout({
  children,
  steps,
  currentStepKey,
  onBack,
  onNext,
  backLabel = 'Back',
  nextLabel = 'Next',
  nextDisabled = false,
  showBack = true,
  showNext = true,
}: StepLayoutProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStepKey)

  return (
    <div className={styles.layout}>
      <nav className={styles.indicator} aria-label="Progress">
        <ol className={styles.steps}>
          {steps.map((step, index) => {
            const state =
              index < currentIndex
                ? 'completed'
                : index === currentIndex
                  ? 'current'
                  : 'upcoming'

            return (
              <li key={step.key} className={styles.stepItem} data-state={state}>
                <span className={styles.dot} data-state={state} aria-hidden="true" />
                <span className={styles.stepLabel}>{step.label}</span>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className={styles.content}>{children}</div>

      <div className={styles.nav}>
        {showBack && onBack ? (
          <button
            type="button"
            className={appStyles.button}
            onClick={onBack}
            disabled={currentIndex === 0}
          >
            {backLabel}
          </button>
        ) : (
          <span />
        )}
        {showNext && onNext ? (
          <button
            type="button"
            className={appStyles.primaryButton}
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel}
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
