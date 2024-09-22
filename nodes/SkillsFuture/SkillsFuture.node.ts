import {IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, IHttpRequestMethods} from 'n8n-workflow';
import {skillsFutureApiRequest} from "./GenericFunctions";


export class SkillsFuture implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'SkillsFuture',
		name: 'skillsFuture',
		icon: 'file:logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'SkillsFuture API',
		defaults: {
			name: 'SkillsFuture API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'skillsFutureApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'sfc_pay',
				options: [
					{
						name: 'SFC Pay',
						value: 'sfc_pay',
					}
				]
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'sfc_pay',
						],
					},
				},
				options: [
					{
						name: 'Encrypt Payload',
						value: 'encrypt_payload',
						action: 'Encrypt payload',
						description: 'Encrypt SFC Pay request payload',
					},
					{
						name: 'Decrypt Payload',
						value: 'decrypt_payload',
						action: 'Decrypt payload',
						description: 'Decrypt SFC Pay response payload',
					}
				],
				default: 'encrypt_payload',
			},
			{
				displayName: 'Course ID',
				name: 'courseId',
				type: 'string',
				default: '',
				description: 'The course ID (e.g., TGS-2020002106)',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['encrypt_payload'],
					},
				},
			},
			{
				displayName: 'Course Run ID',
				name: 'courseRunId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'sfc_pay'
						],
						operation: [
							'encrypt_payload',
						]
					},
				},
			},
			{
				displayName: 'Course Fee',
				name: 'courseFee',
				type: 'string',
				default: "",
				displayOptions: {
					show: {
						resource: [
							'sfc_pay',
						],
						operation: [
							'encrypt_payload',
						]
					},
				},
			},
			{
				displayName: 'Course Start Date',
				name: 'courseStartDate',
				type: 'dateTime',
				default: '',
				description: 'The start date of the course',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['encrypt_payload'],
					},
				},
			},
			{
				displayName: 'Individual NRIC',
				name: 'individualNric',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['encrypt_payload'],
					},
				},
			},
			{
				displayName: 'Individual Email',
				name: 'individualEmail',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['encrypt_payload'],
					},
				},
			},
			{
				displayName: 'Individual Home Number',
				name: 'individualHomeNumber',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['encrypt_payload'],
					},
				},
			},
			{
				displayName: 'Individual Mobile Number',
				name: 'individualMobileNumber',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['encrypt_payload'],
					},
				},
			},
			{
				displayName: 'Additional Information',
				name: 'additionalInformation',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['encrypt_payload'],
					},
				},
			}
		,
		{
			displayName: 'Encrypted Payload',
			name: 'encryptedPayload',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['sfc_pay'],
					operation: ['decrypt_payload'],
				},
			},
			description: 'The encrypted claim response payload to decrypt',
		}
		]
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		let resource: string;
		let operation: string;

		// For Post
		let body: IDataObject;
		// For Query string
		let qs: IDataObject;

		let requestMethod: IHttpRequestMethods;
		let endpoint: string;


		for (let i = 0; i < items.length; i++) {
			try {
				resource = this.getNodeParameter('resource', 0) as string;
				operation = this.getNodeParameter('operation', 0) as string;

				requestMethod = "POST";
				endpoint = '';
				body = {} as IDataObject;
				qs = {} as IDataObject;

				// ----------------------------------
				//         SFC Pay
				// ----------------------------------
				if (resource === 'sfc_pay') {
					if (operation === 'encrypt_payload') {
						requestMethod = 'POST'
						endpoint = '/skillsFutureCredits/claims/encryptRequests'
						body.claimRequest = {
							course: {
								id: this.getNodeParameter('courseId', i) as string,
								runId: this.getNodeParameter('courseRunId', i) as string,
								fee: this.getNodeParameter('courseFee', i) as string,
								startDate: this.getNodeParameter('courseStartDate', i) as string,
							},
							individual: {
								nric: this.getNodeParameter('individualNric', i) as string,
								email: this.getNodeParameter('individualEmail', i) as string,
								homeNumber: this.getNodeParameter('individualHomeNumber', i) as string,
								mobileNumber: this.getNodeParameter('individualMobileNumber', i) as string,
							},
							additionalInformation: this.getNodeParameter('additionalInformation', i) as string,
						};
					} else if (operation === 'decrypt_payload') {
						requestMethod = 'POST'
						endpoint = '/skillsFutureCredits/claims/decryptRequests'
						body.claimResponse = {
							claimRequestStatus: this.getNodeParameter('encryptedPayload', i) as string,
						};
					}
				}

				let responseData;
				responseData = await skillsFutureApiRequest.call(
					this,
					requestMethod,
					endpoint,
					body,
					true,
					true,
					qs,
				);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({error: error.message}),
						{itemData: {item: i}},
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}
		// return this.prepareOutputData(returnData);
		return [this.helpers.returnJsonArray(returnData)]
	}
}
