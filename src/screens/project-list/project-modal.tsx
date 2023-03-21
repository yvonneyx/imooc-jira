import React, { useEffect } from 'react';
import { Button, Drawer, Form, Input, Spin } from 'antd';
import { useProjectModal, useProjectsQueryKey } from './util';
import { UserSelect } from 'components/user-select';
import { useAddProject, useEditProject } from 'utils/project';
import { useForm } from 'antd/lib/form/Form';
import { ErrorBox } from 'components/lib';
import styled from '@emotion/styled';

export const ProjectModal = () => {
  const {
    projectModalOpen,
    close,
    editingProject,
    isLoading,
  } = useProjectModal();

  const useMutateProject = editingProject ? useEditProject : useAddProject;
  const { mutateAsync, isLoading: mutateLoading, error } = useMutateProject(
    useProjectsQueryKey()
  );

  const [form] = useForm();
  const onFinish = (values: any) => {
    mutateAsync({ ...editingProject, ...values }).then(closeModal);
  };

  const closeModal = () => {
    form.resetFields();
    close();
  };

  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  const title = editingProject ? '编辑项目' : '新增项目';

  return (
    <Drawer
      forceRender={true}
      width={'100%'}
      visible={projectModalOpen}
      onClose={closeModal}
    >
      <Container>
        {isLoading ? (
          <Spin />
        ) : (
          <div>
            <h1>{title}</h1>
            <ErrorBox error={error} />
            <Form
              form={form}
              layout={'vertical'}
              onFinish={onFinish}
              style={{ width: '40rem' }}
            >
              <Form.Item
                label={'名称'}
                name={'name'}
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
              <Form.Item
                label={'部门'}
                name={'organization'}
                rules={[{ required: true, message: '请输入部门名' }]}
              >
                <Input placeholder="请输入部门名" />
              </Form.Item>
              <Form.Item label={'负责人'} name={'personId'}>
                <UserSelect defaultOptionName={'负责人'} />
              </Form.Item>
              <Form.Item style={{ textAlign: 'right' }}>
                <Button
                  loading={mutateLoading}
                  type={'primary'}
                  htmlType={'submit'}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
