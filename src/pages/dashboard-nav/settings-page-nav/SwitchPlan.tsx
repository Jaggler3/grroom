import React, { useState, useEffect } from 'react'
import BackHeader from '../BackHeader'
import PlanList from '../../../components/PlanList'

import './SwitchPlan.scss'
import DisplayError from '../../../components/DisplayError'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Loader from 'react-loader-spinner'
import { useHistory } from 'react-router-dom'
import { StripeCardElementChangeEvent } from '@stripe/stripe-js'
import Net from '../../../net/Net'

export default function SwitchPlan() {

	const stripe = useStripe()
	const stripeElements = useElements()

	const [initialPlan, setInitialPlan] = useState("")
	const [selectedPlan, setSelectedPlan] = useState("")
	const [cardErr, setCardErr] = useState("")
	const [cardComplete, setCardComplete] = useState(false)

	const [ignoredFirst, setIgnoredFirst] = useState(false)

	const history = useHistory()

	const onCardChange = (e: StripeCardElementChangeEvent) => {
		if(!ignoredFirst) {
			setIgnoredFirst(true)
			return
		}
		if(!e.complete) {
			setCardErr("Invalid card information.")
			setCardComplete(false)
		} else {
			setCardComplete(true)
			setCardErr("")
		}
	}

	const confirmPlanSwitch = async () => {
		if(initialPlan === "Lite") {
			if (!stripe || !stripeElements) {
				console.error("stripe not loaded")
				return // still loading stripe
			}

			const cardElement = stripeElements.getElement(CardElement);

			if (!cardElement) {
				console.error("card element not loaded")
			}

			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: 'card',
				card: cardElement!,
			});

			if (error) {
				console.error(error);
				setCardErr("Invalid card information.")
			} else {
				await Net.switchPlan(selectedPlan, paymentMethod?.id)
			}
		} else {
			// send plan switch
			await Net.switchPlan(selectedPlan, "")
		}
		// await whatever
		history.goBack()
	}

	useEffect(() => {
		(async () => {
			const userInfo = await Net.getUserInfo()
			if(userInfo) {
				setInitialPlan(userInfo.plan)
				setSelectedPlan(userInfo.plan)
			}
		})()
	}, [])

	if(selectedPlan === "") return (
		<div id="switch-plan">
			<BackHeader />
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
		</div>
	)

	return (
		<div id="switch-plan">
			<BackHeader />
			<h1>Select a plan</h1>
			<br />
			<div id="plan-list-wrapper">
				<PlanList {...{ selectedPlan, setSelectedPlan }} />
			</div>
			<br />
			{selectedPlan !== "Lite" && initialPlan === "Lite" && (
				<>
					<h2>Payment Information</h2>
					<br />
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
							onChange={onCardChange}
						/>
					</div>
					<DisplayError errorText={cardErr} />
				</>
			)}
			<br />
			{selectedPlan !== initialPlan && (initialPlan === "Lite" ? cardComplete : true) && (
				<>
					<button id="confirm" onClick={confirmPlanSwitch}>
						<p>Confirm</p>
					</button>
					<br />
					{selectedPlan !== "Lite" && (
						<p>By confirming your subscription, you allow Grroom to charge your card for this payment and future payments concerning the selected subscription details.</p>
					)}
					<br />
				</>
			)}
			<br />
		</div>
	)
}
