import React, { useState } from "react";

//Links
import Link from "next/link";

//Scss
import styles from "../styles/Navigation.module.scss";
import { getTokens } from "../helpers/syncTokens.helper";

const Navigation = () => {
  const [ hover1, setHover1 ] = useState(false);
  const [ hover2, setHover2 ] = useState(false);

  console.log(getTokens());
  
  return ( 
    <div className={styles.navigation}>
      <div className={styles.navigation_wrapper}>
        <Link href="/books-table">
          <div
            className={styles.button_wrapper}
            onMouseEnter={() => setHover1(true)}
            onMouseLeave={() => setHover1(false)}
          >
            <img src={hover1 ? "/img/books-icon-white.svg" : "/img/books-icon-dark.svg"} alt="Book Icon" />
            <p>Prezerať knihy</p>
          </div>
        </Link>

        <Link href="/borrowed-books">
          <div 
            className={styles.button_wrapper}
            onMouseEnter={() => setHover2(true)}
            onMouseLeave={() => setHover2(false)}
          >
            <img src={hover2 ? "/img/calendar-icon-white.svg" : "/img/calendar-icon-dark.svg"} alt="Book Icon" />
            <p>Zobraziť výpôžičky</p>
          </div>
        </Link>
      </div>
    </div>
   );
}
 
export default Navigation;