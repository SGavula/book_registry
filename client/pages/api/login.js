import axios from "axios";
import { REQUEST_URI } from "../../helpers/request.helper";
import { setCookies } from "cookies-next";

export default async function handler(req, res) {
    try {
        const {email, password} = req.body;

        const resp = await axios.post(REQUEST_URI + '/auth/login', {email, password});
        console.log(resp);
        if(resp.data.status == 200) {
            const {token, refresh}  =  resp.data.data;
            console.log(token, refresh);
            setCookies('token', token)
            setCookies('refresh', refresh)
            res.status(200)
            res.send(resp.data.data);
        } else {
            res.status(400);
            // res.end()
        }
        // return res.send(resp.body);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}
  