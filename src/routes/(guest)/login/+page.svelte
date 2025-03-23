<script lang="ts">
	import { withPending } from '$lib/pending.svelte'
	const pending = withPending(true)
	import type { PageData, ActionData } from './$types'
	let { form }: { data: PageData; form: ActionData } = $props()
</script>

<svelte:head>
	<title>登录</title>
</svelte:head>

<form method="post">
	<div class="modal show d-block">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">使用阿里云 AccessKey 登录</h5>
				</div>
				<div class="modal-body py-0">
					{#if form?.msg}
						<div class="alert alert-danger" role="alert">{form?.msg}</div>
					{/if}
					<div class="my-3">
						<label for="ak_id" class="form-label">ID *</label>
						<input
							type="text"
							id="ak_id"
							name="ak_id"
							class="form-control"
							required
							placeholder="Access Key ID"
							value={form?.ak_id}
						/>
						<div class="form-text">Access Key ID</div>
					</div>
					<div class="my-3">
						<label for="ak_secret" class="form-label">Secret *</label>
						<input
							type="password"
							id="ak_secret"
							name="ak_secret"
							class="form-control"
							required
							placeholder="Access Key Secret"
							value={form?.ak_secret}
						/>
						<div class="form-text">Access Key Secret</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn btn-primary">登录</button>
				</div>
			</div>
		</div>
	</div>
</form>
