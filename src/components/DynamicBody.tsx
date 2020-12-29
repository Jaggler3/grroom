import React, { ReactNode, useState, useCallback, CSSProperties, useEffect } from 'react'
import { DataItem } from '../core/DataSet'

import './DynamicBody.scss'

interface DynamicBodyProps {
	data: Array<DataItem>,
	renderer: (item: DataItem, index: number) => ReactNode,
	initialAmount?: number,
	incrementAmount?: number
}

export const DEFAULT_INCREMENT_AMT = 64

export default function DynamicBody({ data, renderer, initialAmount, incrementAmount }: DynamicBodyProps) {

	const getMinCount = useCallback(
		() => initialAmount || incrementAmount || Math.min(data.length, DEFAULT_INCREMENT_AMT),
		[incrementAmount, initialAmount, data.length]
	)
	
	const [count, setCount] = useState(getMinCount())

	const load = useCallback(() => {
		setCount((_count) => Math.min(_count + (incrementAmount || DEFAULT_INCREMENT_AMT), data.length))
	}, [incrementAmount, data.length])

	useEffect(() => {
		setCount(count === 0 ? getMinCount() : count)
	}, [data.length, count, getMinCount])

	return (
		<tbody className="dynamic">
			{data.slice(0, count).map(renderer)}
			{count < data.length && (
				<>
				<tr><td></td></tr>
				<tr>
					<td className="load-container">
						<button className="load" onClick={load}>
							<p>LOAD MORE</p>
						</button>
					</td>
				</tr>
				<tr><td></td></tr>
				<tr><td></td></tr>
				</>
			)}
		</tbody>
	)
}