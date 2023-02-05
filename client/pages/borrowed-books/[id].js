import React, { useState, useEffect } from 'react';
import { logout, syncTokens } from "../../helpers/syncTokens.helper";
import {
  get_request,
  default_request_config,
} from "../../helpers/request.helper";
import { getCookie } from "cookies-next";

//Utilities
import ErrorAlert from "../../utilts/ErrorAlert.util";

import HashLoader from "react-spinners/HashLoader";

//Scss
import styles from "../../styles/Borrowed-book-detail.module.scss";
import heading from "../../styles/Heading.module.scss";
import loader from "../../styles/Loader.module.scss";

import { useRouter } from 'next/router'

const BookTable = () => {

    const [ user, setUser ] = useState();
    const router = useRouter();
    const [errorAlert, setErrorAlert] = useState(false);

    const { id } = router.query;

    async function getBook() {
        try {
          const token = getCookie("token");
          const refresh = getCookie("refresh");
          const resp = await get_request(`/borrow/${id}`, {
            ...default_request_config,
            headers: {
              ...default_request_config.headers,
              "x-token": token,
              "x-refresh-token": refresh,
            },
          });
          if (resp.data.status == 200) {
            setUser(resp.data.data);
          }
          syncTokens(resp);
        } catch (err) {
          if (err.message.includes(401)) {
            // unauthorized
            logout();
            router.push("/");
          } else {
            // some other error - create error message
            setErrorAlert(true);
          }
        }
      }
    
      useEffect(() => {
        id ? getBook() : null
      }, [ id ]);

    return ( 
        <div className={styles.book_detail}>

          {
            user || errorAlert ? (
              <div>
                {
                    errorAlert ? (
                    <ErrorAlert
                        text="Bohužiaľ, nepodarilo sa načítať údaje o výpôžičke."
                        btnText="Zatvoriť"
                        show={errorAlert}
                        setShow={(e) => setErrorAlert(e)}
                    />
                    ) : null
                }

                <div className={heading.heading}>
                    <h3 className={heading.heading}>Informácie o výpôžičke</h3>
                </div>

                {
                    user ? (
                        <div className={styles.informations}>
                            {/* Book */}
                            <div className={styles.book_wrapper}>
                                <h3>Informácie o požičanej knihe:</h3>
                                <div>
                                    <h4>Názov knihy: </h4>
                                    <p>{user.book.name}</p>
                                </div>
                                <div>
                                    <h4>Autor knihy: </h4>
                                    <p>{user.book.author}</p>
                                </div>
                                <div>
                                    <h4>ISBN knihy: </h4>
                                    <p>{user.book.isbn}</p>
                                </div>
                            </div>

                            {/* Loan */}
                            <div className={styles.loan_wrapper}>
                                <h3>Informácie o študentovi, ktorý si knihu požičal: </h3>
                                <div className={styles.name}>
                                    <h4>Meno: </h4>
                                    <div>
                                        <p>{user.first_name}</p>
                                        <p>{user.last_name}</p>  
                                    </div>
                                </div>
                                <div>
                                    <h4>Email: </h4>
                                    <p>{user.email}</p>
                                </div>
                                <div>
                                    <h4>Dátum expirácie: </h4>
                                    <p>{user.end.substring(8, 10) + '.' + user.end.substring(5, 7) + '.' + user.end.substring(0, 4)}</p>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
              </div>
            ) : (
              <div className={loader.loader}>
                <HashLoader color={"#40476D"} loading={true} size={40} />
            </div> 
            )
          }

        </div>
     );
}
 
export default BookTable;