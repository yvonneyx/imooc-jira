import { Button, List, Modal } from 'antd';
import { Row, ScreenContainer } from 'components/lib';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectInUrl } from 'screens/kanban/util';
import { Epic } from 'types/epic';
import { useDeleteEpic, useEpics } from 'utils/epic';
import { useTasks } from 'utils/task';
import { CreateEpic } from './create-epic';
import { useEpicsQueryKey, useEpicsSearchParams } from './util';

export const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicsSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deleteEpic } = useDeleteEpic(useEpicsQueryKey());
  const [epicCreateOpen, setEpicCreateOpen] = useState(false);

  const confirmDeleteEpic = (epic: Epic) => {
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: `确定删除任务组[${epic.name}]吗?`,
      onOk() {
        return deleteEpic(epic.id);
      },
    });
  };

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>{currentProject?.name}任务组</h1>
        <Button onClick={() => setEpicCreateOpen(true)} type={'link'}>
          创建任务组
        </Button>
      </Row>

      <List
        dataSource={epics}
        itemLayout={'vertical'}
        style={{ overflow: 'scroll' }}
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button onClick={() => confirmDeleteEpic(epic)} type={'link'}>
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>开始时间：{dayjs(epic.start).format('YYYY-MM-DD')}</div>
                  <div>结束时间：{dayjs(epic.end).format('YYYY-MM-DD')}</div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <div>
                    <Link
                      key={task.id}
                      to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                    >
                      {task.name}
                    </Link>
                  </div>
                ))}
            </div>
          </List.Item>
        )}
      ></List>
      <CreateEpic
        onClose={() => setEpicCreateOpen(false)}
        visible={epicCreateOpen}
      />
    </ScreenContainer>
  );
};
