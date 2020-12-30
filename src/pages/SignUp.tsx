import React from 'react'

export default function SignUp() {
	return (
		<div id="signup">
			<div id="header">
				<p className="service">Grroom</p>
				<p className="title">Sign Up</p>
			</div>
			<p>Email</p>
			<input type="text" />
			<p>Password</p>
			<input type="password" />
			<p>Confirm Password</p>
			<input type="password" />
			<p>Select a plan</p>

			<div>
				<p>Free</p>
				<p>10 projects</p>
				<p>5KB max project size</p>
				<p className="exclude">Presentations</p>
			</div>

			<div>
				<p>$5/mo</p>
				<p>10 projects</p>
				<p>5KB max project size</p>
				<p>Presentations</p>
			</div>

			<div className="most-popular">
				<p>$9/mo</p>
				<p>10 projects</p>
				<p>5KB max project size</p>
				<p>Presentations</p>
			</div>

			<div>
				<p>$20/mo</p>
				<p>10 projects</p>
				<p>5KB max project size</p>
				<p>Presentations</p>
			</div>
		</div>
	)
}
