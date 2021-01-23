import { Duplex, Stream } from "stream"

export const bufferToStream = (buffer: Buffer) => {
	let tmp = new Duplex()
	tmp.push(buffer)
	tmp.push(null)
	return tmp
}

export const streamToString = (stream: Stream): Promise<string> => {
	const chunks: Uint8Array[] = []
	return new Promise((resolve, reject) => {
		stream.on('data', chunk => chunks.push(chunk))
		stream.on('error', reject)
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
	})
}