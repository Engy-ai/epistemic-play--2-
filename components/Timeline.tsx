
import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
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
  const [containerWidth, setContainerWidth] = useState(1200);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const data = useMemo(() => {
    return investigations
      .filter(d => d.publicationDate)
      .map(d => ({
        ...d,
        date: new Date(d.publicationDate),
      }))
      .sort((a, b) => {
        const timeDiff = a.date.getTime() - b.date.getTime();
        if (timeDiff !== 0) return timeDiff;
        return a.outlet.localeCompare(b.outlet);
      });
  }, [investigations]);

  const getShortName = useCallback((name: string) => {
    if (name.includes('Washington Post')) return 'Washington Post';
    if (name.includes('Forensic Architecture')) return 'Forensic Arch';
    if (name.includes('Human Rights Watch')) return 'Human Rights Watch';
    if (name.includes('BBC')) return 'BBC Verify';
    if (name.includes('Bellingcat')) return 'Bellingcat';
    if (name.includes('Michael Kobs')) return 'Michael Kobs';
    if (name.includes('Maher Arar')) return 'Maher Arar';
    if (name.includes('Earshot')) return 'Earshot';
    if (name.includes('New York Times')) return 'NYT Visual';
    return name;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const updateWidth = () => setContainerWidth(Math.max(el.clientWidth, 640));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const timelineWidth = Math.max(containerWidth, 640);
    const height = Math.min(600, Math.max(360, Math.round(window.innerHeight * 0.38)));
    const margin = { top: 40, right: 150, bottom: 80, left: 150 };

    const svg = d3.select(svgRef.current)
      .attr('width', timelineWidth)
      .attr('height', height)
      .style('overflow', 'visible');

    svg.selectAll('*').remove();

    const minDate = d3.min(data, d => d.date) || new Date();
    const maxDate = d3.max(data, d => d.date) || new Date();
    const displayMin = new Date(minDate.getTime() - 45 * 86400000);
    const displayMax = new Date(maxDate.getTime() + 45 * 86400000);

    const x = d3.scaleTime()
      .domain([displayMin, displayMax])
      .range([margin.left, timelineWidth - margin.right]);

    const colorMap = (type: string) => {
      if (type.includes('State')) return 'var(--accent)';
      if (type.includes('NGO')) return 'var(--stance-palestinian)';
      if (type.includes('Newsroom')) return 'var(--stance-uncertain)';
      if (type.includes('Independent')) return 'var(--paradigm-hybrid)';
      return 'var(--text-muted)';
    };

    const axisG = svg.append('g')
      .attr('transform', `translate(0, ${height - 60})`)
      .call(
        d3.axisBottom(x)
          .ticks(15)
          .tickSize(10)
          .tickFormat(d => d3.timeFormat('%d %b %Y')(d as Date))
      )
      .attr('color', 'var(--border)');

    axisG.selectAll('text')
      .attr('font-size', '10px')
      .attr('font-weight', '900')
      .attr('dy', '22px')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.08em')
      .style('fill', 'var(--text-dim)');

    svg.append('rect')
      .attr('x', margin.left)
      .attr('y', height - 63)
      .attr('width', timelineWidth - margin.left - margin.right)
      .attr('height', 6)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', 'var(--bg-elevated)')
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1);

    const labelWidth = 300;
    const horizontalBuffer = 80;
    const levelLastX: number[] = new Array(12).fill(0);

    const labelLevels = data.map((d) => {
      const currentX = x(d.date);
      const startX = currentX - labelWidth / 2;
      const endX = currentX + labelWidth / 2;
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

    const getLabelY = (level: number) => height - 105 - level * 44;

    const guideLine = svg.append('line')
      .attr('class', 'timeline-guide')
      .attr('y1', 20)
      .attr('y2', height - 60)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0)
      .style('pointer-events', 'none');

    const setHover = (point: d3.Selection<SVGGElement, typeof data[0], SVGGElement, unknown>, active: boolean) => {
      const isSelected = (d: typeof data[0]) => d.id === highlightedId;
      point.select('.timeline-node')
        .attr('stroke-width', (d) => (active || isSelected(d)) ? 4 : 3)
        .attr('fill', (d) => (active || isSelected(d)) ? colorMap(d.actorType) : 'var(--bg-panel)');
      point.select('.timeline-label-bg')
        .attr('opacity', (d) => (active || isSelected(d)) ? 0.1 : 0);
      point.select('.timeline-label-name')
        .attr('fill', (d) => (active || isSelected(d)) ? 'var(--text)' : 'var(--text-muted)');
      point.select('.timeline-label-date')
        .attr('fill', (d) => (active || isSelected(d)) ? 'var(--accent)' : 'var(--text-dim)');
      point.select('.timeline-stem')
        .attr('opacity', (d) => (active || isSelected(d)) ? 0.6 : 0.3);
    };

    const clearAllHover = () => {
      svg.selectAll<SVGGElement, typeof data[0]>('.point').each(function () {
        setHover(d3.select(this), false);
      });
    };

    const points = svg.selectAll('.point')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'point')
      .style('cursor', 'pointer')
      .on('click', (_, d) => onSelectRef.current(d.id))
      .on('mouseenter', function (_, d) {
        clearAllHover();
        setHover(d3.select(this), true);
        const cx = x(d.date);
        guideLine.attr('x1', cx).attr('x2', cx).attr('opacity', 0.35);
      })
      .on('mouseleave', function () {
        setHover(d3.select(this), false);
        guideLine.attr('opacity', 0);
      });

    points.each(function (d, i) {
      const g = d3.select(this);
      const cx = x(d.date);
      const level = labelLevels[i];
      const labelY = getLabelY(level);
      const selected = d.id === highlightedId;
      const color = colorMap(d.actorType);
      const nodeSize = selected ? 22 : 16;
      const nodeOffset = nodeSize / 2;

      if (selected) {
        g.append('rect')
          .attr('class', 'timeline-glow')
          .attr('x', cx - 20)
          .attr('y', height - 80)
          .attr('width', 40)
          .attr('height', 40)
          .attr('rx', 20)
          .attr('ry', 20)
          .attr('fill', color)
          .attr('opacity', 0.25)
          .style('pointer-events', 'none');
      }

      g.append('line')
        .attr('class', 'timeline-stem')
        .attr('x1', cx)
        .attr('x2', cx)
        .attr('y1', height - 60)
        .attr('y2', labelY + 20)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,2')
        .attr('opacity', selected ? 0.6 : 0.3)
        .style('pointer-events', 'none');

      g.append('rect')
        .attr('class', 'timeline-hit')
        .attr('x', cx - 24)
        .attr('y', height - 84)
        .attr('width', 48)
        .attr('height', 48)
        .attr('fill', 'transparent');

      g.append('rect')
        .attr('class', 'timeline-node')
        .attr('x', cx - nodeOffset)
        .attr('y', height - 60 - nodeOffset)
        .attr('width', nodeSize)
        .attr('height', nodeSize)
        .attr('rx', nodeOffset)
        .attr('ry', nodeOffset)
        .attr('fill', selected ? color : 'var(--bg-panel)')
        .attr('stroke', color)
        .attr('stroke-width', selected ? 4 : 3)
        .style('pointer-events', 'none');

      const labels = g.append('g')
        .attr('class', 'timeline-label')
        .attr('transform', `translate(${cx}, ${labelY})`)
        .style('pointer-events', 'none');

      labels.append('rect')
        .attr('class', 'timeline-label-bg')
        .attr('x', -85)
        .attr('y', -30)
        .attr('width', 170)
        .attr('height', 55)
        .attr('rx', 12)
        .attr('ry', 12)
        .attr('fill', 'var(--accent)')
        .attr('opacity', selected ? 0.1 : 0);

      labels.append('text')
        .attr('class', 'timeline-label-name')
        .attr('text-anchor', 'middle')
        .attr('fill', selected ? 'var(--text)' : 'var(--text-muted)')
        .attr('font-size', '11px')
        .attr('font-weight', '900')
        .text(getShortName(d.outlet));

      labels.append('text')
        .attr('class', 'timeline-label-date')
        .attr('y', 18)
        .attr('text-anchor', 'middle')
        .attr('fill', selected ? 'var(--accent)' : 'var(--text-dim)')
        .attr('font-size', '9px')
        .attr('font-weight', '800')
        .text(d3.timeFormat('%d %b %Y')(d.date));
    });

    const track = svg.append('rect')
      .attr('class', 'timeline-track')
      .attr('x', margin.left)
      .attr('y', 0)
      .attr('width', timelineWidth - margin.left - margin.right)
      .attr('height', height)
      .attr('fill', 'transparent')
      .lower();

    track.on('mousemove', (event) => {
      const [mouseX] = d3.pointer(event);
      if (mouseX >= margin.left && mouseX <= timelineWidth - margin.right) {
        guideLine.attr('x1', mouseX).attr('x2', mouseX).attr('opacity', 0.15);
      }
    }).on('mouseleave', () => {
      guideLine.attr('opacity', 0);
    });

  }, [data, highlightedId, containerWidth, getShortName]);

  return (
    <div
      ref={scrollRef}
      className="w-full max-w-full h-[600px] overflow-x-auto overflow-y-hidden custom-scrollbar bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl flex items-end"
    >
      <div className="relative pb-8" style={{ width: `${Math.max(containerWidth, 600)}px`, maxWidth: 'none' }}>
        <svg ref={svgRef} className="block" />
      </div>
    </div>
  );
};

export default Timeline;
