import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

//Scss
import styles from "../styles/Alert.module.scss";

const SuccesAlert = ({ title, text, btnText, show, setShow = (f) => f }) => {

	useEffect(() => {
		const timeId = setTimeout(() => {
			console.log("super successfull error");
			// After 3 seconds set the show value to false
			setShow(false);
		}, 5000);

		return () => {
			clearTimeout(timeId);
		};
	}, []);

	return (
		<Alert show={show} variant="success" className={styles.alert}>
			<Alert.Heading>{title}</Alert.Heading>
			<p>{text}</p>
			<div className="d-flex justify-content-end">
				<Button
					onClick={() => setShow(false)}
					variant="outline-success"
				>
					{btnText}
				</Button>
			</div>
		</Alert>
	);
};

export default SuccesAlert;
