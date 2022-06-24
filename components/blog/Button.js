import styles from "./style.module.scss"

function Button({children, active}) {
    return (
        <button type="button" className={active ? styles.buttonActive : styles.button}>
            {children}
        </button>
    );
}

export default Button;