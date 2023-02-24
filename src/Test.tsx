import React from 'react';
import styled from 'styled-components';
import { SortableElement } from './SortableElement';
import { SortableContainer } from './SortableContainer';

const Div = styled.div`
  font-family: 'system-ui';
  font-size: 16px;
`;

const Ul = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;
  max-width: 300px;
  flex: 1;
`;

const Li = styled.li`
  border: 1px solid hsl(0, 0%, 30%);
  background-color: hsl(210, 100%, 70%);
  margin: 10px 0;
  padding: 8px 4px;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  font-family: system-ui;
  font-size: 16px;
`;

const DivS = SortableElement(Div);

const UlC = SortableContainer(Ul);
const LiC = SortableElement(Li);

const names = [
  'Liam',
  'Olivia',
  'Noah',
  'Emma',
  'Oliver',
  'Charlotte',
  'Elijah',
  'Amelia',
  'James',
  'Ava',
  'William',
  'Sophia',
  'Benjamin',
  'Isabella',
  'Lucas',
  'Mia',
  'Henry',
  'Evelyn',
  'Theodore',
  'Harper',
];

const Test = () => (
  <Flex>
    <UlC axis="xy" onSortEnd={(p: any) => console.log.bind(console)}>
      {names.map((name) => (
        <LiC key={name}>{name}</LiC>
      ))}
    </UlC>
    <UlC axis="xy" onSortEnd={(p: any) => console.log.bind(console)}>
      {names.map((name) => (
        <LiC key={name}>{name}</LiC>
      ))}
    </UlC>
    <UlC axis="xy" onSortEnd={(p: any) => console.log.bind(console)}>
      {names.map((name) => (
        <LiC key={name}>{name}</LiC>
      ))}
    </UlC>
  </Flex>
);

export default Test;
