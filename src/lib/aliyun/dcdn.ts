import dcdn20180115All, {
	DescribeDcdnUserDomainsRequest,
	DescribeDcdnUserDomainsResponseBodyDomainsPageData,
	SetDcdnDomainSSLCertificateRequest,
} from '@alicloud/dcdn20180115'
import { Config } from '@alicloud/openapi-client'
import { pairFromCookies, type AccessKeyPair } from './types'
import type { Cookies } from '@sveltejs/kit'

// @ts-ignore
const dcdn20180115: typeof dcdn20180115All = dcdn20180115All.default

export class Client {
	#client: dcdn20180115All

	constructor(pair: AccessKeyPair) {
		const config = new Config({
			...pair,
			endpoint: `dcdn.aliyuncs.com`,
		})
		this.#client = new dcdn20180115(config)
	}

	static FromCookies(cookies: Cookies) {
		return new Client(pairFromCookies(cookies))
	}

	async listAllDomains(suffix: string | null) {
		let result: DescribeDcdnUserDomainsResponseBodyDomainsPageData[] = []
		let page = 1
		while (true) {
			const req = new DescribeDcdnUserDomainsRequest({
				pageNumber: page,
				pageSize: 500,
			})
			if (suffix) {
				req.domainName = suffix
				req.domainSearchType = 'suf_match'
			}
			let resp = await this.#client.describeDcdnUserDomains(req)
			let body = resp.body!
			let csrList = body.domains?.pageData ?? []
			result = result.concat(csrList)
			if (csrList.length === 0 || body.totalCount! < body.pageSize!) {
				break
			}
			page++
		}
		return result.map((v) => v.toMap()) as DescribeDcdnUserDomainsResponseBodyDomainsPageDataMap[]
	}
	async deployCert(domain: string, cert: number) {
		const req = new SetDcdnDomainSSLCertificateRequest({
			domainName: domain,
			certName: domain,
			certId: cert,
			certType: 'cas',
			SSLProtocol: 'on',
		})
		const result = await this.#client.setDcdnDomainSSLCertificate(req)
		return result
	}
}

export interface DescribeDcdnUserDomainsResponseBodyDomainsPageDataMap {
	Cname: string
	Description: string
	DomainId: number
	DomainName: string
	DomainStatus:
		| 'online'
		| 'offline'
		| 'configuring'
		| 'configure_failed'
		| 'checking'
		| 'check_failed'
	FunctionType: string
	GmtCreated: string
	GmtModified: string
	ResourceGroupId: string
	SSLProtocol: 'on' | 'off'
	Sandbox: string
	Scene: string
	Sources: {
		Source: Source[]
	}
}

export interface Source {
	Content: string
	Port: number
	Priority: string
	Type: 'domain'
	Weight: string
}

export default Client
