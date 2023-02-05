import React, { useState } from "react";

//Utils
import ErrorAlert from "../utilts/ErrorAlert.util";
import SuccessAlert from "../utilts/SuccessAlert.util";

//Request
import { logout, syncTokens } from "../helpers/syncTokens.helper";
import {
    post_request,
    default_request_config,
  } from "../helpers/request.helper";
import { getCookie } from "cookies-next";

//Scss
import styles from "../styles/ModalAdd.module.scss";

//Bootstrap
import { Modal } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

//Router
import { useRouter } from "next/router";

const AddBook = ({ handleGet }) => {

    const [ show, setShow] = useState(false);
    const [ alertError, setAlertError ] = useState(false);
    const [ alertSuccess, setAlertSuccess ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState();

    const [ name, setName ] = useState("");
    const [ author, setAuthor ] = useState("");
    const [ isbn, setIsbn ] = useState("");

    const router = useRouter();

    //Post Book
    async function postBook() {
        let data = { name, author, isbn }

        try {
            const token = getCookie("token");
            const refresh = getCookie("refresh");
            const resp = await post_request("/book", data, {
              ...default_request_config,
              headers: {
                ...default_request_config.headers,
                "x-token": token,
                "x-refresh-token": refresh,
              },
            });
            if (resp.data.status == 200) {
                handleGet();
                setAlertSuccess(true);
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
        postBook();
    }

    //Modal Logic
    const handleClose = () => setShow(false);

    return ( 
        <div>
            {
                alertError ? (
                    <ErrorAlert
                        text="Bohužiaľ, nepodarilo sa pridať knihu."
                        btnText="Zatvoriť"
                        show={alertError}
                        setShow={(e) => setAlertError(e)}
                    />
                ) : null
            }

            {
                alertSuccess ? (
                    <SuccessAlert
                        text="Kniha sa úspešne pridala."
                        btnText="Zatvoriť"
                        show={alertSuccess}
                        setShow={(e) => setAlertSuccess(e)}
                    />
                ) : null
            }


            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="tooltip">
                        Pridajte knihu.
                    </Tooltip>
                }
            >
                <div onClick={() => setShow(true)}>
                    <img src="/img/plus_icon.svg" alt="Plus Icon" />
                </div>
            </OverlayTrigger>

            {
                show ? (
                    <Modal show={show}>
                        <div className={styles.modal_wrapper}>
                            <Modal.Header className={styles.modal_header}>
                                <Modal.Title className={styles.modal_title}>Pridať knihu</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={handleSubmit}>
                                <Modal.Body>
                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="name">Zadajte názov knihy</label>
                                            <input
                                                id="name"
                                                placeholder="Názov knihy"
                                                required
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="author">Zadajte autora knihy</label>
                                            <input
                                                id="author"
                                                placeholder="Autor knihy"
                                                required
                                                onChange={(e) => setAuthor(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="isbn">Zadajte ISBN knihy</label>
                                            <input
                                                id="isbn"
                                                placeholder="ISBN knihy"
                                                required
                                                onChange={(e) => setIsbn(e.target.value)}
                                            />
                                        </div>

                                </Modal.Body>
                                <Modal.Footer className={styles.modal_footer}>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Zatvoriť
                                    </Button>
                                    <Button className={styles.submit_btn} type="submit">
                                        Pridať knihu
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