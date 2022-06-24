import styles from "./style.module.scss"
import Button from "./Button"
function Header() {
    return (
        <div className={styles.header}>
            <div className="container">
                <div className="d-flex">
                <div className="col-md-2 p-0"><Button active>Tümü</Button></div>
                <div className="col-md-2"><Button>Araç</Button></div>
                <div className="col-md-2"><Button>Sağlık</Button></div>
                <div className="col-md-2"><Button>Evcil Hayvan</Button></div>
                <div className="col-md-2"><Button>Seyahat</Button></div>
                <div className="col-md-2"><Button>Diğer</Button></div>
            </div>
            </div>
        </div>
    );
}

export default Header;