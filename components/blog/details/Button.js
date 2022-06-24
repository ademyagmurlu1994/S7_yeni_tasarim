import styles from "../style.module.scss"

function Button({children}) {
    return (
        <div className={styles.detailButton}>
            {children}
        </div>
    );
}

export default Button;