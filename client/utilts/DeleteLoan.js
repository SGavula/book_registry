import React, { useState } from "react";

//Utils
import ErrorAlert from "../utilts/ErrorAlert.util";

//Request
import { logout, syncTokens } from "../helpers/syncTokens.helper";
import {
    delete_request,
    default_request_config,
  } from "../helpers/request.helper";
import { getCookie } from "cookies-next";


//Scss
import styles from "../styles/ModalSubmit.module.scss";

//Bootstrap
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';

//Router
import { useRouter } from "next/router";

const DeleteBook = ({ handleGet, userId }) => {

    const [ show, setShow] = useState(false);
    const [ alertError, setAlertError ] = useState(false);

    const router = useRouter();

    //Delete Loan
    async function deleteLoan() {
        try {
            const token = getCookie("token");
            const refresh = getCookie("refresh");
            const resp = await delete_request(`/borrow/${userId}`, {
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

    //Delete Request
    const handleDelete = (e) => {
        e.preventDefault();

        setShow(false);
        deleteLoan();
    }

    //Modal Logic
    const handleClose = () => setShow(false);

    return ( 
        <div>
            {
                alertError ? (
                    <ErrorAlert
                        text="Bohužiaľ, nepodarilo sa vymazať výpôžičku."
                        btnText="Zatvoriť"
                        show={alertError}
                        setShow={(e) => setAlertError(e)}
                    />
                ) : null
            }

            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="tooltip">
                        Vymažte vypôžičku.
                    </Tooltip>
                }
            >
                <div onClick={() => setShow(true)}>
                    <img src="/img/cross_icon.svg" alt="Cross Icon" />
                </div>
            </OverlayTrigger>

            {
                show ? (
                    <Modal show={show}>
                        <div className={styles.modal_wrapper}>
                            <Modal.Header className={styles.modal_header}>
                                <Modal.Title className={styles.modal_title}>Chcete odstrániť túto vypôžičku?</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className={styles.modal_body}>
                                <form onSubmit={handleDelete}>
                                    <Button className={styles.submit_btn} onClick={handleClose}>
                                        Nie
                                    </Button>
                                    <Button variant="secondary" type="submit">
                                        Áno
                                    </Button>
                                </form>
                            </Modal.Body>
                        </div>
                    </Modal>
                ) : null
            }
        </div>
     );
}
 
export default DeleteBook;