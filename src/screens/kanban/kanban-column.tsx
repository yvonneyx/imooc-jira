import React from 'react';
import { Kanban } from 'types/kanban';
import { useTasks } from 'utils/task';
import { useTaskTypes } from 'utils/task-type';
import {
  useKanbansQueryKey,
  useTasksModal,
  useTasksSearchParams,
} from './util';
import taskIcon from 'assets/task.svg';
import bugIcon from 'assets/bug.svg';
import styled from '@emotion/styled';
import { Button, Card, Dropdown, Menu, Modal } from 'antd';
import { CreateTask } from './create-task';
import { useDebounce } from 'utils';
import { Task } from 'types/task';
import { Mark } from 'components/mark';
import { useDeleteKanban } from 'utils/kanban';
import { Row } from 'components/lib';

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === 'task' ? taskIcon : bugIcon} alt={name} />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const { name: keyword } = useTasksSearchParams();
  return (
    <Card
      style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
      key={task.id}
      onClick={() => startEdit(task.id)}
    >
      <Mark keyword={keyword} name={task.name} />
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(
    useDebounce(useTasksSearchParams(), 2000)
  );
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  return (
    <Container>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} />
      </Row>
      <TasksContainer>
        {tasks?.map((task) => (
          <TaskCard task={task} />
        ))}
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  );
};

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync: deleteKanban } = useDeleteKanban(useKanbansQueryKey());
  const confirmDeleteKanban = () => {
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: '确定删除看板吗?',
      onOk() {
        return deleteKanban(kanban.id);
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button onClick={confirmDeleteKanban} type={'link'}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type={'link'}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
