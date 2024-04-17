import { drag, select } from 'd3';
import { useEffect } from 'react';

const useDrag = (ref, handler) => {
  useEffect(() => {
    const pathSelection = select(ref.current);
    pathSelection.call(drag().on('drag', handler));
  }, []);
};

export default useDrag;
