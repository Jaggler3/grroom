interface Plan {
	name: string,
	price: string,
	desc: string[],
	excluded: string[],
	mostPopular: boolean
}

export const PlanData: Plan[] = [
	{
		name: "Lite",
		price: "Free",
		desc: [
			"No hosted projects", "15KB Max Project Size", "Local Custom Mods"
		],
		excluded: [
			"Premium Suggestions"
		],
		mostPopular: false
	},
	{
		name: "Basic",
		price: "$5/mo",
		desc: [
			"10 Projects", "5MB Max Project Size", "25 Custom Mods"
		],
		excluded: [
			"Premium Suggestions"
		],
		mostPopular: false
	},
	{
		name: "Premium",
		price: "$9/mo",
		desc: [
			"20 Projects", "15MB Max Project Size", "50 Custom Mods", "Premium Suggestions"
		],
		excluded: [],
		mostPopular: true
	},
	{
		name: "Pro",
		price: "$20/mo",
		desc: [
			"20 Projects", "50MB Max Project Size", "100 Custom Mods", "Premium Suggestions"
		],
		excluded: [],
		mostPopular: false
	}
]
