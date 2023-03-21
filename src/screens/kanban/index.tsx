import styled from '@emotion/styled';
import { ScreenContainer } from 'components/lib';
import React from 'react';
import { useDocumentTitle } from 'utils';
import { useKanbans } from 'utils/kanban';
import { KanbanColumn } from './kanban-column';
import { SearchPanel } from './search-panel';
import { useKanbansSearchParams, useProjectInUrl } from './util';

export const KanbanScreen = () => {
  useDocumentTitle('看板列表');

  const { data: kanbans } = useKanbans(useKanbansSearchParams());
  const { data: currentProject } = useProjectInUrl();

  return (
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      <ColumnsContainer>
        {kanbans?.map((kanban) => (
          <KanbanColumn kanban={kanban} key={kanban.id} />
        ))}
      </ColumnsContainer>
    </ScreenContainer>
  );
};

const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  margin-right: 2rem;
  flex: 1;
`;
