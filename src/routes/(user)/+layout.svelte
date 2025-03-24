<script lang="ts">
	const { data } = $props()
</script>

<div class="container text-end">
	<div class="row g-1 align-items-center">
		<div class="col"></div>
		<div class="col col-auto">Access Key ID: {data.ak_id}</div>
		<div class="col col-auto">
			<a href="/login" class="btn btn-outline-primary btn-sm">重新登录</a>
		</div>
	</div>
</div>
<slot></slot>
