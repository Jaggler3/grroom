import React, { useState, ChangeEvent } from 'react'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import * as EmailValidator from 'email-validator';

import './SignUp.scss'
import { PlanData } from '../business/Plans';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51I3zN8APSwzhwjAkbKJzwHHyyUwQjrmypndifIKtImuPKU1QOo7fmesUww7tcZPIM9lO7VoJDNG1HZgoH9TtZ6DO00VoA7CeAo');

const DisplayError = ({ errorText }: { errorText: string }) =>
	(errorText !== "") ? <p className="error">{errorText}</p> : null;


interface PlanListProps {
	selectedPlan: string,
	setSelectedPlan: (value: string) => void
}
const PlanList = ({ selectedPlan, setSelectedPlan }: PlanListProps) => (
	<>
		{PlanData.map(({ name, price, desc, excluded, mostPopular }, i) => (
			<div
				onClick={() => setSelectedPlan(name)}
				key={i}
				className={"plan" + (selectedPlan === name ? " selected" : "")}
			>
				{mostPopular && <p className="most-popular">MOST POPULAR</p>}
				<p className="plan-title">{name}</p>
				<p className="plan-price">{price}</p>
				{desc.map((item, j) => (
					<p key={j}>{item}</p>
				))}
				{excluded.map((item, j) => (
					<p className="excluded" key={j}>{item}</p>
				))}
			</div>
		))}
	</>
)

export default function SignUp() {

	const [selectedPlan, setSelectedPlan] = useState("Lite")

	const [emailErr, setEmailErr] = useState("")
	const [passwordErr, setPasswordErr] = useState("")
	const [confirmErr, setConfirmErr] = useState("")
	const [cardErr, setCardErr] = useState("")

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	const [cardComplete, setCardComplete] = useState(false)

	const updateEmail = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value.trim())
		setEmailErr((emailErr.length > 0 && EmailValidator.validate(email)) ? "" : emailErr)
	}
	const updatePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
		setPasswordErr((passwordErr.length > 0 && password.length >= 6) ? "" : emailErr)
	}
	const updateConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value)
		setConfirmErr((confirmErr.length > 0 && password === confirmPassword) ? "" : emailErr)
	}

	const blurEmail = () =>
		setEmailErr(!EmailValidator.validate(email) ? "Not a valid email." : "")

	const blurPassword = () => {
		setPasswordErr(password.length < 6 ? "Password must be at least 6 characters." : "")
		setConfirmErr((password !== confirmPassword && confirmPassword.length > 0) ? "Passwords do not match." : "")
	}
	const blurConfirmPassword = () =>
		setConfirmErr(password !== confirmPassword ? "Passwords do not match." : "")

	const hasErrors = () =>
		emailErr !== ""
		|| passwordErr !== ""
		|| confirmErr !== ""

	const hasValidInputs = () =>
		EmailValidator.validate(email)
		&& password.length >= 6
		&& confirmPassword === password
		&& (selectedPlan === "Lite" || cardComplete)

	return (
		<Elements stripe={stripePromise}>
			<div id="signup">
				<div id="left">
					<div>
						<p id="service-name">Grroom</p>
						<p className="title">Sign Up</p>
						<p className="subtitle">Get more of what Grroom has to offer</p>
					</div>
				</div>
				<div id="right">
					<p className="section">Account Information</p>
					<p className="label">Email</p>
					<input
						type="text"
						className="form-input"
						spellCheck={false}
						onChange={updateEmail}
						onBlur={blurEmail}
						value={email}
					/>
					<DisplayError errorText={emailErr} />
					<p className="label">Password</p>
					<input
						type="password"
						className="form-input"
						onChange={updatePassword}
						onBlur={blurPassword}
						value={password}
					/>
					<DisplayError errorText={passwordErr} />
					<p className="label">Confirm Password</p>
					<input
						type="password"
						className="form-input"
						onChange={updateConfirmPassword}
						onBlur={blurConfirmPassword}
						value={confirmPassword}
					/>
					<DisplayError errorText={confirmErr} />
					<br />
					<p id="signin-suggest">Already have an account? <a href="/signin">Sign In</a></p>
					<p className="section">Select a plan</p>
					<div id="plans">
						<PlanList selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
						<DisplayError errorText={cardErr} />
					</div>
					{selectedPlan !== "Lite" && (
						<>
							<p className="section">Payment Information</p>
							<p className="label">Card</p>
							<div id="card-container">
								<CardElement
									options={{
										style: {
											base: {
												color: "#424770",
												letterSpacing: "0.025em",
												fontFamily: "sans-serif",
												"::placeholder": { color: "#aab7c4" },
												backgroundColor: "white",
												fontSize: "16px"
											},
											invalid: { color: "#9e2146" }
										}
									}}
									onChange={(e: StripeCardElementChangeEvent) => {
										setCardErr("")
										setCardComplete(e.complete)
									}}
								/>
							</div>
							<DisplayError errorText={cardErr} />
						</>
					)}
					<br />
					<SubmitSignup hasErrors={hasErrors} setCardErr={(text) => setCardErr(text)} disabled={!hasValidInputs()} />
				</div>
			</div>
		</Elements>
	)
}

interface SubmitSignupProps {
	hasErrors: () => boolean,
	setCardErr: (text: string) => void,
	disabled: boolean
}
function SubmitSignup({ disabled, hasErrors, setCardErr }: SubmitSignupProps) {

	const stripe = useStripe()
	const stripeElements = useElements()

	const submit = async () => {
		if (!stripe || !stripeElements) {
			return // still loading stripe
		}

		const cardElement = stripeElements.getElement(CardElement);

		if (!cardElement) return

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement!,
		});

		if (error) {
			console.log('[error]', error);
			setCardErr("Invalid card information.")
		} else {
			console.log('[PaymentMethod]', paymentMethod);
		}
	}

	return (
		<div id="submit-container">
			<button disabled={disabled || hasErrors() || !stripe} onClick={submit}><p>Create Account</p></button>
			<DisplayError errorText={hasErrors() ? "You have an error above." : ""} />
		</div>
	)
}