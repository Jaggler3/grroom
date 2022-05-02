import React, { useState, useEffect, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Net from '../../net/Net'
import { Project } from '../../core/Project'
import ProjectList from '../../components/ProjectList'

import './ProjectsPage.scss'
import { Oval } from 'react-loader-spinner'

export default function ProjectsPage() {

	const navigate = useNavigate()

	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<Project[]>([])
	const [projectCap, setProjectCap] = useState(0)
	const [error, setError] = useState("")

	useEffect(() => {
		(async () => {
			const response = await Net.getProjects()
			const { projects, projectCap } = response
			if (projects) {
				setData(() => projects.filter((x: Project) => x !== null && x.projectID !== "!")) //remove array initializers
				setProjectCap(projectCap)
				setLoading(false)
			} else {
				setError("Could not load project list.")
				setLoading(false)
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
				navigate("/project/" + projectID)
			}
		}
	}

	const fileTooLarge = () => {
		alert("Your file is too large. Consider upgrading your account to upload larger files.")
	}

	const confirmDeleteProject = async (projectID: string) => {
		const result = await Net.deleteProject(projectID)
		if(!result) {
			alert("Could not delete project.")
		} else {
			setData(data.filter((x: Project) => x.projectID !== projectID))
		}
	}

	return (
		<div className="dashboard-page">
			<h1>My Projects</h1>
			{error === "" ? (
				<div id="project-list">
					{!loading ? (
						<ProjectList {...{
							data,
							projectCap,
							submitNewProject,
							confirmDeleteProject: (projectID: string) => confirmDeleteProject(projectID)
						}} />
					) : (
						<div id="loading-container">
							<div id="loading-spinner">
								<Oval
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
