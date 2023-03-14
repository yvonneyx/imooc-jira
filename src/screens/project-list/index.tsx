import { SearchPanel } from './search-panel';
import { List } from './list';
import React, { useState } from 'react';
import { useDebounce, useDocumentTitle } from 'utils';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';
import { useUrlQueryParam } from 'utils/url';

export const ProjectListScreen = () => {
  // ***基本类型或者组建状态，可以放在依赖里；非组件状态的对象，不可以放在依赖里
  const [param, setParam] = useUrlQueryParam(['name', 'personId']);
  const debounceParam = useDebounce(param, 200);
  const { data: list, isLoading, error } = useProjects(debounceParam);
  const { data: users } = useUsers();
  useDocumentTitle('项目列表', false);

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel
        param={param}
        setParam={setParam}
        users={users || []}
      ></SearchPanel>
      {error ? (
        <Typography.Text type={'danger'}>{error.message}</Typography.Text>
      ) : null}
      <List
        dataSource={list || []}
        users={users || []}
        loading={isLoading}
      ></List>
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
