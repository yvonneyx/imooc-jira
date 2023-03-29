import styled from '@emotion/styled';
import { Button, Drawer, Form, Input, Spin } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useForm } from 'antd/lib/form/Form';
import { ErrorBox } from 'components/lib';
import React, { useEffect } from 'react';
import { useProjectIdInUrl } from 'screens/kanban/util';
import { useAddEpic } from 'utils/epic';
import { useEpicsQueryKey } from './util';

export const CreateEpic = (
  props: Pick<DrawerProps, 'visible'> & { onClose: () => void }
) => {
  const { mutate: addEpic, isLoading: mutateLoading, error } = useAddEpic(
    useEpicsQueryKey()
  );
  const [form] = useForm();
  const projectId = useProjectIdInUrl();

  const onFinish = async (values: any) => {
    await addEpic({ ...values, projectId: projectId });
    props.onClose();
  };

  useEffect(() => {
    form.resetFields();
  }, [form, props]);

  return (
    <Drawer
      visible={props.visible}
      onClose={props.onClose}
      forceRender={true}
      destroyOnClose={true}
      width={'100%'}
    >
      <Container>
        <h1>创建任务组</h1>
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
            rules={[{ required: true, message: '请输入任务组名称' }]}
          >
            <Input placeholder="请输入任务组名称" />
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
