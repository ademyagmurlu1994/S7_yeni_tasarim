import Button from "./Button";
import styles from "../style.module.scss"
import Author from "./Author";

function Header() {
    return (
        <div className="py-4">
            <Button>Sağlık</Button>
            <h1 className="h4 pt-3" style={{color: "#3e464d"}}><strong>H1 Lorem ipsum dolor sit amet lorem ips, consectetur adipiscing elit,Lorem ipsum</strong></h1>
            <span className="h5 pt-3 d-block" style={{color: "#3e464d", fontWeight: "400"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. </span>
            <Author/>
        </div>
    );
}

export default Header;