import React, { useState, useEffect } from 'react'

import './Dashboard.scss'
import { Routes, Route, useNavigate, NavigateFunction } from 'react-router-dom'
import ProjectsPage from './dashboard-nav/ProjectsPage'
import SettingsPage from './dashboard-nav/SettingsPage'
import { FirebaseApp } from '../services/firebase'
import Cookies from '../content/Cookies'

interface SidebarItemData {
	name: string,
	icon: string,
	path?: string,
	subpaths?: string[],
	action: (navigate: NavigateFunction) => boolean
}

interface SidebarItemProps {
	data: SidebarItemData,
	active: boolean,
	onClick: () => any
}

const SidebarItem = ({ data: { name, icon, action }, active, onClick }: SidebarItemProps) => {

	const navigate = useNavigate()

	const onSidebarButtonClicked = () => action(navigate) && onClick()
	
	return (
		<div className={"sidebar-item" + (active ? " active" : "")} onClick={onSidebarButtonClicked}>
			<i className={icon}></i>
			<p>{name}</p>
		</div>
	)
}

const sidebarItems: SidebarItemData[] = [
	{
		name: "Projects",
		icon: "far fa-sticky-note",
		path: "/",
		action: (navigate) => {
			navigate("/")
			return true
		}
	},
	{
		name: "Settings",
		icon: "fas fa-cog",
		path: "/settings",
		subpaths: [
			"/settings/plan",
			"/settings/card"
		],
		action: (navigate) => {
			navigate("/settings")
			return true
		}
	},
	{
		name: "Logout",
		icon: "fas fa-door-open",
		action: () => {
			logout()
			return false
		}
	},
]

const logout = async () => {
	await FirebaseApp.signOut()
	Cookies.setSessionID(null)
	window.location.assign("/")
}

export default function Dashboard() {

	const [activeItem, setActiveItem] = useState<string>("Projects")

	useEffect(() => {
		const item = sidebarItems.find((item) => (
			item.path && (
				window.location.pathname === item.path
				|| (
					item.subpaths
					&& item.subpaths.indexOf(window.location.pathname) !== -1
				)
			)
		))
		if(item) {
			setActiveItem(item.name)
		}
	}, [])

	return (
		<div id="dashboard">
			<div id="sidebar">
				<p id="title">Grroom</p>
				{sidebarItems.map((item) => (
					<SidebarItem
						data={item}
						key={item.name}
						active={activeItem === item.name}
						onClick={() => setActiveItem(item.name)}
					/>
				))}
			</div>
			<div id="content">
				<Routes>
					<Route path="/settings/*" element={<SettingsPage />} />
					<Route path="/" element={<ProjectsPage />} />
				</Routes>
			</div>
		</div>
	)
}