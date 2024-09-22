import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SkillsFutureApi implements ICredentialType {
	name = 'skillsFutureApi';
	displayName = 'SkillsFuture API';
	documentationUrl = 'https://developer.ssg-wsg.gov.sg/webapp/api-discovery';
	properties: INodeProperties[] = [
		{
			displayName: 'Certificate',
			name: 'certificate',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Private Key',
			name: 'public_key',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Encryption Key',
			name: 'encryption_key',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'UAT Mode',
			name: 'test_mode ',
			type: 'boolean',
			default: '',
		},
	];
}
