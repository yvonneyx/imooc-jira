import React, { ReactNode, useCallback } from 'react';
import * as auth from 'auth-provider';
import { User } from 'screens/project-list/search-panel';
import { http } from 'utils/http';
import { useMount } from 'utils';
import { useAsync } from 'utils/use-async';
import { FullPageErrorFallback, FullPageLoading } from 'components/lib';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthStore from 'store/auth.slice';

export interface AuthForm {
  username: string;
  password: string;
}

export const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http('me', { token });
    user = data.user;
  }
  return user;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();
  const { run, isIdle, isLoading, isError, error } = useAsync<User | null>();

  useMount(() => {
    run(dispatch(AuthStore.bootstrap()));
  });

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return <div>{children}</div>;
};

export const useAuth = () => {
  const user = useSelector(AuthStore.selectUser);
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();
  const login = useCallback(
    (form: AuthForm) => dispatch(AuthStore.login(form)),
    [dispatch]
  );
  const register = useCallback(
    (form: AuthForm) => dispatch(AuthStore.register(form)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(AuthStore.logout()), [dispatch]);
  return { user, login, register, logout };
};
