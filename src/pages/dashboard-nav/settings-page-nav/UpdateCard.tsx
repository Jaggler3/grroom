import React, { useState, useEffect } from 'react'
import BackHeader from '../BackHeader'

import DisplayError from '../../../components/DisplayError'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'
import { StripeCardElementChangeEvent } from '@stripe/stripe-js'
import Net from '../../../net/Net'

export default function UpdateCard() {

	const stripe = useStripe()
	const stripeElements = useElements()

	const [cardErr, setCardErr] = useState("")
	const [cardComplete, setCardComplete] = useState(false)

	const navigate = useNavigate()

	const onCardChange = (e: StripeCardElementChangeEvent) => {
		setCardComplete(e.complete)
	}

	const confirmUpdateCard = async () => {
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

		if (error || !paymentMethod?.id) {
			console.error(error);
			setCardErr("Invalid card information.")
		} else {
			await Net.updateCard(paymentMethod.id)
			navigate(-1)
		}
	}

	return (
		<div>
			<BackHeader />
			<h1>Update Card</h1>
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
			<button id="confirm" onClick={confirmUpdateCard} disabled={!cardComplete}>
				<p>Confirm</p>
			</button>
			<br />
			<br />
		</div>
	)
}
