import config from "../../public/config";
import Axios from "axios";
import { ApiResult } from "../models/ApiResult";
import $api from "../enums/ApiEndPoints";
import store from "../store/index";
import $ from "../store/types";

const axios = Axios.create({
	// withCredentials: true,
	headers: {
		Accept: "application/json",
	},
});

export class RestApiService {
	/**
	 *
	 * @param {String} endpoint The REST API to call
	 * @param {Object} data Data to send to REST API
	 * @param {Boolean} throwsError When TRUE any exception will be elevated
	 * @returns {Promise<ApiResult>}
	 */
	static async get(endpoint, data, throwsError = false) {
		let apiResult = new ApiResult();
		let headers = prepareHttpHeader();

		try {
			let result = await axios
				.get(`${config.restApiEndpoint}/${endpoint}`, {
					params: data,
					headers: headers,
				})
				.catch((err) => {
					if (err.response.status >= 400) {
						err.message = err.response.data.message;
						throw err;
					}
					throw err;
				});

			apiResult.response = result.data;
		} catch (ex) {
			if (ex.message == "Network Error") {
				ex.clientMessage = "Backend server not reachable!";
				apiResult.clientMessage = ex.clientMessage;
			} else if (ex.response && ex.response.status == 401 && headers.Authorization) {
				let refreshTokenResult = await refreshAccessToken();
				if (refreshTokenResult) return await this.get(endpoint, data, throwsError);
			}

			if (throwsError) throw ex;
			apiResult.hasError = true;
			apiResult.clientMessage = ex.message;
			apiResult.exception = ex;
		}

		return apiResult;
	}

	/**
	 *
	 * @param {String} endpoint The REST API to call
	 * @param {Object} data Data to send to REST API
	 * @param {Boolean} throwsError When TRUE any exception will be elevated
	 * @returns {Promise<ApiResult>}
	 */
	static async post(endpoint, data, throwsError = false) {
		let apiResult = new ApiResult();
		let headers = prepareHttpHeader();

		try {
			let result = await axios.post(`${config.restApiEndpoint}/${endpoint}`, data, { headers: headers }).catch((err) => {
				if (err.response.status >= 400) {
					err.message = err.response.data.message;
					throw err;
				}
				throw err;
			});

			apiResult.response = result.data;
		} catch (ex) {
			if (ex.message == "Network Error") {
				ex.clientMessage = "Backend server not reachable!";
				apiResult.clientMessage = ex.clientMessage;
			} else if (ex.response && ex.response.status == 401 && headers.Authorization) {
				let refreshTokenResult = await refreshAccessToken();
				if (refreshTokenResult) return await this.post(endpoint, data, throwsError);
			}

			if (throwsError) throw ex;
			apiResult.hasError = true;
			apiResult.clientMessage = ex.message;
			apiResult.exception = ex;
		}

		return apiResult;
	}
}

function prepareHttpHeader() {
	let result = {};
	const authTokens = sessionStorage.getItem("authTokens");
	const tokens = JSON.parse(authTokens);

	if (authTokens) {
		result.Authorization = `${tokens.token_type} ${tokens.access_token}`;
	}

	return result;
}

async function refreshAccessToken() {
	debugger;
	const tokens = JSON.parse(sessionStorage.getItem("authTokens"));
	const headers = prepareHttpHeader();

	try {
		debugger;
		let result = await axios.post(
			`${config.restApiEndpoint}/${$api.POST_REFRESH_TOKEN}`,
			{ refresh_token: tokens.refresh_token },
			{ headers: headers }
		);
		const authTokens = result.data;
		debugger;
		store.commit($.mutations.APP_SET_AUTHTOKEN, authTokens);
		debugger;
		console.info("Access token refreshed!");
		return true;
	} catch (ex) {
		debugger;
		console.error(ex);
		return false;
	}
}
