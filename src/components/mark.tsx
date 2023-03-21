import React from 'react';

export const Mark = ({ name, keyword }: { name: string; keyword: string }) => {
  if (!keyword) {
    return <div>{name}</div>;
  }
  const arr = name.split(keyword);
  return (
    <div>
      {arr.map((str, index) => (
        <span key={index}>
          {str}
          {index === arr.length - 1 ? null : (
            <span style={{ color: '#257AFD' }}>{keyword}</span>
          )}
        </span>
      ))}
    </div>
  );
};
