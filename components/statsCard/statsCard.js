import { Card, ProgressBar } from 'react-bootstrap'

import styles from './statsCard.module.scss'


export default function StatsCard({ children, title, stats, progressBars }) {
    const getProgressBarVariant = (value) => {
        if (value < 10) {return "danger"}
        else if (value < 75) {return "warning"}
        else {return "success"}
    } 
    return (
        <Card className={styles.statsCard}>
            <header className={styles.statsCardTitle}>
                <h4>{title}</h4>
            </header>
            <div className={styles.statsCardBody}>
                <div className={styles.statsRow}>
                    {stats.map((stat, index) =>
                        <div key={`stat-${index}`} className={styles.statItem}>
                            <h5 className={styles.name}>{stat.name}</h5>
                            <p className={styles.value}>{stat.value.toLocaleString()}</p>
                        </div>
                    )}
                </div>
                {progressBars.map((bar, index) =>
                    <div key={`progressBar-${index}`} className={styles.progressRow}>
                        {bar.name ? <h5 className={styles.name}>{bar.name}</h5> : ""}
                        <ProgressBar now={bar.value} variant={getProgressBarVariant(bar.value)} className="progress-xs" />
                    </div>
                )}
            </div>
        </Card>
    )
}