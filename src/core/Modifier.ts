import { DataSet } from "./DataSet"

export const createModifierID = () => [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export interface Modifier {
	id: string,
	name: string,
	effect: string
}

export interface HelpModifier extends Modifier {
	desc: string,
	helpEffect: () => DataSet
}

export type ModifierGenerator = (data: DataSet) => HelpModifier[] | null