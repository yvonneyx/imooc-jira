import { useCallback, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useProject } from "utils/project"
import { useTask } from "utils/task"
import { useUrlQueryParam } from 'utils/url'

export const useProjectIdInUrl = () => {
	const { pathname } = useLocation()
	const id = pathname.match(/projects\/(\d+)/)?.[1]
	return Number(id)
}

export const useProjectInUrl = () => useProject(useProjectIdInUrl())

export const useKanbansSearchParams = () => ({ projectId: useProjectIdInUrl() })

export const useKanbansQueryKey = () => ['kanbans', useKanbansSearchParams()]

export const useTasksSearchParams = () => {
	const [params,] = useUrlQueryParam([
		'name',
		'typeId',
		'processorId',
		'tagId'
	])
	const projectId = useProjectIdInUrl()
	return useMemo(() => ({
		projectId,
		name: params.name,
		typeId: Number(params.typeId) || undefined,
		processorId: Number(params.processorId) || undefined,
		tagId: Number(params.tagId) || undefined
	}), [projectId, params])
}

export const useTasksQueryKey = () => ['tasks', useTasksSearchParams()]

export const useTasksModal = () => {
	const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam(['editingTaskId'])
	const { data: editingTask, isLoading } = useTask(Number(editingTaskId))
	const startEdit = useCallback((id: number) => setEditingTaskId({ editingTaskId: id }), [setEditingTaskId],)
	const close = useCallback(() => setEditingTaskId({ editingTaskId: '' }), [setEditingTaskId])
	return {
		editingTaskId,
		editingTask,
		startEdit,
		close,
		isLoading
	}
}