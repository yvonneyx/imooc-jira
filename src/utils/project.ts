import { useEffect } from "react";
import { Project } from "screens/project-list/list";
import { cleanObject } from "utils";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

export const useProjects = (param?: Partial<Project>) => {
	const client = useHttp();
	const { run, ...result } = useAsync<Project[]>();
	const fetchProjects = () => client('projects', { data: cleanObject(param || {}) })

	useEffect(() => {
		run(fetchProjects(), { retry: fetchProjects });
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [param]);

	return result
}

export const useEditProject = () => {
	const client = useHttp()
	const { run, ...aysncResult } = useAsync<Project[]>();

	const mutate = (params: Partial<Project>) => {
		return run(client(`projects/${params.id}`, { data: params, method: 'PATCH' }))
	}
	return { mutate, ...aysncResult }
}