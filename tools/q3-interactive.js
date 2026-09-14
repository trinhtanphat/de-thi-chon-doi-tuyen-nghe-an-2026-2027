import {circumcenter,orthocenter,lineIntersection,projectPointToLine,midpoint,distance,distancePointToLine,sub,normalizedDotResidual} from './geometry-core.js';

const BASE={A:{x:-20,y:-190},B:{x:-240,y:150},C:{x:210,y:150}};
const LABEL={A:[10,-12],B:[-24,22],C:[10,22],O:[10,-12],H:[10,-10],P:[-28,-10],Q:[10,-10],R:[8,-10],Y:[-30,18],Z:[10,-10],S:[10,20],X:[10,-12],M:[10,-12]};
const must=(p,name)=>{if(!p)throw new Error(`Degenerate Q3 construction at ${name}`);return p};
const fmt=x=>Number(x).toExponential(2);
const line=(a,b,cls='')=>`<line class="${cls}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
const point=(p,name)=>{const [dx,dy]=LABEL[name]||[8,-8];return `<circle class="point" data-point="${name}" cx="${p.x}" cy="${p.y}" r="5"/><text x="${p.x+dx}" y="${p.y+dy}">${name}</text>`};

export function computeQ3Model({side='right',distance:outside=150}={}){
  const {A,B,C}=BASE,O=circumcenter(A,B,C),H=orthocenter(A,B,C);
  const gap=Math.max(35,Math.abs(outside)),P=side==='left'?{x:B.x-gap,y:B.y}:{x:C.x+gap,y:C.y};
  const Q=must(lineIntersection(O,P,A,C),'Q'),R=must(lineIntersection(O,P,A,B),'R');
  const Y=projectPointToLine(Q,A,B),Z=projectPointToLine(R,A,C);
  const S=must(lineIntersection(Q,Y,R,Z),'S'),X=must(lineIntersection(S,H,Y,Z),'X');
  const M=midpoint(A,H),scaleRef=distance(B,C);
  return {A,B,C,O,H,P,Q,R,Y,Z,S,X,M,circumradius:distance(O,A),residuals:{midpointOnYZ:distancePointToLine(M,Y,Z)/scaleRef,axPerpXp:normalizedDotResidual(sub(A,X),sub(P,X))}};
}

function q3Svg(m){
  const pts=Object.values(m).filter(v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.y));
  const minX=Math.min(...pts.map(p=>p.x),m.O.x-m.circumradius)-35,maxX=Math.max(...pts.map(p=>p.x),m.O.x+m.circumradius)+35;
  const minY=Math.min(...pts.map(p=>p.y),m.O.y-m.circumradius)-35,maxY=Math.max(...pts.map(p=>p.y),m.O.y+m.circumradius)+35;
  const vb=`${minX} ${minY} ${maxX-minX} ${maxY-minY}`;
  return `<svg id="q3GeometrySvg" viewBox="${vb}" role="img" aria-label="Hình dựng chính xác Câu 3"><style>line,path,circle{vector-effect:non-scaling-stroke}.tri{stroke:#e2e8f0;stroke-width:3;fill:none}.aux{stroke:#64748b;stroke-width:1.6;stroke-dasharray:8 7}.key{stroke:#fb7185;stroke-width:3}.ortho{stroke:#22d3ee;stroke-width:2}.proof{stroke:#84cc16;stroke-width:2.5}.main-circle{fill:none;stroke:#475569;stroke-width:2}.point{fill:#fde047;stroke:#0f172a;stroke-width:1.5}text{fill:#f8fafc;font:700 15px 'Be Vietnam Pro','Noto Sans',sans-serif;paint-order:stroke;stroke:#0b1324;stroke-width:3px;stroke-linejoin:round}</style><circle class="main-circle" cx="${m.O.x}" cy="${m.O.y}" r="${m.circumradius}"/>${line(m.A,m.B,'tri')}${line(m.B,m.C,'tri')}${line(m.C,m.A,'tri')}${line({x:minX,y:m.B.y},{x:maxX,y:m.B.y},'aux')}${line(m.O,m.P,'aux')}${line(m.Q,m.Y,'ortho')}${line(m.R,m.Z,'ortho')}${line(m.Y,m.Z,'key')}${line(m.S,m.H,'proof')}${line(m.X,m.P,'proof')}${['A','B','C','O','H','P','Q','R','Y','Z','S','X','M'].map(n=>point(m[n],n)).join('')}</svg>`;
}
function exportSvg(id,name){const el=document.getElementById(id);if(!el)return;const blob=new Blob([el.outerHTML],{type:'image/svg+xml'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

export function mountQ3(host){
  host.innerHTML=`<div class="tool-head"><div><span class="label">Tool hình học chính xác</span><h3>Câu 3 · Dựng từ đúng định nghĩa</h3></div><div class="tool-actions"><button class="iconbtn" data-side>Đổi phía P</button><button class="iconbtn" data-export>Xuất SVG</button></div></div><div class="controls"><label>Khoảng cách P ngoài cạnh<input data-distance type="range" min="60" max="300" step="5" value="150"></label></div><div class="tool-stage" data-stage></div><div class="residuals"><div class="residual" data-r1></div><div class="residual" data-r2></div></div><p class="source-note">Mọi điểm O,H,Q,R,Y,Z,S,X,M được tính từ A,B,C,P. Residual càng gần 0 thì quan hệ hình học càng chính xác.</p>`;
  let side='right';const range=host.querySelector('[data-distance]'),stage=host.querySelector('[data-stage]');
  const draw=()=>{const m=computeQ3Model({side,distance:+range.value});stage.innerHTML=q3Svg(m);host.querySelector('[data-r1]').innerHTML=`dist(M,YZ)/BC = <span class="ok">${fmt(m.residuals.midpointOnYZ)}</span>`;host.querySelector('[data-r2]').innerHTML=`|cos(AX,XP)| = <span class="ok">${fmt(m.residuals.axPerpXp)}</span>`};
  range.addEventListener('input',draw);host.querySelector('[data-side]').addEventListener('click',()=>{side=side==='right'?'left':'right';draw()});host.querySelector('[data-export]').addEventListener('click',()=>exportSvg('q3GeometrySvg','cau-3-hinh-hoc-chinh-xac.svg'));draw();
}

if(typeof document!=='undefined'){const host=document.getElementById('q3GeometryTool');if(host)mountQ3(host)}
