import { useCallback, useReducer, useState } from "react"
import { useMountedRef } from "utils"

interface State<D> {
	error: Error | null
	data: D | null
	stat: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null> = {
	stat: 'idle',
	data: null,
	error: null
}

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
	const mountedRef = useMountedRef()
	return useCallback(
		(...args: T[]) => { mountedRef.current ? dispatch(...args) : void 0 },
		[dispatch, mountedRef])
}

export const useAsync = <D>(initialState?: State<D>) => {
	const [state, dispatch] = useReducer(
		(state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
		{
			...defaultInitialState,
			...initialState
		} as State<D>)
	const saftDispatch = useSafeDispatch(dispatch)

	const setData = useCallback((data: D) => saftDispatch({
		data,
		stat: 'success',
		error: null
	}), [saftDispatch])

	const setError = useCallback((error: Error) => saftDispatch({
		error,
		stat: 'error',
		data: null
	}), [saftDispatch])

	const [retry, setRetry] = useState(() => () => { })

	const run = useCallback((promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
		if (!promise || !promise.then) {
			throw new Error('请传入 Promise 类型数据')
		}
		saftDispatch({ stat: 'loading' })

		setRetry(() => () => {
			if (runConfig?.retry) {
				run(runConfig?.retry(), runConfig)
			}
		})

		return promise
			.then(data => {
				setData(data)
				return data
			})
			.catch(error => {
				// catch会消化异常，如果不主动抛出，外面是接受不到异常的
				setError(error)
				return Promise.reject(error)
			})
	}, [setData, setError, saftDispatch])

	return {
		isIdle: state.stat === 'idle',
		isLoading: state.stat === 'loading',
		isError: state.stat === 'error',
		isSuccess: state.stat === 'success',
		run,
		setData,
		setError,
		retry,
		...state
	}
}