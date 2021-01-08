import CookieNames from "../content/CookieNames"
import Cookies from "../content/Cookies"
import { FirebaseApp } from "../services/firebase"

const ServerLoc = "http://localhost:8000"

export const Get = (path: string) => fetch(ServerLoc + "/" + path)
export const PostJson = (path: string, body: object) => fetch(ServerLoc + "/" + path, {
	method: "POST",
	body: JSON.stringify(body),
	headers: {
		"Content-Type": "application/json"
	}
})

export const PostForm = (path: string, formData: FormData) => fetch(ServerLoc + "/" + path, {
	method: "POST",
	headers: {
		"Encoding-Type": "multipart/form-data"
	},
	body: formData
})

const Net = {
	/**
	 * Submit account information to make a new user
	 * 
	 * @returns A session token if successful, otherwise `null`
	 */
	submitCreateAccount: async (idToken: string, plan: string, pmID?: string): Promise<string | null> => {
		const request = await PostJson("user/signup?idToken=" + idToken, {
			plan,
			pmID
		})

		const result = await request.json()

		console.log(result)

		if (result.status === "success") {
			return result.sessionID
		}

		return null
	},
	submitSignIn: async (): Promise<string | null> => {
		const token = await FirebaseApp.getUser()?.getIdToken()
		const request = await Get("user/signin?idToken=" + token)

		const result = await request.json()
		console.log(result)

		if (result.status === "success") {
			Cookies.setSessionID(result.sessionID)
			return result.sessionID
		}

		return null
	},
	verifySession: async () => {
		const oldSession = Cookies.getSessionID()
		if (!oldSession) {
			return false
		}
		const request = await Get("session/verify?sessionID=" + oldSession)
		const result = await request.json().catch(console.error)
		console.log(result)
		return result && result.status === "success"
	},
	getProjects: async () => {
		const request = await Get("project/list?sessionID=" + Cookies.getSessionID())

		const result = await request.json().catch(console.error)

		if (result.status === "success") {
			return result.projects
		}

		return null
	},
	readProject: async (projectID: string) => {
		const request = await Get(`project/read?sessionID=${Cookies.getSessionID()}&projectID=${projectID}`)
		const result = await request.json().catch(console.error)

		if (result.status === "success") {
			return result.contents
		}

		return null
	},
	getProjectInfo: async (projectID: string) => {
		const request = await Get(`project/info?sessionID=${Cookies.getSessionID()}&projectID=${projectID}`)
		const result = await request.json().catch(console.error)

		if (result.status === "success") {
			return result.info
		}

		return null
	},
	uploadBounce: async (formData: FormData) => {
		const response = await PostForm("upload", formData)
		if(!response) return null
		return await response.text().catch(console.error)
	},
	saveProject: async (projectID: string, contents: string, shouldSaveName: boolean, name: string): Promise<boolean> => {
		const sessionID = Cookies.getSessionID()
		const encodedName = encodeURIComponent(name)

		// update name
		if (shouldSaveName) {
			const request = await Get(`project/rename?sessionID=${sessionID}&projectID=${projectID}&newName=${encodedName}`)
			const result = await request.json()

			if (result.status !== "success") {
				return false
			}
		}

		// update contents
		let file = new File([ contents ], "tmp")
		const formData = new FormData()
		formData.set("csv-file", file)

		const response = await PostForm(`project/save?sessionID=${sessionID}&projectID=${projectID}&name=${encodedName}`, formData )

		return !!response
	},
	createProject: async (file: File, onFileTooLarge: () => void ) => {
		const name = file.name
		const sessionID = Cookies.getSessionID()
		const encodedName = encodeURIComponent(name)

		// update contents
		const formData = new FormData()
		formData.append("csv-file", file)

		const request = await PostForm(`project/create?sessionID=${sessionID}&name=${encodedName}`, formData )

		const response = await request.json().catch(console.error)

		if(response.status === "failure") {
			if(response.reason === "file-too-large") onFileTooLarge()
			return ""
		}

		return response.projectID
	}
}

export default Net