import { SearchPanel } from './search-panel';
import { List } from './list';
import React from 'react';
import { useDebounce, useDocumentTitle } from 'utils';
import styled from '@emotion/styled';
import { Button, Typography } from 'antd';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';
import { useProjectModal, useProjectsParam } from './util';
import { ErrorBox, Row } from 'components/lib';

// ***基本类型或者组建状态，可以放在依赖里；非组件状态的对象，不可以放在依赖里

export const ProjectListScreen = () => {
  useDocumentTitle('项目列表', false);

  const [param, setParam] = useProjectsParam();
  const { open } = useProjectModal();
  const { data: list, isLoading, error } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={open}>创建项目</Button>
      </Row>
      <SearchPanel
        param={param}
        setParam={setParam}
        users={users || []}
      ></SearchPanel>
      <ErrorBox error={error} />
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
