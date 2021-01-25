import React, { useState, useEffect } from 'react'
import BackHeader from '../BackHeader'

import DisplayError from '../../../components/DisplayError'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useHistory } from 'react-router-dom'
import { StripeCardElementChangeEvent } from '@stripe/stripe-js'

export default function UpdateCard() {

	const stripe = useStripe()
	const stripeElements = useElements()

	const [cardErr, setCardErr] = useState("")
	const [cardComplete, setCardComplete] = useState(false)

	const history = useHistory()

	const onCardChange = (e: StripeCardElementChangeEvent) => {
		setCardComplete(e.complete)
	}

	const confirmUpdateCard = async () => {
		// await whatever
		history.goBack()
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
