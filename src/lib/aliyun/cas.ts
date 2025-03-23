import cas20200407All, { ListCertRequest } from '@alicloud/cas20200407'
import { Config } from '@alicloud/openapi-client'
import type { AccessKeyPair } from './types'

// @ts-ignore
const cas20200407: typeof cas20200407All = cas20200407All.default

export class Client {
	#client: cas20200407All

	constructor(pair: AccessKeyPair) {
		const config = new Config({
			...pair,
			endpoint: `cas.aliyuncs.com`,
		})
		this.#client = new cas20200407(config)
	}

	listCsr() {
		const req = new ListCertRequest()
		return this.#client.listCsr(req)
	}
}

export default Client
