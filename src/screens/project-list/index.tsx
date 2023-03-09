import { SearchPanel } from './search-panel';
import { List } from './list';
import React, { useState, useEffect } from 'react';
import { cleanObject, useMount, useDebounce } from 'utils';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';
import { Typography } from 'antd';

export const ProjectListScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [param, setParam] = useState({
    name: '',
    personId: '',
  });
  const debounceParam = useDebounce(param, 200);
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const client = useHttp();

  useMount(() => {
    client('users').then(setUsers);
  });

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    client('projects', { data: cleanObject(param) })
      .then(setList)
      .catch((error) => {
        setList([]);
        setError(error);
      })
      .finally(() => setIsLoading(false));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceParam]);

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel
        param={param}
        setParam={setParam}
        users={users}
      ></SearchPanel>
      {error ? (
        <Typography.Text type={'danger'}>{error.message}</Typography.Text>
      ) : null}
      <List dataSource={list} users={users} loading={isLoading}></List>
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
