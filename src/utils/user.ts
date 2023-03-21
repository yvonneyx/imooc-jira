import { User } from "types/User";
import { useMount } from "utils";
import { useHttp } from "./http";
import { useAsync } from "./use-async";

export const useUsers = () => {
	const client = useHttp();
	const { run, ...result } = useAsync<User[]>();

	useMount(() => {
		run(client('users'))
	});

	return result
}