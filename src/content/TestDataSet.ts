import { DataSet, createDataItemID } from "../core/DataSet";

export const TestDataSet: DataSet = {
	lastModified: 0,
	name: "Example Data.csv",
	columns: [
		"Name",
		"Phone",
		"Type",
		"Email",
		"Joined",
		"Salary",
		"Notes",
		"Missing"
	],
	items: Array.from({ length: 100 }, (_, i) => ({
		_id: createDataItemID(),
		Name: i === 99 ? "user1" : (i % 3 === 0 ? `user${i + 1}` : `User${i + 1}`),
		Phone: i === 99 ? `+1(800)-555-8000` : `+1(800)-555-${(8000 + i).toString().padStart(4, "0")}`,
		Type: i === 99 ? "  Student" : (i % 2 === 0 ? "  Student" : "Professor "),
		Email: i === 99 ? " USER1@example.com " : (i % 4 === 0 ? ` USER${i+1}@example.com` : `user${i+1}@example.com`),
		Joined: i === 99 ? "1/1/2020" : (i % 5 === 0 ? `1/${(i%28)+1}/2020` : `2020-01-${String((i%28)+1).padStart(2, '0')}`),
		Salary: i === 99 ? "$40,000" : (i % 2 === 0 ? `$${(40000 + i * 100).toLocaleString()}` : `${40000 + i * 100}`),
		Notes: "",
		Missing: i % 7 === 0 ? "" : "Data"
	}))
}