import Client from '$lib/aliyun/cdn.js'

export async function load({ cookies, url }) {
	const client = Client.FromCookies(cookies)
	let suffix = url.searchParams.get('suffix')
	const domains = await client.listAllDomains(suffix)
	return {
		domains,
		cert: url.searchParams.get('cert'),
	}
}
