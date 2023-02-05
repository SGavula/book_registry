//Scss
import styles from "../styles/Checkbox.module.scss"

const Checkbox = ({ isTrue }) => {

    return ( 
        <div className={styles.checkbox}>
            {
                isTrue ? (
                    <img src="/img/check.svg" alt="check" />
                ) : null
            }
        </div>
     );
}
 
export default Checkbox;