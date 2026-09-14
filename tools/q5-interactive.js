import {circumcenter,orthocenter,lineIntersection,distance,sub,normalizedDotResidual,normalizedCrossResidual} from './geometry-core.js';
import {placeCardinalLabels} from './label-placement.js';

const must=(p,name)=>{if(!p)throw new Error(`Degenerate Q5 construction at ${name}`);return p};
const fmt=x=>Number(x).toExponential(2);

export function computeQ5Model({b=-2.6,c=1.3}={}){
  if(!(b<0&&c>0))throw new Error('Require b<0<c');
  if(Math.abs(b+c)<1e-6||Math.abs(b*c+1)<1e-6)throw new Error('Degenerate tangent triangle');
  const I={x:0,y:0},D={x:0,y:1},B={x:b,y:1},C={x:c,y:1};
  const F={x:2*b/(1+b*b),y:(1-b*b)/(1+b*b)},E={x:2*c/(1+c*c),y:(1-c*c)/(1+c*c)};
  const A={x:(b+c)/(b*c+1),y:(1-b*c)/(b*c+1)},K=orthocenter(B,I,C);
  const S=must(lineIntersection(C,K,D,E),'S'),T=must(lineIntersection(B,K,D,F),'T'),R=must(lineIntersection(S,T,E,F),'R');
  const O1=circumcenter(K,B,C),bcDir=sub(C,B),akDir=sub(K,A),eulerDir=sub(O1,I);
  const irPerpAk=normalizedDotResidual(sub(R,I),akDir);let eulerRelation,relationMode,J=null;
  if(normalizedCrossResidual(eulerDir,bcDir)<1e-9){relationMode='parallel';eulerRelation=Math.max(normalizedCrossResidual(akDir,bcDir),normalizedCrossResidual(eulerDir,bcDir));}
  else{relationMode='concurrent';const J1=must(lineIntersection(A,K,B,C),'AK∩BC'),J2=must(lineIntersection(I,O1,B,C),'Euler∩BC');J=J1;eulerRelation=distance(J1,J2)/Math.max(1,distance(B,C));}
  return {A,B,C,D,E,F,I,K,S,T,R,O1,J,b,c,relationMode,residuals:{irPerpAk,eulerRelation}};
}

function mapModel(m){
  const core=['A','B','C','D','E','F','I','K','S','T','R','O1'].map(k=>m[k]).filter(Boolean);
  let minX=Math.min(-1,...core.map(p=>p.x)),maxX=Math.max(1,...core.map(p=>p.x)),minY=Math.min(-1,...core.map(p=>p.y)),maxY=Math.max(1,...core.map(p=>p.y));
  const spanX=maxX-minX,centerX=(minX+maxX)/2,showJ=!!m.J&&Math.abs(m.J.x-centerX)<=Math.max(8,2.5*spanX);
  if(showJ){minX=Math.min(minX,m.J.x);maxX=Math.max(maxX,m.J.x);minY=Math.min(minY,m.J.y);maxY=Math.max(maxY,m.J.y)}
  const pad=.35,w=maxX-minX+2*pad,h=maxY-minY+2*pad,scale=Math.min(680/w,400/h),ox=40+(680-w*scale)/2,oy=40;
  const f=p=>({x:ox+(p.x-(minX-pad))*scale,y:oy+(p.y-(minY-pad))*scale});return {f,scale,showJ};
}
function q5Svg(m){
  const {f,scale,showJ}=mapModel(m),P={};for(const k of ['A','B','C','D','E','F','I','K','S','T','R','O1','J'])if(m[k]&&(k!=='J'||showJ))P[k]=f(m[k]);
  const specs=[['A','B','tri'],['A','C','tri'],['B','C','tri'],['C','K','aux'],['B','K','aux'],['D','E','aux'],['D','F','aux'],['S','T','key'],['E','F','aux'],['I','R','proof']];
  if(showJ)specs.push(['K','J','proof','AK'],['O1','J','euler','Euler'],['B','J','base-ext','BC']);else specs.push(['A','K','proof','AK'],['I','O1','euler','Euler'],['B','C','base-ext','BC']);
  const segments=specs.map(([a,b])=>({a:P[a],b:P[b]})),labels=placeCardinalLabels({points:P,segments,circles:[{c:P.I,r:scale}],bounds:{x:0,y:0,width:760,height:480}});
  const line=([a,b,cls='',role=''])=>`<line${role?` data-line="${role}"`:''} class="${cls}" x1="${P[a].x}" y1="${P[a].y}" x2="${P[b].x}" y2="${P[b].y}"/>`;
  const pt=n=>{const q=labels[n];return `<circle class="point" data-point="${n}" cx="${P[n].x}" cy="${P[n].y}" r="5"/><text data-label="${n}" data-label-dir="${q.dir}" x="${q.cx}" y="${q.cy}" text-anchor="middle" dominant-baseline="central">${n}</text>`};
  const names=['A','B','C','D','E','F','I','K','S','T','R','O1',...(showJ?['J']:[])];
  return `<svg id="q5GeometrySvg" viewBox="0 0 760 480" role="img" aria-label="Hình dựng chính xác Câu 5"><style>line,circle{vector-effect:non-scaling-stroke}.tri{stroke:#e2e8f0;stroke-width:3}.aux{stroke:#64748b;stroke-width:1.5;stroke-dasharray:7 6}.key{stroke:#fb7185;stroke-width:3}.proof{stroke:#22d3ee;stroke-width:2.5}.euler{stroke:#a3e635;stroke-width:2.5}.base-ext{stroke:#60a5fa;stroke-width:1.7;stroke-dasharray:7 6}.main-circle{fill:rgba(192,132,252,.06);stroke:#c084fc;stroke-width:3}.point{fill:#fde047;stroke:#0f172a;stroke-width:1.5}text{fill:#f8fafc;font:700 15px 'Be Vietnam Pro','Noto Sans',sans-serif;paint-order:stroke;stroke:#0b1324;stroke-width:3px}</style><circle class="main-circle" cx="${P.I.x}" cy="${P.I.y}" r="${scale}"/>${specs.map(line).join('')}${names.map(pt).join('')}</svg>`;
}
function exportSvg(id,name){const el=document.getElementById(id);if(!el)return;const blob=new Blob([el.outerHTML],{type:'image/svg+xml'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

export function mountQ5(host){
  host.innerHTML=`<div class="tool-head"><div><span class="label">Tool hình học chính xác</span><h3>Câu 5 · Incircle, trực tâm và Euler</h3></div><div class="tool-actions"><button class="iconbtn" data-export>Xuất SVG</button></div></div><div class="controls"><label>Tham số b<input data-b type="range" min="-3.4" max="-1.8" step="0.02" value="-2.6"></label><label>Tham số c<input data-c type="range" min="0.7" max="1.5" step="0.02" value="1.3"></label></div><div class="tool-stage" data-stage></div><div class="residuals"><div class="residual" data-r1></div><div class="residual" data-r2></div></div><p class="source-note">Hình được dựng từ đường tròn đơn vị và các tiếp tuyến thật; residual kiểm tra trực tiếp IR ⟂ AK và quan hệ Euler–BC–AK. Khi J ở hữu hạn trong khung, ba đường được kéo dài tới đúng điểm đồng quy.</p>`;
  const b=host.querySelector('[data-b]'),c=host.querySelector('[data-c]'),stage=host.querySelector('[data-stage]');
  const draw=()=>{try{const m=computeQ5Model({b:+b.value,c:+c.value});stage.innerHTML=q5Svg(m);host.querySelector('[data-r1]').innerHTML=`|cos(IR,AK)| = <span class="ok">${fmt(m.residuals.irPerpAk)}</span>`;host.querySelector('[data-r2]').innerHTML=`Euler ${m.relationMode} residual = <span class="ok">${fmt(m.residuals.eulerRelation)}</span>`;}catch(e){stage.innerHTML=`<p class="warning">${e.message}</p>`;}};
  b.addEventListener('input',draw);c.addEventListener('input',draw);host.querySelector('[data-export]').addEventListener('click',()=>exportSvg('q5GeometrySvg','cau-5-hinh-hoc-chinh-xac.svg'));draw();
}
if(typeof document!=='undefined'){const host=document.getElementById('q5GeometryTool');if(host)mountQ5(host)}
