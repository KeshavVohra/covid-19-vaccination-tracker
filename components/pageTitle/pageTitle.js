import styles from'./pageTitle.module.scss'


export default function TageTitle({ title, subTitle }) {
    return (
        <h1 className={styles.pageTitle}>
            {title}
            <small><small>{subTitle}</small></small>
        </h1>
    )
}