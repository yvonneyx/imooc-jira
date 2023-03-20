import { SearchPanel } from './search-panel';
import { List } from './list';
import React from 'react';
import { useDebounce, useDocumentTitle } from 'utils';
import styled from '@emotion/styled';
import { Button, Typography } from 'antd';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';
import { useProjectsParam } from './util';
import { Row } from 'components/lib';
import { useDispatch } from 'react-redux';
import { projectListActions } from './project-list.slice';
// ***基本类型或者组建状态，可以放在依赖里；非组件状态的对象，不可以放在依赖里

export const ProjectListScreen = () => {
  const dispatch = useDispatch();
  useDocumentTitle('项目列表', false);

  const [param, setParam] = useProjectsParam();
  const { data: list, isLoading, error, retry } = useProjects(
    useDebounce(param, 200)
  );
  const { data: users } = useUsers();

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={() => dispatch(projectListActions.openProjectModal())}>
          创建项目
        </Button>
      </Row>
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
        refresh={retry}
      ></List>
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;
