import { Project } from "types/project";
import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from 'react-query';
import { useAddConfig, useDeleteConfig, useEditConfig } from "./use-optimistic-options";

export const useProjects = (param?: Partial<Project>) => {
	const client = useHttp();

	return useQuery<Project[]>(["projects", param], () => client('projects', { data: param }))
}

export const useEditProject = (queryKey: QueryKey) => {
	const client = useHttp()

	return useMutation(
		(params: Partial<Project>) => client(`projects/${params.id}`, {
			data: params,
			method: 'PATCH'
		}), useEditConfig(queryKey))
}

export const useAddProject = (queryKey: QueryKey) => {
	const client = useHttp()
	return useMutation(
		(params: Partial<Project>) => client("projects", {
			data: params,
			method: 'POST'
		}), useAddConfig(queryKey))
}

export const useDeleteProject = (queryKey: QueryKey) => {
	const client = useHttp()
	return useMutation(
		(id: number) => client(`projects/${id}`, {
			method: 'DELETE'
		}), useDeleteConfig(queryKey))
}


export const useProject = (id?: number) => {
	const client = useHttp()
	return useQuery(
		['project', { id }],
		() => client(`projects/${id}`),
		{ enabled: Boolean(id) })
}