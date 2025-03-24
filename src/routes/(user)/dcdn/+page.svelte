<script lang="ts">
	import { withPending } from '$lib/pending.svelte.js'
	import { tooltip } from '@remoon.net/bootstrap'

	const { data } = $props()
	$inspect(data)
	const pending = withPending()

	interface Item {
		success: boolean
		msg: string
	}

	let tasksResult = $state(
		data.domains.reduce(
			(t, v) => {
				t[v.DomainName] = null
				return t
			},
			{} as { [k: string]: Item | null },
		),
	)
	async function deployCert() {
		for (let d of data.domains) {
			await Promise.resolve()
				.then(async () => {
					const form = new FormData()
					form.set('domain', d.DomainName)
					form.set('cert', data.cert!)
					let resp = await fetch('./api/', {
						body: form,
						method: 'post',
					})
					if (resp.status === 204) {
						tasksResult[d.DomainName] = { success: true, msg: '部署成功' }
					} else if (resp.status === 400) {
						let msg = await resp.text()
						tasksResult[d.DomainName] = { success: false, msg: msg }
					} else {
						throw resp
					}
				})
				.catch((err) => {
					console.error(err)
					tasksResult[d.DomainName] = { success: false, msg: '未知错误' }
				})
		}
	}
</script>

<svelte:head>
	<title>部署证书到DCDN</title>
</svelte:head>

<div class="container my-3">
	<div class="row">
		<div class="col">
			<a href="/" class="btn btn-outline-primary" class:disabled={pending.value}>返回首页</a>
		</div>
		<div class="col col-auto">
			<button
				type="button"
				class="btn btn-outline-primary"
				disabled={pending.value || !data.cert}
				onclick={() => {
					pending.call(deployCert)
				}}
			>
				将证书{data.cert}部署到下列DCDN网站中
			</button>
		</div>
	</div>
</div>

<div class="container my-3">
	<table class="table">
		<thead>
			<tr>
				<th>Domain ID({data.domains.length})</th>
				<th>域名</th>
				<th>SSL</th>
				{#if data.cert}
					<th>部署结果</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each data.domains as d (d.DomainId)}
				<tr>
					<td>{d.DomainId}</td>
					<td>
						<span
							class:text-secondary={d.DomainStatus === 'offline'}
							use:tooltip
							title="域名状态: {d.DomainStatus}"
						>
							{d.DomainName}
						</span>
					</td>
					<td>
						{#if d.SSLProtocol === 'on'}
							<span class="text-success">
								<i class="bi bi-file-lock-fill"></i>{d.SSLProtocol}
							</span>
						{:else}
							<span class="text-danger">
								<i class="bi bi-file-lock"></i>{d.SSLProtocol}
							</span>
						{/if}
					</td>
					{#if data.cert}
						{@const result = tasksResult[d.DomainName]}
						<td>
							{#if !result}
								等待部署中
							{:else if result.success}
								部署成功
							{:else}
								<span class="text-danger" use:tooltip title={result.msg}>部署失败</span>
							{/if}
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
