import { exec } from "child_process"
export default (s: string) => new Promise<string>((res, rej) => {
	exec(s, (err, out) => {
		if (err) rej(err)
		res(out)
	})
})
