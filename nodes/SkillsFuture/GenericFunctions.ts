import type {IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, JsonObject,} from 'n8n-workflow';
import {NodeApiError, IHttpRequestMethods} from 'n8n-workflow';
import * as CryptoJS from 'crypto-js';
import axios, { AxiosRequestConfig } from 'axios'; // Added import for axios
import * as https from 'https'; // Add this import

/**
 * Make an API request to SkillsFuture
 *
 */
export async function skillsFutureApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	encryptRequest: boolean,
	decryptResponse: boolean,
	query?: IDataObject,
):  Promise<any> {
	const credentials = await this.getCredentials('skillsFutureApi');
	let baseURL = "https://api.ssg-wsg.sg"
	if (credentials.test_mode) {
		baseURL = "https://uat-api.ssg-wsg.sg"
	}

	if (query === undefined) {
		query = {};
	}
	const uri: string = `${baseURL}${endpoint}`;
	// load certificate
	const certBuffer = Buffer.from(credentials.certificate.toString());
	const keyBuffer = Buffer.from(credentials.public_key.toString());

	const options: AxiosRequestConfig = {
		url: uri,
		method,
		headers: {},
		data: body,
		params: query,
		httpsAgent: new https.Agent({
			cert: certBuffer,
			key: keyBuffer,
		}),
	};

	if (Object.keys(body).length === 0) {
		delete options.data;
	} else {
		if (encryptRequest) {
			options.data = encryptBody(body, credentials.encryption_key.toString());
		}
	}


	try {
		const response = await axios(options);

		if (response.data.result != 0) {
			throw new NodeApiError(this.getNode(), response.data as JsonObject);
		}

		if (decryptResponse) {
			response.data.body = decryptBody(response.data.body, credentials.encryption_key.toString());
		}
		return response.data;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

function encryptBody(body: IDataObject, publicKey: string) {
	const jsonString = JSON.stringify(body);
	const key = CryptoJS.enc.Base64.parse(publicKey);
	const iv = CryptoJS.enc.Utf8.parse('SSGAPIInitVector');

	const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		keySize: 256 / 32,
		padding: CryptoJS.pad.Pkcs7
	});

	return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

function decryptBody(encryptedBody: string, publicKey: string) {
	const key = CryptoJS.enc.Base64.parse(publicKey);
	const iv = CryptoJS.enc.Utf8.parse('SSGAPIInitVector');

	const decrypted = CryptoJS.AES.decrypt(encryptedBody, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		keySize: 256 / 32,
		padding: CryptoJS.pad.Pkcs7
	});

	const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
	return JSON.parse(decryptedString) as IDataObject;
}
