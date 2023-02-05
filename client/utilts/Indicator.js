//Scss
import styles from "../styles/Indicator.module.scss"

const Indicator = ({ color }) => {

    return ( 
        <div className={styles.indicator} style={{backgroundColor: color}}></div>
     );
}
 
export default Indicator;