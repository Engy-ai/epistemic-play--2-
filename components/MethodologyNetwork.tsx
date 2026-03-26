
import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Maximize, MousePointer2 } from 'lucide-react';
import { Investigation } from '../types';

interface Props {
  mini?: boolean;
  investigations: Investigation[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
}

// Add explicit x and y properties to Node interface to avoid D3 type compatibility issues
interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'outlet' | 'method';
  color?: string;
  invId?: string;
  x?: number;
  y?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

const MethodologyNetwork: React.FC<Props> = ({ mini = false, investigations, onSelect, selectedId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomTransform, setZoomTransform] = useState<string>('');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Generate dynamic graph data
  const { nodes, links } = useMemo(() => {
    const outletNodes: Node[] = investigations.map(inv => ({
      id: inv.id,
      label: inv.outlet,
      type: 'outlet',
      color: inv.actorType.includes('State') ? '#ef4444' : 
             inv.actorType.includes('NGO') ? '#10b981' : 
             inv.actorType.includes('Newsroom') ? '#f59e0b' : '#8b5cf6',
      invId: inv.id
    }));

    // Fix: Explicitly cast allMethods to string[] to ensure 'm' is correctly typed as string in the map function
    const allMethods = Array.from(new Set(investigations.flatMap(inv => inv.methodology))) as string[];
    const methodNodes: Node[] = allMethods.map(m => ({
      id: `method-${m}`,
      label: m,
      type: 'method',
      color: '#52525b'
    }));

    const edges: Link[] = [];
    investigations.forEach(inv => {
      inv.methodology.forEach(m => {
        edges.push({
          source: inv.id,
          target: `method-${m}`
        });
      });
    });

    return { nodes: [...outletNodes, ...methodNodes], links: edges };
  }, [investigations]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 450;
    const svg = d3.select(svgRef.current);
    
    // Zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => setZoomTransform(event.transform.toString()));

    svg.call(zoomBehavior);

    // Simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    simulation.on('tick', () => {
      // Re-render handled by React state/memo, but we need to update simulation
      // Actually, for React performance with D3, we'll let simulation run 
      // and just use the updated positions in the render phase
      setZoomTransform(curr => curr); // Force trigger re-render if needed
    });

    return () => {
      simulation.stop();
      svg.on('.zoom', null);
    };
  }, [nodes, links]);

  const handleReset = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().call(d3.zoom().transform as any, d3.zoomIdentity);
  };

  return (
    <div className={`bg-zinc-950 border border-zinc-800 overflow-hidden relative shadow-2xl h-full flex flex-col group/network ${mini ? 'p-3' : 'p-6'}`}>
      {!mini && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 z-10">
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-500 tracking-widest">
              <div className="w-2 h-2 bg-red-500"></div> State
            </div>
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-500 tracking-widest">
              <div className="w-2 h-2 bg-emerald-500"></div> NGO
            </div>
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-500 tracking-widest">
              <div className="w-2 h-2 bg-amber-500"></div> Media
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/40 p-1 border border-zinc-800">
             <button onClick={handleReset} className="p-2 text-zinc-500 hover:text-white transition-colors" title="Reset View"><Maximize size={14} /></button>
          </div>
        </div>
      )}

      {!mini && (
        <div className="absolute top-24 left-10 flex items-center gap-2 opacity-30 group-hover/network:opacity-80 transition-opacity pointer-events-none z-10">
           <MousePointer2 size={12} className="text-zinc-500" />
           <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Dynamic Methodology Graph</span>
        </div>
      )}

      <div className="flex-1 w-full relative cursor-move">
        <svg ref={svgRef} viewBox="0 0 800 450" className="w-full h-full">
          <g transform={zoomTransform}>
            {/* Links */}
            {links.map((link, i) => {
              // Fix: Cast source and target to Node for coordinate access (x, y)
              const source = link.source as Node;
              const target = link.target as Node;
              const isHighlighted = (source.id === selectedId || target.id === selectedId) ||
                                   (source.id === hoveredNode || target.id === hoveredNode);
              return (
                <line
                  key={i}
                  x1={source.x || 0} y1={source.y || 0}
                  x2={target.x || 0} y2={target.y || 0}
                  stroke={isHighlighted ? '#ef4444' : '#27272a'}
                  strokeWidth={isHighlighted ? 1.5 : 0.5}
                  opacity={isHighlighted ? 0.6 : 0.2}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isActive = node.id === selectedId || node.id === hoveredNode;
              const isOutlet = node.type === 'outlet';
              
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x || 0},${node.y || 0})`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => node.invId && onSelect(node.invId)}
                  className="cursor-pointer group/node"
                >
                  <rect
                    x={isOutlet ? -15 : -4}
                    y={isOutlet ? -15 : -4}
                    width={isOutlet ? 30 : 8}
                    height={isOutlet ? 30 : 8}
                    fill={isOutlet ? '#000' : node.color}
                    stroke={isOutlet ? node.color : 'none'}
                    strokeWidth={isActive ? 3 : 1.5}
                    className="transition-all duration-300"
                  />
                  {!mini && (
                    <text
                      y={isOutlet ? 25 : 12}
                      textAnchor="middle"
                      fill={isActive ? '#fff' : '#52525b'}
                      fontSize={isOutlet ? "10" : "7"}
                      fontWeight="900"
                      className="uppercase tracking-tighter select-none pointer-events-none"
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MethodologyNetwork;
