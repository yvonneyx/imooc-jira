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