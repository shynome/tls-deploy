import { redirect } from '@sveltejs/kit'

export function load({ cookies }) {
	let id = cookies.get('ak_id')
	let secret = cookies.get('ak_secret')
	if (!id || !secret) {
		redirect(303, '/login')
	}
}
