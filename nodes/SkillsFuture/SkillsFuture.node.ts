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
						name: '[SFC] Encrypt Payload',
						value: 'sfc_encrypt_payload',
						action: 'Encrypt payload',
						description: 'Encrypt SFC Pay request payload',
					},
					{
						name: '[SFC] Decrypt Payload',
						value: 'sfc_decrypt_payload',
						action: 'Decrypt payload',
						description: 'Decrypt SFC Pay response payload',
					},
					{
						name: '[SFC] Upload Supporting Document',
						value: 'sfc_upload_document',
						action: 'Upload supporting document',
						description: 'Upload supporting document for a claim',
					}
				],
				default: 'sfc_encrypt_payload',
			},
			{
				displayName: 'Course ID',
				name: 'courseId',
				type: 'string',
				required: true,
				default: '',
				description: 'The course ID (e.g, TGS-2020002106)',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['sfc_encrypt_payload'],
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
							'sfc_encrypt_payload',
						]
					},
				},
			},
			{
				displayName: 'Course Fee',
				name: 'courseFee',
				type: 'string',
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: [
							'sfc_pay',
						],
						operation: [
							'sfc_encrypt_payload',
						]
					},
				},
			},
			{
				displayName: 'Course Start Date',
				name: 'courseStartDate',
				type: 'dateTime',
				default: '',
				required: true,
				description: 'The start date of the course',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['sfc_encrypt_payload'],
					},
				},
			},
			{
				displayName: 'Individual NRIC',
				name: 'individualNric',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['sfc_encrypt_payload'],
					},
				},
			},
			{
				displayName: 'Individual Email',
				name: 'individualEmail',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['sfc_encrypt_payload'],
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
						operation: ['sfc_encrypt_payload'],
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
						operation: ['sfc_encrypt_payload'],
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
						operation: ['sfc_encrypt_payload'],
					},
				},
			}
		,
		{
			displayName: 'Encrypted Payload',
			name: 'encryptedPayload',
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					resource: ['sfc_pay'],
					operation: ['sfc_decrypt_payload'],
				},
			},
			description: 'The encrypted claim response payload to decrypt',
		},
			{
				displayName: 'NRIC',
				name: 'nric',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['sfc_upload_document'],
					},
				},
				description: 'The NRIC of the individual to upload the supporting document to',
			},
		{
			displayName: 'Claim ID',
			name: 'claimID',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					resource: ['sfc_pay'],
					operation: ['sfc_upload_document'],
				},
			},
			description: 'The claim ID to upload the supporting document to',
		},
		{
			displayName: 'Attachment ID',
			name: 'attachmentID',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['sfc_pay'],
					operation: ['sfc_upload_document'],
				},
			},
			description: 'The attachment ID to upload the supporting document to',
		},
			{
				displayName: 'File (Base64)',
				name: 'attachmentByte',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['sfc_pay'],
						operation: ['sfc_upload_document'],
					},
				},
				description: 'The supporting document to upload in base64 format',
			},
		{
			displayName: 'File Name',
			name: 'fileName',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					resource: ['sfc_pay'],
					operation: ['sfc_upload_document'],
				},
			},
			description: 'The file name of the supporting document',
		},
		{
			displayName: 'File Type',
			name: 'fileType',
			type: 'options',
			default: 'pdf',
			required: true,
			options: [
				{
					name: 'DOC',
					value: 'doc',
				},
				{
					name: 'DOCX',
					value: 'docx',
				},
				{
					name: 'JPEG',
					value: 'jpeg',
				},
				{
					name: 'JPG',
					value: 'jpg',
				},
				{
					name: 'PDF',
					value: 'pdf',
				},
				{
					name: 'PNG',
					value: 'png',
				},
				{
					name: 'TIF',
					value: 'tif',
				},
				{
					name: 'XLS',
					value: 'xls',
				},
				{
					name: 'XLSM',
					value: 'xlsm',
				},
				{
					name: 'XLSX',
					value: 'xlsx',
				}
			],
			displayOptions: {
				show: {
					resource: ['sfc_pay'],
					operation: ['sfc_upload_document'],
				},
			},
			description: 'The file type of the supporting document',
		},
		{
			displayName: 'File Size',
			name: 'fileSize',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					resource: ['sfc_pay'],
					operation: ['sfc_upload_document'],
				},
			},
			description: 'The file size of the supporting document, with unit, eg: 12.5 MB',
		},
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
					if (operation === 'sfc_encrypt_payload') {
						requestMethod = 'POST'
						endpoint = '/skillsFutureCredits/claims/encryptRequests'
						body.claimRequest = {
							course: {
								id: this.getNodeParameter('courseId', i)?.toString(),
								runId: this.getNodeParameter('courseRunId', i)?.toString(),
								fee: this.getNodeParameter('courseFee', i)?.toString(),
								startDate: this.getNodeParameter('courseStartDate', i)?.toString(),
							},
							individual: {
								nric: this.getNodeParameter('individualNric', i)?.toString(),
								email: this.getNodeParameter('individualEmail', i)?.toString(),
								homeNumber: this.getNodeParameter('individualHomeNumber', i)?.toString(),
								mobileNumber: this.getNodeParameter('individualMobileNumber', i)?.toString(),
							},
							additionalInformation: this.getNodeParameter('additionalInformation', i)?.toString(),
						};
					} else if (operation === 'sfc_decrypt_payload') {
						requestMethod = 'POST'
						endpoint = '/skillsFutureCredits/claims/decryptRequests'
						body = {
							claimRequestStatus: this.getNodeParameter('encryptedPayload', i) as string,
						};
					} else if (operation === 'sfc_upload_document') {
						requestMethod = 'POST'
						let claimID = this.getNodeParameter('claimID', i)?.toString()
						endpoint = '/skillsFutureCredits/claims/' + claimID +'/supportingdocuments'
						body = {
							nric: this.getNodeParameter('nric', i) as string,
							attachments: [
								{
									fileName: this.getNodeParameter('fileName', i)?.toString(),
									fileType: this.getNodeParameter('fileType', i)?.toString(),
									fileSize: this.getNodeParameter('fileSize', i)?.toString(),
									attachmentId: this.getNodeParameter('attachmentID', i)?.toString(),
									attachmentByte:  this.getNodeParameter('attachmentByte', i)?.toString(),
								}
							],
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
