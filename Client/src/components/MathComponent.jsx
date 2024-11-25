import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const MathComponent = ({ expression }) => (
  <BlockMath math={expression} />
);

export default MathComponent;