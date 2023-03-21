import { useMemo } from "react";
import { useProject } from "utils/project";
import { useSetUrlQueryParams, useUrlQueryParam } from "utils/url";

export const useProjectsParam = () => {
	const [param, setParam] = useUrlQueryParam(['name', 'personId']);
	const projectsParam = useMemo(() => ({
		...param,
		personId: Number(param.personId) || undefined,
	}), [param])
	return [projectsParam, setParam] as const
}

export const useProjectsQueryKey = () => {
	const [projectsParam] = useProjectsParam()
	return ['projects', projectsParam]
}

export const useProjectModal = () => {
	const [{ projectCreate }, setProjectCreate] = useUrlQueryParam(['projectCreate'])
	const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam(['editingProjectId'])
	const { data: editingProject, isLoading } = useProject(Number(editingProjectId))

	const setUrlParams = useSetUrlQueryParams()
	const open = () => setProjectCreate({ projectCreate: true })
	const close = () => setUrlParams({ editingProjectId: '', projectCreate: '' })
	const startEdit = (id: number) => { setEditingProjectId({ editingProjectId: id }) }

	return {
		projectModalOpen: projectCreate === 'true' || Boolean(editingProjectId),
		editingProject,
		open,
		close,
		startEdit,
		isLoading
	}
}