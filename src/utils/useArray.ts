import { useState } from "react"

export const useArray = <T>(initialArray: T[]) => {
	const [value, setValue] = useState(initialArray)

	return {
		value,
		setValue,
		clear: () => setValue([]),
		removeIndex: (index: number) => {
			const copy = [...value];
			copy.splice(index, 1)
			setValue(copy)
		},
		add: (item: T) => setValue([...value, item])
	}

}