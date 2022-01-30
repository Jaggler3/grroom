import { useState } from 'react'

import './CleanerTable.scss'
import './PreviewTable.scss'

import { DataSet } from '../core/DataSet'

import React from 'react'
import CleanerTable from './CleanerTable'

interface PreviewTableProps {
	beforeSet: DataSet,
	afterSet: DataSet
}

const getDiff = (beforeSet: DataSet, afterSet: DataSet): [(boolean[] | undefined)[], number[]] => {
	const indices: number[] = []
	const diff = beforeSet.items.map((beforeItem, i) => {
		const compareItem = afterSet.items[i]
		let changed = []
		for (const col of beforeSet.columns) {
			if(!compareItem) {
				changed.push(true)
				continue
			}
			changed.push(beforeItem[col] !== compareItem[col])
		}
		const unchanged = changed.every((col) => col === false)
		if(!unchanged) {
			indices.push(i)
		}
		return unchanged ? undefined : changed
	})
	return [diff, indices]
}

export default function PreviewTable({ beforeSet, afterSet }: PreviewTableProps) {

	const [[, indices]] = useState(getDiff(beforeSet, afterSet))
	const [lookAheadIndex, setLookAheadIndex] = useState(0)

	const [jumpToIndex, setJumpToIndex] = useState(-1)

	/**
	 * jump the table to the currently selected index, and update the desired
	 * "next" index to be the subsequent change
	 */
	const lookAhead = () => {
		// pad the vertical scrolling by 2 rows, 1 for the header, and 1 more for spacing, with a min row of 0
		const rowToSee = Math.max(indices[lookAheadIndex] - 2, 0)
		const rowElement = document.getElementById("prev-" + rowToSee)
		rowElement?.scrollIntoView()

		const newLookAheadIndex = getNextLookAheadIndex()
		setLookAheadIndex(newLookAheadIndex)
		setJumpToIndex(indices[newLookAheadIndex])
	}

	const getBeforeData = (row: number, col: string) => beforeSet.items[row][col]

	/**
	 * @returns the next change for the table to jump to
	 */
	const getNextLookAheadIndex = () => {
		if(lookAheadIndex === indices.length - 1) {
			return 0
		} else {
			return lookAheadIndex + 1
		}
	}

	return (
		<>
			{indices.length === 0 ? (
				<p id="diff-jump">There are no changes to show.</p>
			) : (
				<p id="diff-jump" onClick={lookAhead}>Jump to next change at row #{indices[getNextLookAheadIndex()] + 1}</p>
			)}
			<CleanerTable
				dataSet={afterSet}
				additions={indices}
				jumpToIndex={jumpToIndex}
				getBeforeData={getBeforeData}
			/>
		</>
	)
}
