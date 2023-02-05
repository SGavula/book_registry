import axios from "axios";
import {
  default_request_config,
  REQUEST_URI,
} from "../../../helpers/request.helper";
import { getCookie } from "cookies-next";

export default async function handler(req, res) {
  try {
    const token = getCookie('token', {req, res});
    const refresh = getCookie('refresh', {req, res});
    const resp = await axios.get(
      REQUEST_URI + "/book",
      {
        ...default_request_config,
        headers: {
          ...default_request_config.headers,
          "x-token": token,
          "x-refresh-token": refresh
        },
      }
    );
    console.log(resp);
    res.send(200);
    // if (resp.data.status == 200) {
    //   const { token, refresh } = resp.data.data;
    //   console.log(token, refresh);
    //   setCookies("token", token, { req, res });
    //   setCookies("refresh", refresh, { req, res });
    //   res.status(200);
    //   res.send(resp.data.data);
    // } else {
    //   res.status(400);
    //   // res.end()
    // }
    // return res.send(resp.body);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
