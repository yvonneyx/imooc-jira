import { SearchPanel } from './search-panel';
import { List } from './list';
import React, { useState, useEffect } from 'react';
import { cleanObject, useMount, useDebounce } from 'utils';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';

export const ProjectListScreen = () => {
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
    client('projects', { data: cleanObject(param) }).then(setList);
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
      <List list={list} users={users}></List>
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
