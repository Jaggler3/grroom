import CookieNames from "./CookieNames"

const setter = (cookieName: string) => (value: string | null) => value ? localStorage.setItem(cookieName, value) : localStorage.removeItem(cookieName)
const getter = (cookieName: string) => () => localStorage.getItem(cookieName)

const Cookies = {
	getSessionID: getter(CookieNames.SessionID),
	setSessionID: setter(CookieNames.SessionID)
}

export default Cookies