import StepArrow from "./StepArrow";
import styles from "./style.module.scss"


function StepLabelIcon({ icon, active }) {

    return (
        <>
            <div className={`${active ? styles.activeIcon : styles.icon}`}><b>{icon}</b>
            </div>
            {active && <StepArrow />}
        </>
    )

}

export default StepLabelIcon;