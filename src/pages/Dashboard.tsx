import React, { useState, useEffect } from 'react'

import './Dashboard.scss'
import { Switch, Route, useHistory } from 'react-router-dom'
import ProjectsPage from './dashboard-nav/ProjectsPage'
import SettingsPage from './dashboard-nav/SettingsPage'
import { FirebaseApp } from '../services/firebase'
import Cookies from '../content/Cookies'

interface SidebarItemData {
	name: string,
	icon: string,
	path?: string,
	subpaths?: string[],
	action: (props?: any) => boolean
}

interface SidebarItemProps {
	data: SidebarItemData,
	active: boolean,
	onClick: () => any
}

const SidebarItem = ({ data: { name, icon, action }, active, onClick }: SidebarItemProps) => {
	return (
		<div
			className={"sidebar-item" + (active ? " active" : "")}
			onClick={() => {
				if(action()) {
					onClick();
				}
			}}
		>
			<i className={icon}></i>
			<p>{name}</p>
		</div>
	)
}

export default function Dashboard({ match }: { match: any }) {

	const history = useHistory()

	const [activeItem, setActiveItem] = useState<string>("Projects")

	const logout = async () => {
		await FirebaseApp.signOut()
		Cookies.setSessionID(null)
		window.location.assign("/")
	}

	const sidebarItems: SidebarItemData[] = [
		{
			name: "Projects",
			icon: "far fa-sticky-note",
			path: "/",
			action: () => {
				history.push("/")
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
			action: () => {
				history.push("/settings")
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
						active={activeItem === item.name}
						onClick={() => setActiveItem(item.name)}
					/>
				))}
			</div>
			<div id="content">
				<Switch>
					<Route path="/settings" component={SettingsPage} />
					<Route path="/" component={ProjectsPage} />
				</Switch>
			</div>
		</div>
	)
}