import { useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css'
import { UserProvider } from "../contexts/user-context";

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return(
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
