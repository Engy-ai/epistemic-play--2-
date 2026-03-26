
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Investigation } from '../types';

interface Props {
  investigations: Investigation[];
  highlightedId: string | null;
  onSelect: (id: string) => void;
}

const Timeline: React.FC<Props> = ({ investigations, highlightedId, onSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    return investigations
      .filter(d => d.publicationDate)
      .map(d => ({
        ...d,
        date: new Date(d.publicationDate)
      }))
      .sort((a, b) => {
        const timeDiff = a.date.getTime() - b.date.getTime();
        if (timeDiff !== 0) return timeDiff;
        return a.outlet.localeCompare(b.outlet);
      });
  }, [investigations]);

  const getShortName = (name: string) => {
    if (name.includes("Washington Post")) return "Washington Post";
    if (name.includes("Forensic Architecture")) return "Forensic Arch";
    if (name.includes("Human Rights Watch")) return "Human Rights Watch"; 
    if (name.includes("BBC")) return "BBC Verify";
    if (name.includes("Bellingcat")) return "Bellingcat";
    return name;
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const timelineWidth = 1800;
    const height = 600; 
    const margin = { top: 40, right: 150, bottom: 80, left: 150 };

    const svg = d3.select(svgRef.current)
      .attr('width', timelineWidth)
      .attr('height', height)
      .style('overflow', 'visible');

    svg.selectAll("*").remove();

    const minDate = d3.min(data, d => d.date) || new Date();
    const maxDate = d3.max(data, d => d.date) || new Date();
    
    const displayMin = new Date(minDate.getTime() - (24 * 60 * 60 * 1000 * 45));
    const displayMax = new Date(maxDate.getTime() + (24 * 60 * 60 * 1000 * 45));

    const x = d3.scaleTime()
      .domain([displayMin, displayMax])
      .range([margin.left, timelineWidth - margin.right]);

    const colorMap = (type: string) => {
      if (type.includes("State")) return "#ef4444";
      if (type.includes("NGO")) return "#10b981";
      if (type.includes("Newsroom")) return "#f59e0b";
      return "#8b5cf6";
    };

    const xAxis = d3.axisBottom(x)
      .ticks(15)
      .tickSize(10)
      .tickFormat(d => d3.timeFormat("%d %b %Y")(d as Date));

    const axisG = svg.append("g")
      .attr("transform", `translate(0, ${height - 60})`)
      .call(xAxis)
      .attr("color", "#27272a");

    axisG.selectAll("text")
      .attr("font-size", "10px")
      .attr("font-weight", "900")
      .attr("dy", "22px")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.08em")
      .style("fill", "#52525b");

    svg.append("rect")
      .attr("x", margin.left)
      .attr("y", height - 63)
      .attr("width", timelineWidth - margin.left - margin.right)
      .attr("height", 6)
      .attr("rx", 0) // EDGY
      .attr("fill", "#18181b")
      .attr("stroke", "#27272a")
      .attr("stroke-width", 1);

    const labelWidth = 300; 
    const horizontalBuffer = 80;
    const levelLastX: number[] = new Array(12).fill(0); 
    
    const labelLevels = data.map((d) => {
      const currentX = x(d.date);
      const startX = currentX - (labelWidth / 2);
      const endX = currentX + (labelWidth / 2);
      
      let level = 0;
      while (level < levelLastX.length) {
        if (startX > levelLastX[level] + horizontalBuffer) { 
          levelLastX[level] = endX;
          return level;
        }
        level++;
      }
      return levelLastX.length - 1; 
    });

    const getLabelY = (level: number) => (height - 105) - (level * 44);

    const points = svg.selectAll(".point")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "point")
      .style("cursor", "pointer")
      .on("click", (e, d) => onSelect(d.id));

    const guideLine = svg.append("line")
      .attr("y1", 20)
      .attr("y2", height - 60)
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0)
      .style("pointer-events", "none");

    svg.on("mousemove", (event) => {
      const [mouseX] = d3.pointer(event);
      if (mouseX >= margin.left && mouseX <= timelineWidth - margin.right) {
        guideLine.attr("x1", mouseX).attr("x2", mouseX).attr("opacity", 0.3);
      } else {
        guideLine.attr("opacity", 0);
      }
    }).on("mouseleave", () => {
      guideLine.attr("opacity", 0);
    });

    points.filter(d => d.id === highlightedId)
      .append("rect") // EDGY GLOW
      .attr("x", d => x(d.date) - 20)
      .attr("y", height - 80)
      .attr("width", 40)
      .attr("height", 40)
      .attr("fill", d => colorMap(d.actorType))
      .attr("opacity", 0.3)
      .attr("class", "glow-pulse");

    points.append("line")
      .attr("x1", d => x(d.date))
      .attr("x2", d => x(d.date))
      .attr("y1", height - 60)
      .attr("y2", (d, i) => getLabelY(labelLevels[i]) + 20)
      .attr("stroke", d => colorMap(d.actorType))
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,2")
      .attr("opacity", 0.3);

    points.append("rect") // EDGY NODE
      .attr("x", d => x(d.date) - (d.id === highlightedId ? 11 : 8))
      // Fix: Wrapping the value in an arrow function to provide 'd' to the callback scope.
      .attr("y", d => (height - 60) - (d.id === highlightedId ? 11 : 8))
      .attr("width", d => d.id === highlightedId ? 22 : 16)
      .attr("height", d => d.id === highlightedId ? 22 : 16)
      .attr("fill", d => d.id === highlightedId ? colorMap(d.actorType) : "#000")
      .attr("stroke", d => colorMap(d.actorType))
      .attr("stroke-width", 3)
      .attr("class", "transition-all duration-500 hover:scale-125");

    const labels = points.append("g")
      .attr("transform", (d, i) => `translate(${x(d.date)}, ${getLabelY(labelLevels[i])})`);

    labels.append("rect")
      .attr("x", -85)
      .attr("y", -30)
      .attr("width", 170)
      .attr("height", 55)
      .attr("rx", 0) // EDGY
      .attr("fill", "#ffffff")
      .attr("opacity", d => d.id === highlightedId ? 0.08 : 0);

    labels.append("text")
      .attr("text-anchor", "middle")
      .attr("fill", d => d.id === highlightedId ? "#ffffff" : "#a1a1aa")
      .attr("font-size", "11px")
      .attr("font-weight", "900")
      .attr("class", "uppercase tracking-tighter transition-colors duration-300")
      .text(d => getShortName(d.outlet));

    labels.append("text")
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("fill", d => d.id === highlightedId ? "#ef4444" : "#52525b")
      .attr("font-size", "9px")
      .attr("font-weight", "800")
      .attr("class", "uppercase tracking-widest")
      .text(d => d3.timeFormat("%d %b %Y")(d.date));

  }, [data, highlightedId, onSelect]);

  return (
    <div ref={scrollRef} className="w-full h-[600px] overflow-x-auto overflow-y-hidden custom-scrollbar bg-black/20 rounded-none border border-zinc-800/50">
      <div className="relative" style={{ width: '1800px' }}>
        <svg ref={svgRef} className="mx-auto" />
      </div>
      <style>{`
        .glow-pulse {
          animation: pulse 3s infinite cubic-bezier(0.4, 0, 0.6, 1);
          transform-origin: center;
          transform-box: fill-box;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(0.7); opacity: 0.1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
        .point:hover rect:first-of-type {
           stroke-width: 5px;
           filter: brightness(1.3);
        }
        .point:hover text:first-of-type {
           fill: white;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 0px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default Timeline;
