import { Project } from "../core/Project"
import React, { ChangeEvent, useState } from "react"
import { DateTime } from "luxon"
import { isMobile } from "react-device-detect"
import { useNavigate } from "react-router-dom"
// import bytes from "bytes"

interface ProjectListProps {
	data: Project[] | null,
	projectCap: number,
	submitNewProject: (e: ChangeEvent<HTMLInputElement>) => any,
	confirmDeleteProject: (projectID: string) => any
}
export default function ProjectList({ data, projectCap, submitNewProject, confirmDeleteProject }: ProjectListProps) {

	const navigate = useNavigate()

	const [deleting, setDeleting] = useState("")

	const deleteProject = (projectID: string) => setDeleting(projectID)

	const cancelDelete = () => setDeleting("")

	return (
		<div id="items">
			<br />
			<div id="new-project" {...(data?.length === projectCap) ? () => {
				navigate("/settings")
			} : {}}>
				{data?.length === projectCap ? (
					<>
						<p id="reached-max">Reached project max.</p>
					</>
				) : (
						<>
							<p>New Project <i className="fas fa-plus"></i></p>
							<input
								id="file-upload"
								type="file"
								name="csv-file"
								accept="csv"
								multiple={false}
								onChange={(e) => submitNewProject(e)}
							></input>
						</>
					)
				}
			</div >
			{data?.map(({ projectID, name, modified }) => (
				<div className="project-parent" key={projectID}>
					<div className="project">
						{deleting === projectID ? (
							<>
								<p className="project-name">Delete '{name}'?</p>
								<span className="space"></span>
								<div className="delete-buttons">
									<button onClick={() => confirmDeleteProject(projectID)}>
										<p>Delete</p>
									</button>
									<span className="space"></span>
									<button className="thin-button" onClick={cancelDelete}>
										<p>Cancel</p>
									</button>
								</div>
							</>
						) : (
								<>
									<p className="project-name">{name}</p>
									<p>
										{DateTime.fromMillis(modified).toLocaleString(DateTime.DATETIME_MED)}
									</p>
									<span className="space"></span>
									<div className={"lower" + (isMobile ? " mobile" : "")}>
										<a className="open-project" href={"/project/" + projectID}>
											<button>
												<p>Open</p>
											</button>
										</a>
										<span className="space"></span>
										<button className="delete-project" onClick={() => deleteProject(projectID)}>
											<i className="fas fa-trash"></i>
										</button>
									</div>
								</>
							)}

					</div>
				</div>
			))}
		</div >
	)
}