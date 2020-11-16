import { DataSet } from "./DataSet"

export type ModifierEffect = () => DataSet | string

export const createModifierID = () => [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export interface Modifier {
	id: string,
	name: string,
	effect: ModifierEffect
}

export interface HelpModifier extends Modifier {
	desc: string,
	effect: () => DataSet
}

export type ModifierGenerator = (data: DataSet) => HelpModifier[] | null