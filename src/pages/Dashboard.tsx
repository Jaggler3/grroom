import React, { useState, useEffect, ChangeEvent } from 'react'
import { DateTime } from "luxon"
import bytes from "bytes"

import Header from '../components/Header'
import './Dashboard.scss'
import Net from '../net/Net'
import { Project } from '../core/Project'

// show project list & new button, custom modifier list, logout button
export default function Dashboard() {

	const [data, setData] = useState(null)

	const [error, setError] = useState("")

	useEffect(() => {
		(async () => {
			const projects = await Net.getProjects()
			if (projects) {
				setData(projects.filter((x: Project) => x !== null && x.projectID !== "!")) //remove array initializers
			} else {
				setError("Could not load project list.")
			}
		})()
	}, [])

	const submitNewProject = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files

		if(files && files.length > 0) {
			const file = files[0]

			const formData = new FormData()
			formData.append('csv-file', file)

			const projectID = await Net.createProject(file, fileTooLarge)
			if (projectID) {
				window.location.assign("/project/" + projectID)
			}
		}
	}

	const fileTooLarge = () => {
		alert("Your file is too large. Consider upgrading your account to upload larger files.")
	}

	return (
		<div id="dashboard">
			<Header hideImport signedIn/>
			<div id="content">
				<h1>Projects</h1>
				{error === "" ? (
					<div id="project-list">
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
						{data ? (
							<ProjectList data={data} />
						) : (
								<>
									<br />
									<div className="project">
										<p className="loading">Loading...</p>
									</div>
								</>
							)}
					</div>
				) : (
						<p>Error: {error}</p>
					)}
			</div>
		</div>
	)
}

interface ProjectListProps {
	data: Project[] | null
}
function ProjectList({ data }: ProjectListProps) {

	if (data && data.length === 0) return (
		<div>
			<br />
			<p>No projects to show.</p>
		</div>
	)

	return (
		<div id="items">
			<br />
			{data?.map((project) => (
				<a href={"/project/" + project.projectID} key={project.projectID}>
					<div
						className="project"
					>
						<p className="project-name">{project.name}</p>
						<div className="lower">
							<p>
								<i className="far fa-clock"></i>
								{" "}
								{DateTime.fromMillis(project.modified).toLocaleString(DateTime.DATETIME_MED)}
							</p>
							<p className="space"></p>
							<p><i className="far fa-save"></i> {bytes(project.bytes)}</p>
						</div>
					</div>
				</a>
			))}
		</div>
	)
}