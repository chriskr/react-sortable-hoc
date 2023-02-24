import React from 'react';
import styled from 'styled-components';
import { SortableElement } from './SortableElement';

const Div = styled.div`
  font-family: 'system-ui';
  font-size: 30px;
`;

const DivS = SortableElement(Div);

const Test = () => <DivS>hello</DivS>;

export default Test;
