import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

import { Client } from '$lib/aliyun/cas'

export const actions = {
	default: async ({ request, cookies, url }) => {
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
			let opts = {
				path: '/',
				httpOnly: true,
				secure: url.protocol === 'https:',
			}
			const resp = await client.listCsr()
			cookies.set('ak_id', data.ak_id, opts)
			cookies.set('ak_secret', data.ak_secret, opts)
		} catch (err) {
			data.msg = `登录失败. 错误原因: ${err}`
			return fail(400, data)
		}
		redirect(303, '/')
	},
} satisfies Actions
