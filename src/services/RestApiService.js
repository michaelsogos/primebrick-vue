import config from "../../public/config";
import Axios from "axios";
import { ApiResult } from "../models/ApiResult";
import $api from "../enums/ApiEndPoints";

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
	 */
	static async get(endpoint, data, throwsError = false) {
		let apiResult = new ApiResult();
		let headers = prepareHttpHeader();

		try {
			let result = await axios.get(`${config.restApiEndpoint}/${endpoint}`, {
				params: data,
				headers: headers,
			});
			apiResult.response = result.data;
		} catch (ex) {
			if (ex.response.status == 401 && headers.Authorization) {
				let refreshTokenResult = await refreshAccessToken();
				if (refreshTokenResult) this.post(endpoint, data, throwsError);
				else {
					if (throwsError) throw ex;
					apiResult.hasError = true;
					apiResult.clientMessage = ex.message;
					apiResult.exception = ex;
				}
			} else {
				if (throwsError) throw ex;
				apiResult.hasError = true;
				apiResult.clientMessage = ex.message;
				apiResult.exception = ex;
			}
		}

		return apiResult;
	}

	/**
	 *
	 * @param {String} endpoint The REST API to call
	 * @param {Object} data Data to send to REST API
	 * @param {Boolean} throwsError When TRUE any exception will be elevated
	 */
	static async post(endpoint, data, throwsError) {
		let apiResult = new ApiResult();
		let headers = prepareHttpHeader();

		try {
			let result = await axios.post(`${config.restApiEndpoint}/${endpoint}`, data, { headers: headers });
			apiResult.response = result.data;
		} catch (ex) {
			if (ex.response.status == 401 && headers.Authorization) {
				let refreshTokenResult = await refreshAccessToken();
				if (refreshTokenResult) this.post(endpoint, data, throwsError);
				else {
					if (throwsError) throw ex;
					apiResult.hasError = true;
					apiResult.clientMessage = ex.message;
					apiResult.exception = ex;
				}
			} else {
				if (throwsError) throw ex;
				apiResult.hasError = true;
				apiResult.clientMessage = ex.message;
				apiResult.exception = ex;
			}
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
	const tokens = JSON.parse(sessionStorage.getItem("authTokens"));
	const headers = prepareHttpHeader();

	try {
		let result = await axios.post(
			`${config.restApiEndpoint}/${$api.POST_REFRESH_TOKEN}`,
			{ refresh_token: tokens.refresh_token },
			{ headers: headers }
		);
		const authTokens = result.data;
		sessionStorage.setItem("authTokens", JSON.stringify(authTokens));
		console.info("Access token refreshed!");
		return true;
	} catch (ex) {
		console.error(ex);
		return false;
	}
}
