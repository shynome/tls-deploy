import Client from '$lib/aliyun/cdn.js'
import { errStr } from '$lib/utils.js'

export async function POST({ request, cookies }) {
	const client = Client.FromCookies(cookies)
	const form = await request.formData()
	let cid = Number(form.get('cert'))
	let domain = form.get('domain') as string
	try {
		let result = await client.deployCert(domain, cid)
		return new Response(null, { status: 204 })
	} catch (err) {
		return new Response(errStr(err), { status: 400 })
	}
}
