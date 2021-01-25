import React from 'react'
import { CardElement } from '@stripe/react-stripe-js'

export default function CardInput({ onCardChange }: { onCardChange: (args?: any) => any }) {
	return (
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
	)
}
