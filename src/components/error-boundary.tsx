import React from 'react';

// children
// fallbackRender 备用方案

// <{children: ReactNode, fallbackRender: FallbackRender}, any>   <P, S>
// 等价于 <React.PropsWithChildren<{fallbackRender: FallbackRender}>, any>

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = { error: null };

  // 当子组件抛出异常时，这里会接收并调用
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({error});
    }
    return children;
  }
}
