import axios from "axios";

export const REQUEST_URI = 'http://localhost:8000/api';

export const post_request = async (url, data, config) =>
	await axios.post(REQUEST_URI + url, data, config);

export const put_request = async (url, data, config) =>
	await axios.put(REQUEST_URI + url, data, config);

export const delete_request = async (url, config) =>
	await axios.delete(REQUEST_URI + url, config);

export const get_request = async (url, config) =>
	await axios.get(REQUEST_URI + url, config);

export const default_request_config = {
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	}
};
