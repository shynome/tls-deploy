import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

import { Client } from '$lib/aliyun/cas'

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData()
		let data = {
			ak_id: form.get('ak_id')! as string,
			ak_secret: form.get('ak_secret')! as string,
			msg: null as string | null,
		}
		const client = new Client({
			accessKeyId: data.ak_id,
			accessKeySecret: data.ak_secret,
		})
		try {
			const resp = await client.listCsr()
			cookies.set('ak_id', data.ak_id, { path: '/', httpOnly: true, secure: false })
			cookies.set('ak_secret', data.ak_secret, { path: '/', httpOnly: true, secure: false })
		} catch (err) {
			data.msg = `登录失败. 错误原因: ${err}`
			fail(400, data)
		}
		redirect(303, '/')
	},
} satisfies Actions
