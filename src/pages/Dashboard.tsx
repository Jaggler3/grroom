import React, { useState } from 'react'

import './Dashboard.scss'
import { Switch, Route, useHistory } from 'react-router-dom'
import ProjectsPage from './dashboard-nav/ProjectsPage'
import SettingsPage from './dashboard-nav/SettingsPage'

interface SidebarItemData {
	name: string,
	icon: string,
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

	const logout = () => { }


	const sidebarItems: SidebarItemData[] = [
		{
			name: "Projects",
			icon: "far fa-sticky-note",
			action: () => {
				history.push("/")
				return true
			}
		},
		{
			name: "Settings",
			icon: "fas fa-cog",
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