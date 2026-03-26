
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Investigation } from '../types';

interface Props {
  investigations: Investigation[];
}

const NetworkDiagram: React.FC<Props> = ({ investigations }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 450;

    const nodes = investigations.map(inv => ({
      id: inv.id,
      label: inv.outlet,
      actorType: inv.actorType,
      methods: inv.methodology
    }));

    const links: any[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const shared = nodes[i].methods.filter(m => nodes[j].methods.includes(m));
        if (shared.length > 0) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            sharedCount: shared.length,
            methods: shared
          });
        }
      }
    }

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(200))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "rgba(255, 255, 255, 0.08)")
      .attr("stroke-width", d => Math.sqrt(d.sharedCount) * 1.5);

    const actorColors: { [key: string]: string } = {
      "State actor / intelligence": "#ef4444",
      "NGO / human rights": "#22c55e",
      "Newsroom / media": "#eab308",
      "OSINT / research agency": "#a855f7",
      "Collective / community OSINT": "#a855f7"
    };

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", 14)
      .attr("fill", d => actorColors[d.actorType] || "#3f3f46")
      .attr("stroke", "#000")
      .attr("stroke-width", 3)
      .attr("class", "cursor-pointer transition-all hover:r-16");

    node.append("text")
      .attr("dy", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#a1a1aa")
      .attr("font-size", "10px")
      .attr("font-weight", "800")
      .attr("class", "uppercase tracking-tighter")
      .text(d => d.label.split(' ')[0]);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node.attr("transform", d => `translate(${(d as any).x},${(d as any).y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

  }, [investigations]);

  return (
    <div ref={containerRef} className="w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-inner relative">
      <div className="absolute top-6 right-6 flex flex-col gap-2">
         <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-500 tracking-widest"><div className="w-2 h-2 rounded-full bg-red-500"></div> State</div>
         <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-500 tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> NGO</div>
         <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-500 tracking-widest"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Media</div>
         <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-500 tracking-widest"><div className="w-2 h-2 rounded-full bg-purple-500"></div> OSINT</div>
      </div>
      <svg ref={svgRef} />
    </div>
  );
};

export default NetworkDiagram;
