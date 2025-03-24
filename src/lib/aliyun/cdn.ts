import cdn20180510All, {
	DescribeUserDomainsRequest,
	DescribeUserDomainsResponseBodyDomainsPageData,
	SetCdnDomainSSLCertificateRequest,
} from '@alicloud/cdn20180510'
import { Config } from '@alicloud/openapi-client'
import { pairFromCookies, type AccessKeyPair } from './types'
import type { Cookies } from '@sveltejs/kit'

// @ts-ignore
const cdn20180510: typeof cdn20180510All = cdn20180510All.default

export class Client {
	#client: cdn20180510All

	constructor(pair: AccessKeyPair) {
		const config = new Config({
			...pair,
			endpoint: `cdn.aliyuncs.com`,
		})
		this.#client = new cdn20180510(config)
	}

	static FromCookies(cookies: Cookies) {
		return new Client(pairFromCookies(cookies))
	}

	async listAllDomains(suffix: string | null) {
		let result: DescribeUserDomainsResponseBodyDomainsPageData[] = []
		let page = 1
		while (true) {
			const req = new DescribeUserDomainsRequest({
				pageNumber: page,
				pageSize: 500,
			})
			if (suffix) {
				req.domainName = suffix
				req.domainSearchType = 'suf_match'
			}
			let resp = await this.#client.describeUserDomains(req)
			let body = resp.body!
			let csrList = body.domains?.pageData ?? []
			result = result.concat(csrList)
			if (csrList.length === 0 || body.totalCount! < body.pageSize!) {
				break
			}
			page++
		}
		return result.map((v) => v.toMap()) as DescribeUserDomainsResponseBodyDomainsPageDataMap[]
	}
	async deployCert(domain: string, cert: number) {
		const req = new SetCdnDomainSSLCertificateRequest({
			domainName: domain,
			certName: domain,
			certId: cert,
			certType: 'cas',
			SSLProtocol: 'on',
		})
		const result = await this.#client.setCdnDomainSSLCertificate(req)
		return result
	}
}

export interface DescribeUserDomainsResponseBodyDomainsPageDataMap {
	CdnType: string
	Cname: string
	Coverage: string
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
		| 'stopping'
		| 'deleting'
	GmtCreated: string
	GmtModified: string
	ResourceGroupId: string
	Sandbox: string
	Sources: {
		Source: Source[]
	}
	SslProtocol: 'on' | 'off'
}

export interface Source {
	Content: string
	Port: number
	Priority: string
	Type: 'domain'
	Weight: string
}

export default Client
