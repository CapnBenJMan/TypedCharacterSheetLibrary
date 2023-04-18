interface google {
	readonly script: script
}

interface script {
	readonly run: run
	readonly host: host
}

interface host {
	close(): void
}

interface run {
	withSuccessHandler(callback: (returnValue: any) => unknown): run

	withFailureHandler(callback: (err: Error) => unknown): run

	withUserObject(): run

	callLibraryFunction(fn: string): any
	callLibraryFunction(fn: string, args: any[]): any
}

declare const google: google