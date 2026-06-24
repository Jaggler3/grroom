type ParamCollection = { [k: string]: string; }

export function getParams() { return Object.fromEntries(new URLSearchParams(window.location.search).entries()) as ParamCollection }
