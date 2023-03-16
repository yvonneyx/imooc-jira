import { useCallback, useState } from "react"
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

export const useAsync = <D>(initialState?: State<D>) => {
	const [state, setState] = useState<State<D>>({
		...defaultInitialState,
		...initialState
	})
	const mountedRef = useMountedRef()

	const setData = useCallback((data: D) => setState({
		data,
		stat: 'success',
		error: null
	}), [])

	const setError = useCallback((error: Error) => setState({
		error,
		stat: 'error',
		data: null
	}), [])

	const [retry, setRetry] = useState(() => () => { })

	const run = useCallback((promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
		if (!promise || !promise.then) {
			throw new Error('请传入 Promise 类型数据')
		}
		setState(prevState => ({ ...prevState, stat: 'loading' }))

		setRetry(() => () => {
			if (runConfig?.retry) {
				run(runConfig?.retry(), runConfig)
			}
		})

		return promise
			.then(data => {
				if (mountedRef.current)
					setData(data)
				return data
			})
			.catch(error => {
				// catch会消化异常，如果不主动抛出，外面是接受不到异常的
				setError(error)
				return Promise.reject(error)
			})
	}, [mountedRef, setData, setError])

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