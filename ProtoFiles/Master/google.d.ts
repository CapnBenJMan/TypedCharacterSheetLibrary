interface google {
	script: script
}

interface script {
	run: run
	host: host
}

interface host {
	close(): void
}

interface run {
	withSuccessHandler(callback: (returnValue: any) => unknown): run

	withFailureHandler(callback: (err: Error) => unknown): run

	withUserObject(): run

	callLibraryFunction(fn: string)
	callLibraryFunction(fn: string, args: any[])
}

declare var google: google