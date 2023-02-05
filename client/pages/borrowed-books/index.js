import React, { useState, useEffect } from 'react';

import { logout, syncTokens } from "../../helpers/syncTokens.helper";
import {
  get_request,
  default_request_config,
} from "../../helpers/request.helper";
import { getCookie } from "cookies-next";

//Links
import Link from "next/link";

//Scss
import styles from "../../styles/Book-table.module.scss";
import heading from "../../styles/Heading.module.scss";
import loader from "../../styles/Loader.module.scss";

//Utilities
import DeleteLoan from "../../utilts/DeleteLoan";
import UpdateLoan from "../../utilts/UpdateLoan";
import ErrorAlert from "../../utilts/ErrorAlert.util";

import HashLoader from "react-spinners/HashLoader";

//Router
import { useRouter } from "next/router";

const BookTable = () => {
    //Use State
    const [ users, setUsers ] = useState([]);
    const [ search, setSearch ] = useState("");

    const [errorAlert, setErrorAlert] = useState(false);

    const router = useRouter();

    //Get Users
    async function getUsers() {
        try {
            const token = getCookie("token");
            const refresh = getCookie("refresh");
            const resp = await get_request("/borrow", {
            ...default_request_config,
            headers: {
                ...default_request_config.headers,
                "x-token": token,
                "x-refresh-token": refresh,
            },
            });
            if (resp.data.status == 200) {
                setUsers(resp.data.data);
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
        getUsers();
    }, []);

    return ( 
        <div className={styles.book_table}>

            {
                users.length || errorAlert ? (
                    <div>
                        {
                            errorAlert ? (
                                <ErrorAlert
                                    text="Bohužiaľ, nepodarilo sa načítať výpôžičky."
                                    btnText="Zatvoriť"
                                    show={errorAlert}
                                    setShow={(e) => setErrorAlert(e)}
                                />
                            ) : null
                        }

                        <div className={heading.heading}>
                            <h3>Prezerať výpôžičky</h3>
                        </div>

                        {/* Searchbar */}
                        <div className={styles.search}>
                            <input type="text" placeholder="Vyhľadajte knihy..." onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <div className={styles.table_wrapper}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Číslo</th>
                                        <th>Priezvisko</th>
                                        <th>Meno</th>
                                        <th>Email</th>
                                        <th>Dátum expirácie</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        users ? (
                                            users.filter((val) => {
                                                if(search === "") {
                                                    return val
                                                } else if(val.last_name.toLowerCase().includes(search.toLowerCase())) {
                                                    return val
                                                }
                                            }).map((user, i) => (
                                                <tr key={user.id}>
                                                    <td>{i + 1}.</td>
                                                    <td>
                                                        <Link
                                                            href={"/borrowed-books/" + user.id}
                                                        >
                                                            {user.last_name}
                                                        </Link>
                                                    </td>
                                                    <td>{user.first_name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.end.substring(8, 10) + '.' + user.end.substring(5, 7) + '.' + user.end.substring(0, 4)}</td>
                                                    <td>
                                                        <UpdateLoan i={i} userId={user.id} userFirstName={user.first_name} userLastName={user.last_name} userEmail={user.email} userEnd={user.end} handleGet={getUsers} />
                                                    </td>
                                                    <td>
                                                        <DeleteLoan userId={user.id} handleGet={getUsers} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : null
                                    }
                                </tbody>
                            </table>
                        </div>
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