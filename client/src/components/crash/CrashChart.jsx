import { useEffect, useRef } from 'react';
import { GROWTH } from '../../config/game';
import { useGame } from '../../store/GameProvider';

function curve(seconds) {
  return Math.max(1, Math.exp(GROWTH * seconds));
}

export default function CrashChart() {
  const { liveRef, connected } = useGame();
  const lineRef = useRef(null);
  const fillRef = useRef(null);
  const dotRef = useRef(null);
  const multRef = useRef(null);
  const subRef = useRef(null);
  const yRefs = useRef([]);
  const xRefs = useRef([]);

  useEffect(() => {
    let frameId;
    const loop = () => {
      const live = liveRef.current;
      const now = Date.now() + (live.skew || 0);
      let elapsed = 0;
      let multiplier = 1;
      let flat = false;
      if (live.phase === 'running' && live.startedAt) {
        elapsed = Math.max(0, (now - live.startedAt) / 1000);
        multiplier = curve(elapsed);
      } else if (live.phase === 'crashed' && live.crashPoint) {
        multiplier = live.crashPoint;
        elapsed = Math.log(Math.max(multiplier, 1.0001)) / GROWTH;
      } else {
        flat = true;
        elapsed = 1.4;
        multiplier = 1;
      }

      const maxX = Math.max(8, elapsed * 1.12);
      const maxY = Math.max(1.8, (flat ? 1.8 : multiplier) * 1.35);
      const padL = 46;
      const padR = 18;
      const padT = 20;
      const padB = 34;
      const width = 640;
      const height = 320;
      const innerW = width - padL - padR;
      const innerH = height - padT - padB;
      const xOf = (time) => padL + (time / maxX) * innerW;
      const yOf = (value) => padT + (1 - (value - 1) / (maxY - 1)) * innerH;
      const steps = Math.max(20, Math.floor(elapsed * 18));
      let path = '';
      let last = [xOf(0), yOf(1)];
      for (let index = 0; index <= steps; index += 1) {
        const time = (elapsed * index) / steps;
        const value = flat ? 1 : curve(time);
        const x = xOf(time);
        const y = yOf(value);
        path += index === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        last = [x, y];
      }
      const color = live.phase === 'crashed' ? '#ff5d5d' : multiplier >= 2 ? '#24ee89' : '#ffb020';
      const floor = padT + innerH;
      lineRef.current?.setAttribute('d', path);
      lineRef.current?.setAttribute('stroke', color);
      fillRef.current?.setAttribute('d', `${path} L ${last[0].toFixed(1)} ${floor} L ${xOf(0).toFixed(1)} ${floor} Z`);
      fillRef.current?.setAttribute('fill', color);
      dotRef.current?.setAttribute('cx', String(last[0]));
      dotRef.current?.setAttribute('cy', String(last[1]));
      dotRef.current?.setAttribute('fill', color);
      if (multRef.current) {
        multRef.current.textContent = `${(flat ? 1 : multiplier).toFixed(2)}×`;
        multRef.current.style.color = color;
      }
      if (subRef.current) {
        if (live.phase === 'waiting') {
          const left = Math.max(0, (live.waitEndsAt - now) / 1000);
          subRef.current.textContent = `Starting in ${left.toFixed(1)}s`;
        } else if (live.phase === 'crashed') subRef.current.textContent = 'Crashed';
        else subRef.current.textContent = '';
      }
      for (let index = 0; index < 4; index += 1) {
        const value = 1 + ((maxY - 1) * (3 - index)) / 3;
        const yLabel = yRefs.current[index];
        if (yLabel) {
          yLabel.textContent = `${value.toFixed(1)}×`;
          yLabel.setAttribute('y', String(yOf(value) + 4));
        }
        const time = (maxX * index) / 3;
        const xLabel = xRefs.current[index];
        if (xLabel) {
          xLabel.textContent = `${Math.round(time)}s`;
          xLabel.setAttribute('x', String(xOf(time)));
        }
      }
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [liveRef]);

  return (
    <div className="chart-stage">
      <svg viewBox="0 0 640 320" className="chart-svg" role="img" aria-label="Crash multiplier chart">
        <path ref={fillRef} opacity="0.16" />
        <path ref={lineRef} fill="none" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <circle ref={dotRef} r="6" />
        {[0, 1, 2, 3].map((index) => (
          <text key={`y-${index}`} ref={(node) => { yRefs.current[index] = node; }} x="6" fill="#849194" fontSize="12" />
        ))}
        {[0, 1, 2, 3].map((index) => (
          <text key={`x-${index}`} ref={(node) => { xRefs.current[index] = node; }} y="310" fill="#849194" fontSize="12" textAnchor="middle" />
        ))}
      </svg>
      <div className="chart-readout">
        <strong ref={multRef}>1.00×</strong>
        <span ref={subRef} />
      </div>
      <div className={`netstat ${connected ? 'ok' : ''}`}>
        <span>Network Status</span>
        <i /><i /><i /><i />
      </div>
    </div>
  );
}
