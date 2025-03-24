import Client from '$lib/aliyun/cas.js'

export async function load({ cookies }) {
	const client = Client.FromCookies(cookies)
	let certList = await client.listAllCert()
	return {
		certList: certList,
	}
}
