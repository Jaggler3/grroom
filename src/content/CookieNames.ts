enum CookieNames {
	ModList = "grroom mod list",
	SessionID = "grroom session id"
}

export const GetModCookieName = (name: string) => "grroom mod - " + name

export default CookieNames;