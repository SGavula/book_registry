import React, { useState } from "react";

//Utils
import ErrorAlert from "../utilts/ErrorAlert.util";

//Request
import { logout, syncTokens } from "../helpers/syncTokens.helper";
import {
    post_request,
    default_request_config,
  } from "../helpers/request.helper";
import { getCookie } from "cookies-next";

//Scss
import styles from "../styles/ModalAdd.module.scss";
import modalStyles from "../styles/Modal.module.scss";

//Bootstrap
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

//Router
import { useRouter } from "next/router";

const AddBook = ({ handleGet, bookId }) => {

    const [ show, setShow] = useState(false);
    const [ alertError, setAlertError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState();

    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ end, setEnd ] = useState("");

    const router = useRouter();

    //Post Loan
    async function postLoan() {
        let data = {
            book_id: bookId, 
            first_name: firstName,
            last_name: lastName, 
            email, 
            end
        }

        try {
            const token = getCookie("token");
            const refresh = getCookie("refresh");
            const resp = await post_request("/borrow", data, {
              ...default_request_config,
              headers: {
                ...default_request_config.headers,
                "x-token": token,
                "x-refresh-token": refresh,
              },
            });
            if (resp.data.status == 200) {
                handleGet();
                console.log(resp);
            }
            syncTokens(resp);
        } catch (err) {
            console.log("Error: ", err);
            if (err.message.includes(401)) {
                // unauthorized
                logout();
                router.push("/");
            } else {
                // some other error - create error message
                setAlertError(true);
            }
        }
    }

    //Form Logic
    const handleSubmit = (e) => {
        e.preventDefault();

        setShow(false);
        postLoan();
    }

    //Modal Logic
    const handleClose = () => setShow(false);

    return ( 
        <div>

            {
                alertError ? (
                    <ErrorAlert
                        text="Bohužiaľ, nepodarilo sa vytvoriť pôžičku."
                        btnText="Zatvoriť"
                        show={alertError}
                        setShow={(e) => setAlertError(e)}
                    />
                ) : null
            }

            <div onClick={() => setShow(true)}>
                Požičať
            </div>
            
            {
                show ? (
                    <Modal show={show}>
                        <div className={styles.modal_wrapper}>
                            <Modal.Header className={styles.modal_header}>
                                <Modal.Title className={styles.modal_title}>Pridať vypôžičku</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={handleSubmit}>
                                <Modal.Body>
                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="firstname">Zadajte krstné meno študenta</label>
                                            <input
                                                id="firstname"
                                                placeholder="Meno študenta"
                                                required
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="lastname">Zadajte priezvisko študenta</label>
                                            <input
                                                id="lastname"
                                                placeholder="Priezvisko študenta"
                                                required
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="email">Zadajte email študenta</label>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="Email študenta"
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="end">Zadajte dátum ukončenia</label>
                                            <input
                                                id="end"
                                                type="date"
                                                placeholder="Autor knihy"
                                                required
                                                onChange={(e) => setEnd(e.target.value)}
                                            />
                                        </div>

                                </Modal.Body>
                                <Modal.Footer className={styles.modal_footer}>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Zatvoriť
                                    </Button>
                                    <Button className={styles.submit_btn} type="submit">
                                        Pridať vypôžičku
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </div>
                    </Modal>
                ) : null
            }
        </div>
     );
}
 
export default AddBook;