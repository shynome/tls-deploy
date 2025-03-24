import cas20200407All, {
	ListCertRequest,
	ListCertWarehouseRequest,
	ListCsrResponseBodyCsrList,
	ListUserCertificateOrderRequest,
	ListUserCertificateOrderResponseBodyCertificateOrderList,
} from '@alicloud/cas20200407'
import { Config } from '@alicloud/openapi-client'
import { pairFromCookies, type AccessKeyPair } from './types'
import type { Cookies } from '@sveltejs/kit'

// @ts-ignore
const cas20200407: typeof cas20200407All = cas20200407All?.default ?? cas20200407All

export class Client {
	#client: cas20200407All

	constructor(pair: AccessKeyPair) {
		const config = new Config({
			...pair,
			endpoint: `cas.aliyuncs.com`,
		})
		this.#client = new cas20200407(config)
	}

	static FromCookies(cookies: Cookies) {
		return new Client(pairFromCookies(cookies))
	}

	listCert() {
		const req = new ListUserCertificateOrderRequest({
			orderType: 'CERT',
		})
		return this.#client.listUserCertificateOrder(req)
	}

	async listAllCert() {
		let result: ListUserCertificateOrderResponseBodyCertificateOrderList[] = []
		let page = 1
		while (true) {
			const req = new ListUserCertificateOrderRequest({
				orderType: 'CERT',
				currentPage: page,
				showSize: 500,
			})
			let resp = await this.#client.listUserCertificateOrder(req)
			let body = resp.body!
			let csrList = body.certificateOrderList ?? []
			result = result.concat(csrList)
			if (csrList.length === 0 || body.totalCount! < body.showSize!) {
				break
			}
			page++
		}
		return result.map((v) =>
			v.toMap(),
		) as ListUserCertificateOrderResponseBodyCertificateOrderListMap[]
	}
}

export interface ListCsrResponseBodyCsrListMap {
	Algorithm: string
	CommonName: string
	CorpName: string
	CountryCode: string
	CsrId: number
	Department: string
	HasPrivateKey: boolean
	KeySha2: string
	KeySize: number
	Locality: string
	Name: string
	Province: string
}

export interface ListUserCertificateOrderResponseBodyCertificateOrderListMap {
	CertificateId: number
	City: string
	CommonName: string
	Country: string
	EndDate: string
	Expired: boolean
	Fingerprint: string
	InstanceId: string
	Issuer: string
	Name: string
	OrgName: string
	Province: string
	ResourceGroupId: string
	Sans: string
	SerialNo: string
	Sha2: string
	StartDate: string
	Status: string
	Upload: boolean
}

export default Client
