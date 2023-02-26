import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SortableElement } from './SortableElement';
import { SortableContainer } from './SortableContainer';

const Div = styled.div`
  font-family: 'system-ui';
  font-size: 16px;
`;

const Ul = styled.ul<{ ref: React.RefObject<HTMLElement> }>`
  list-style: none;
  padding: 10px;
  margin: 0;
  max-width: 300px;
  flex: 1;
  background-color: hsl(0, 0%, 80%);
`;

const GhostContainer = styled(Ul)`
  position: absolute;
  left: -1000px;
  top: -1000px;
  padding: 0;
  margin: 0;
  font-family: system-ui;
  font-size: 16px;
`;

const Li = styled.li`
  border: 1px solid hsl(0, 0%, 30%);
  background-color: hsl(210, 100%, 70%);
  margin: 10px 0;
  padding: 8px 4px;
  cursor: pointer;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  font-family: system-ui;
  font-size: 16px;
  overflow: hidden;
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

const getNames = (n: number) => {
  const list = [];
  while (list.length < n) {
    list.push(names[(Math.random() * names.length) | 0]);
  }
  return list;
};

const Test = () => {
  const [names, setState] = useState<string[]>(getNames(12));

  useEffect(() => {
    const interval = window.setInterval(() => setState(getNames(12)), 1000);
    return () => window.clearInterval(interval);
  }, [setState]);

  const ref = useRef<any>(null);
  const getGhostContainer = useCallback(
    () => ref.current ?? document.body,
    [ref]
  );
  return (
    <>
      <GhostContainer ref={ref} />

      <Flex>
        <UlC
          axis="xy"
          onSortEnd={(p: any) => console.log.bind(console)}
          helperContainer={getGhostContainer}
        >
          {names.map((name, index) => (
            <LiC key={`${index}`}>{name}</LiC>
          ))}
        </UlC>
        <UlC
          axis="xy"
          onSortEnd={(p: any) => console.log.bind(console)}
          helperContainer={getGhostContainer}
        >
          {names.map((name, index) => (
            <LiC key={`${index}`}>{name}</LiC>
          ))}
        </UlC>
        <UlC
          axis="xy"
          onSortEnd={(p: any) => console.log.bind(console)}
          helperContainer={getGhostContainer}
        >
          {names.map((name, index) => (
            <LiC key={`${index}`}>{name}</LiC>
          ))}
        </UlC>
      </Flex>
    </>
  );
};

export default Test;
