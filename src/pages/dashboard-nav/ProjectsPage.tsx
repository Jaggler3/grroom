import React, { useState, useEffect, ChangeEvent } from 'react'
import { useHistory } from 'react-router-dom'
import Net from '../../net/Net'
import { Project } from '../../core/Project'
import ProjectList from '../../components/ProjectList'

import './ProjectsPage.scss'
import Loader from 'react-loader-spinner'

export default function ProjectsPage() {

	const history = useHistory()

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

		if (files && files.length > 0) {
			const file = files[0]

			const formData = new FormData()
			formData.append('csv-file', file)

			const projectID = await Net.createProject(file, fileTooLarge)
			if (projectID) {
				history.push("/project/" + projectID)
			}
		}
	}

	const fileTooLarge = () => {
		alert("Your file is too large. Consider upgrading your account to upload larger files.")
	}

	return (
		<div className="dashboard-page">
			<h1>Projects</h1>
			{error === "" ? (
				<div id="project-list">
					{data ? (
						<ProjectList data={data} submitNewProject={submitNewProject} />
					) : (
						<div id="loading-container">
							<div id="loading-spinner">
								<Loader
									type="Oval"
									color="#5697E3"
									height={100}
									width={100}
								/>
							</div>
						</div>
					)}
				</div>
			) : (
					<p>Error: {error}</p>
				)}
		</div>
	)
}
