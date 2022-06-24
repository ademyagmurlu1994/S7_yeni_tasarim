import styles from "./style.module.scss"

function StepArrow({top, left}) {
    return (
        <div className={`timeline-badge animate__animated animate__fadeInUp ${styles.arrow}`} style={{top: top, left: left}}></div>
    );
}

export default StepArrow;