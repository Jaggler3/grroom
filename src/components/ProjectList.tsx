import { Project } from "../core/Project"
import React, { ChangeEvent } from "react"
import { DateTime } from "luxon"
// import bytes from "bytes"

interface ProjectListProps {
	data: Project[] | null,
	submitNewProject: (e: ChangeEvent<HTMLInputElement>) => any
}
export default function ProjectList({ data, submitNewProject }: ProjectListProps) {

	if (data && data.length === 0) return (
		<div>
			<br />
			<p>No projects to show.</p>
		</div>
	)

	return (
		<div id="items">
			<br />
			<div id="new-project">
				<p>New Project <i className="fas fa-plus"></i></p>
				<input
					id="file-upload"
					type="file"
					name="csv-file"
					accept="csv"
					multiple={false}
					onChange={(e) => submitNewProject(e)}
				></input>
			</div>
			{data?.map((project) => (
				<div className="project-parent" key={project.projectID}>
					<div className="project">
						<p className="project-name">{project.name}</p>
						<p>
							{DateTime.fromMillis(project.modified).toLocaleString(DateTime.DATETIME_MED)}
						</p>
						<div className="lower">
							<a className="open-project" href={"/project/" + project.projectID}>
								<button>
									<p>Open</p>
								</button>
							</a>
							<span className="space"></span>
							<button className="delete-project">
								<i className="fas fa-trash"></i>
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}