import { SearchPanel } from './search-panel';
import { List } from './list';
import React from 'react';
import { useDebounce, useDocumentTitle } from 'utils';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';
import { useProjectsParam } from './util';

// ***基本类型或者组建状态，可以放在依赖里；非组件状态的对象，不可以放在依赖里

export const ProjectListScreen = () => {
  useDocumentTitle('项目列表', false);

  const [param, setParam] = useProjectsParam();
  const { data: list, isLoading, error } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

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
