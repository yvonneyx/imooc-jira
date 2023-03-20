import React from 'react';
import { Drawer } from 'antd';
import { useProjectModal } from './util';

export const ProjectModal = () => {
  const { projectModalOpen, close } = useProjectModal();
  return (
    <Drawer width={'100%'} visible={projectModalOpen} onClose={close}>
      <h1>Project Modal</h1>
    </Drawer>
  );
};
