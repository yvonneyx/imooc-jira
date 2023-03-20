import { useMemo } from "react";
import { useUrlQueryParam } from "utils/url";

export const useProjectsParam = () => {
	const [param, setParam] = useUrlQueryParam(['name', 'personId']);
	const projectsParam = useMemo(() => ({
		...param,
		personId: Number(param.personId) || undefined,
	}), [param])
	return [projectsParam, setParam] as const
}

export const useProjectModal = () => {
	const [{ projectCreate }, setProjectCreate] = useUrlQueryParam(['projectCreate'])

	const open = () => setProjectCreate({ projectCreate: true })
	const close = () => setProjectCreate({ projectCreate: undefined })

	return {
		projectModalOpen: projectCreate === 'true',
		open,
		close
	}
}