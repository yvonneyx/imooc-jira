import React from 'react';
import { Form, Input } from 'antd';
import { UserSelect } from 'components/user-select';
import { User } from 'types/User';
import { Project } from "types/project";

interface SearchPanelProps {
  users: User[];
  param: Partial<Pick<Project, 'name' | 'personId'>>;
  setParam: (param: SearchPanelProps['param']) => void;
}

export const SearchPanel = ({ setParam, param, users }: SearchPanelProps) => {
  return (
    <Form layout="inline" style={{ marginBottom: '2rem' }}>
      <Form.Item>
        <Input
          placeholder={'项目名'}
          type="text"
          value={param.name}
          onChange={(evt) => setParam({ ...param, name: evt.target.value })}
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          value={param.personId}
          onChange={(value) => setParam({ ...param, personId: value })}
          defaultOptionName={'负责人'}
        />
      </Form.Item>
    </Form>
  );
};
