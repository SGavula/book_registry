import { useState } from "react";

import { REQUEST_URI } from "../helpers/request.helper";

//Scss
import styles from "../styles/Login.module.scss";

import axios from "axios";

import { setCookies } from "cookies-next";
import { useRouter } from 'next/router';

import ErrorAlert from "../utilts/ErrorAlert.util";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorAlert, setErrorAlert] = useState(false);
  
  async function loginFunc(e){
    e.preventDefault();
    if (email !== '' && password != '') {
          try {

            const resp = await axios.post(REQUEST_URI + '/auth/login', {email: email, password: password});
            console.log(resp);
            if(resp.data.status == 200) {
                const {token, refresh}  =  resp.data.data;
                console.log(token, refresh);
                setCookies('token', token)
                setCookies('refresh', refresh)
                router.push('/navigation');
            } else {
              console.log('bad credentials');
                // res.status(400);
                // res.end()
            }
            // return res.send(resp.body);
        } catch (error) {
            console.log(error);
            setErrorAlert(true);
            // res.send(error);
        };
    }
  };

  
  return (
    <div className={styles.login}>

      {
        errorAlert ? (
            <ErrorAlert
                text="Prosím skontrolujte si, či ste zadali správne prihlasovacie údaje."
                btnText="Zatvoriť"
                show={errorAlert}
                setShow={(e) => setErrorAlert(e)}
            />
        ) : null
      }

      <div className={styles.login_wrapper}>
        <h1>Prihlásenie</h1>
        <form onSubmit={loginFunc}>
          <div className={styles.input_wrapper}>
                <input
                    id="name"
                    placeholder="Používateľské meno"
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className={styles.input_wrapper}>
                <input
                    id="password"
                    placeholder="Heslo"
                    required
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                />
            </div>
            <button>Prihlásiť sa</button>
        </form>
      </div>
    </div>
  )
}
