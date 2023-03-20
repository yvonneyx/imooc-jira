import React from 'react';
import { Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { projectListActions } from './project-list.slice';
import { selectProjectModalOpen } from 'store';

export const ProjectModal = () => {
  const dispatch = useDispatch();
  const projectModalOpen = useSelector(selectProjectModalOpen);
  return (
    <Drawer
      width={'100%'}
      visible={projectModalOpen}
      onClose={() => dispatch(projectListActions.closeProjectModal())}
    >
      <h1>Project Modal</h1>
    </Drawer>
  );
};
