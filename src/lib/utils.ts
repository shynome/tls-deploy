export function errStr(err: any): string {
	console.error(err)
	if (typeof err === 'string') {
		return err
	}
	if (err instanceof Error) {
		return err.message
	}
	return '未知错误'
}
