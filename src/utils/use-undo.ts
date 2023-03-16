import { useCallback, useState } from "react"

export const useUndo = <T>(initialPresent: T) => {
	const [state, setState] = useState({
		past: [] as T[],
		present: initialPresent,
		future: [] as T[],
	})
	const canUndo = state.past.length !== 0
	const canRedo = state.future.length !== 0

	const set = useCallback((newPresent: T) => {
		setState(currentState => {
			const { past, present, future } = currentState
			if (present === newPresent) return currentState

			return {
				past: [...past, present],
				present: newPresent,
				future: []
			}
		})
	}, [])

	const reset = useCallback((newPresent: T) => {
		setState({
			past: [],
			present: newPresent,
			future: []
		})
	}, [])

	const undo = useCallback(() => {
		setState(currentState => {
			const { past, present, future } = currentState
			if (past.length === 0) return currentState

			const previous = past[past.length - 1]
			const newPast = past.slice(0, past.length - 1)

			return { past: newPast, present: previous, future: [present, ...future] }
		})
	}, [],)

	const redo = useCallback(() => {
		setState(currentState => {
			const { past, present, future } = currentState
			if (future.length === 0) return currentState

			const next = future[0]
			const newFuture = future.slice(1, future.length)

			return { past: [...past, present], present: next, future: newFuture }
		})
	}, [],)

	return [
		state,
		{ set, reset, undo, redo, canUndo, canRedo }
	] as const
}