import { exec } from "child_process"
export default (s: string) => new Promise<string>((res, rej) => {
	exec(s, (err, out, outerr) => {
		if (err) {
			console.log("error")
			rej(err)
		}
		console.error(outerr)
		res(out)
	})
})
