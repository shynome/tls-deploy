<script lang="ts">
	import { tooltip } from '@remoon.net/bootstrap'

	const { data } = $props()
	$inspect(data)
</script>

<div class="container my-3">
	<a
		href="https://yundun.console.aliyun.com/?p=cas#/certExtend/upload/cn-hangzhou?currentPage=1&pageSize=10&keyword=&statusCode="
		class="btn btn-outline-primary"
		use:tooltip
		title="懒得做上传功能, 去阿里云上传吧"
		target="aliyun"
	>
		点击前往阿里云上传证书
	</a>
</div>

<div class="container my-3">
	<table class="table">
		<thead>
			<tr>
				<th>Cert ID</th>
				<th>Sans</th>
				<th>证书备注名称</th>
				<th>有效期</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody>
			{#each data.certList as cert (cert.CertificateId)}
				{@const suffix = cert.CommonName.replace('*.', '')}
				<tr>
					<td>{cert.CertificateId}</td>
					<td>{cert.Sans}</td>
					<td>{cert.Name}</td>
					<td>
						<span use:tooltip title="起始: {cert.StartDate}">
							{cert.EndDate}
						</span>
					</td>
					<td>
						<a
							href="/dcdn/?cert={cert.CertificateId}&suffix={suffix}"
							class="btn btn-sm btn-outline-primary m-1"
							class:disabled={cert.Expired}
						>
							部署到DCDN
						</a>
						<!-- <br /> -->
						<a
							href="/cdn/?cert={cert.CertificateId}&suffix={suffix}"
							class="btn btn-sm btn-outline-primary m-1"
							class:disabled={cert.Expired}
						>
							部署到 CDN
						</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
