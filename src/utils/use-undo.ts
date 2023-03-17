import { useCallback, useReducer, useState } from "react"

const SET = 'SET'
const RESET = 'RESET'
const UNDO = 'UNDO'
const REDO = 'REDO'

type State<T> = {
	past: T[],
	present: T,
	future: T[]
}

type Action<T> = {
	type: typeof UNDO | typeof REDO | typeof SET | typeof RESET
	newPresent?: T
}

const undoReducer = <T>(state: State<T>, action: Action<T>) => {
	const { past, present, future } = state
	const { type, newPresent } = action
	switch (type) {
		case REDO:
			if (future.length === 0) return state
			const next = future[0]
			const newFuture = future.slice(1, future.length)
			return { past: [...past, present], present: next, future: newFuture }

		case UNDO:
			if (past.length === 0) return state
			const previous = past[past.length - 1]
			const newPast = past.slice(0, past.length - 1)
			return { past: newPast, present: previous, future: [present, ...future] }

		case SET:
			if (present === newPresent) return state
			return {
				past: [...past, present],
				present: newPresent,
				future: []
			}

		case RESET:
			return {
				past: [],
				present: newPresent,
				future: []
			}
	}
}

export const useUndo = <T>(initialPresent: T) => {
	const [state, dispatch] = useReducer(undoReducer, {
		past: [],
		present: initialPresent,
		future: []
	} as State<T>)

	const canUndo = state.past.length !== 0
	const canRedo = state.future.length !== 0

	const set = useCallback((newPresent: T) => dispatch({ type: SET, newPresent }), [])
	const reset = useCallback((newPresent: T) => dispatch({ type: RESET, newPresent }), [])
	const undo = useCallback(() => dispatch({ type: UNDO }), [])
	const redo = useCallback(() => dispatch({ type: REDO }), [])

	return [
		state,
		{ set, reset, undo, redo, canUndo, canRedo }
	] as const
}