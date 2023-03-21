import React from 'react';
import { User } from 'types/User';
import { Dropdown, Menu, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { TableProps } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import { Pin } from 'components/pin';
import { useDeleteProject, useEditProject } from 'utils/project';
import { ButtonNoPadding } from 'components/lib';
import { useProjectModal, useProjectsQueryKey } from './util';
import { Project } from '../../types/project';

interface ListProps extends TableProps<Project> {
  users: User[];
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  return (
    <Table
      rowKey={'id'}
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={!!project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: '名称',
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: '部门',
          dataIndex: 'organization',
        },
        {
          title: '负责人',
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  '未知'}
              </span>
            );
          },
        },
        {
          title: '创建时间',
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format('YYYY-MM-DD')
                  : '无'}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteItem = (id: number) => {
    Modal.confirm({
      title: '确定删除这个项目吗？',
      content: '点击确定删除',
      okText: '确定',
      onOk() {
        deleteProject(id);
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={'edit'}>
            <ButtonNoPadding
              type={'link'}
              onClick={() => startEdit(project.id)}
            >
              编辑
            </ButtonNoPadding>
          </Menu.Item>
          <Menu.Item key={'delete'}>
            <ButtonNoPadding
              type={'link'}
              onClick={() => confirmDeleteItem(project.id)}
            >
              删除
            </ButtonNoPadding>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={'link'}>...</ButtonNoPadding>
    </Dropdown>
  );
};
