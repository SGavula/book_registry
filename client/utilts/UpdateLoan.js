import React, { useState, useEffect } from "react";

//Utils
import ErrorAlert from "../utilts/ErrorAlert.util";

//Request
import { logout, syncTokens } from "../helpers/syncTokens.helper";
import {
    put_request,
    default_request_config,
  } from "../helpers/request.helper";
import { getCookie } from "cookies-next";

//Scss
import styles from "../styles/ModalAdd.module.scss";

//Bootstrap
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';

//Router
import { useRouter } from "next/router";

const UpdateBook = ({ i, userId, userFirstName, userLastName, userEmail, userEnd, handleGet }) => {

    const [ show, setShow] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState();
    const [ alertError, setAlertError ] = useState(false);

    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ end, setEnd ] = useState("");

    const router = useRouter();

    //Update Loan
    async function updateLoan() {
        let data = { 
            first_name: firstName,
            last_name: lastName, 
            email, 
            end 
        }

        try {
            const token = getCookie("token");
            const refresh = getCookie("refresh");
            const resp = await put_request(`/borrow/${userId}`, data, {
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
        updateLoan();
    }

    //Modal Logic
    const handleClose = () => setShow(false);

    return ( 
        <div>
            {
                alertError ? (
                    <ErrorAlert
                        text="Bohu??ia??, nepodarilo sa aktualizova?? v??p????i??ku."
                        btnText="Zatvori??"
                        show={alertError}
                        setShow={(e) => setAlertError(e)}
                    />
                ) : null
            }

            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="tooltip">
                        Upravte vyp????i??ku.
                    </Tooltip>
                }
            >
                <div onClick={() => setShow(true)}>
                    {
                        i % 2 === 0 ? (
                            <img src="/img/edit_icon_dark.svg" alt="Edit Icon" />
                        ) : (
                            <img src="/img/edit_icon_light.svg" alt="Edit Icon" />
                        )
                    }
                </div>
            </OverlayTrigger>

            {
                show ? (
                    <Modal show={show}>
                        <div className={styles.modal_wrapper}>
                            <Modal.Header className={styles.modal_header}>
                                <Modal.Title className={styles.modal_title}>Upravi?? ??tudenta</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={handleSubmit}>
                                <Modal.Body>
                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="lastname">Zadajte nov?? priezvisko ??tudenta</label>
                                            <input
                                                id="lastname"
                                                placeholder="Priezvisko ??tudenta"
                                                defaultValue={userLastName}
                                                required
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="firstname">Zadajte nov?? krstn?? meno ??tudenta</label>
                                            <input
                                                id="firstname"
                                                placeholder="Krstn?? meno ??tudenta"
                                                defaultValue={userFirstName}
                                                required
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="email">Zadajte nov?? email ??tudenta</label>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="Email ??tudenta"
                                                defaultValue={userEmail}
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.input_wrapper}>
                                            <label htmlFor="end">Zadajte d??tum ukon??enia</label>
                                            <input
                                                id="end"
                                                type="date"
                                                placeholder="D??tum ukon??enia"
                                                defaultValue={userEnd}
                                                required
                                                onChange={(e) => setEnd(e.target.value)}
                                            />
                                        </div>

                                </Modal.Body>
                                <Modal.Footer className={styles.modal_footer}>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Zatvori??
                                    </Button>
                                    <Button className={styles.submit_btn} type="submit">
                                        Upravi?? vyp????i??ku
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
 
export default UpdateBook;