import { useEffect, useState } from 'react';
import type { ToolSeoData } from '../data/toolSeoData';
import { loadToolSeoData, readToolSeoData } from '../lib/toolSeoClient';

export function useToolSeoData(id: string): ToolSeoData {
  const [state, setState] = useState(() => ({ id, data: readToolSeoData(id) || {} }));
  useEffect(() => {
    let active = true;
    loadToolSeoData(id).then(data => {
      if (active) setState({ id, data });
    }).catch(() => {
      // The tool and its existing generic/base-data guide remain available.
      if (active) setState({ id, data: {} });
    });
    return () => { active = false; };
  }, [id]);
  // Never show the preceding tool's FAQ during a client-side route change.
  return state.id === id ? state.data : readToolSeoData(id) || {};
}
