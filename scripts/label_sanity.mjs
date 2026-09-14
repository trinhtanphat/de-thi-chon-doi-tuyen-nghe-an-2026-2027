import assert from 'node:assert/strict';
import {computeQ3Model} from '../tools/q3-interactive.js';
import {computeQ5Model} from '../tools/q5-interactive.js';
import {placeCardinalLabels} from '../tools/label-placement.js';
const overlap=(a,b,m=2)=>!(a.x+a.width+m<b.x||b.x+b.width+m<a.x||a.y+a.height+m<b.y||b.y+b.height+m<a.y);
const inside=(b,x,y)=>x>=b.x-2&&x<=b.x+b.width+2&&y>=b.y-2&&y<=b.y+b.height+2;
function audit(tag,P,segments,circles,bounds,labels){
  const names=Object.keys(P);
  for(const n of names){const b=labels[n],p=P[n];assert.ok(Math.abs(b.cx-p.x)<1e-9||Math.abs(b.cy-p.y)<1e-9,`${tag}:${n}:non-cardinal`);assert.ok(b.x>=bounds.x&&b.y>=bounds.y&&b.x+b.width<=bounds.x+bounds.width&&b.y+b.height<=bounds.y+bounds.height,`${tag}:${n}:bounds`);
    for(const s of segments)for(let i=0;i<=100;i++){const u=i/100;if(inside(b,s.a.x+(s.b.x-s.a.x)*u,s.a.y+(s.b.y-s.a.y)*u))throw new Error(`${tag}:${n}:segment`)}
    for(const c of circles)for(let i=0;i<480;i++){const a=2*Math.PI*i/480;if(inside(b,c.c.x+c.r*Math.cos(a),c.c.y+c.r*Math.sin(a)))throw new Error(`${tag}:${n}:circle`)}}
  for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++)assert.ok(!overlap(labels[names[i]],labels[names[j]]),`${tag}:${names[i]}-${names[j]}:labels`);
}
for(const side of ['left','right'])for(const d of [60,100,150,220,300]){
  const m=computeQ3Model({side,distance:d}),names=['A','B','C','O','H','P','Q','R','Y','Z','S','X','M'],P=Object.fromEntries(names.map(n=>[n,m[n]])),pts=Object.values(P),margin=105;
  const minX=Math.min(...pts.map(p=>p.x),m.O.x-m.circumradius)-margin,maxX=Math.max(...pts.map(p=>p.x),m.O.x+m.circumradius)+margin,minY=Math.min(...pts.map(p=>p.y),m.O.y-m.circumradius)-margin,maxY=Math.max(...pts.map(p=>p.y),m.O.y+m.circumradius)+margin,bounds={x:minX,y:minY,width:maxX-minX,height:maxY-minY},baseA={x:minX,y:m.B.y},baseB={x:maxX,y:m.B.y};
  const segments=[{a:m.A,b:m.B},{a:m.B,b:m.C},{a:m.C,b:m.A},{a:baseA,b:baseB},{a:m.O,b:m.P},{a:m.Q,b:m.Y},{a:m.R,b:m.Z},{a:m.Y,b:m.Z},{a:m.S,b:m.H},{a:m.X,b:m.P}],circles=[{c:m.O,r:m.circumradius}],labels=placeCardinalLabels({points:P,segments,circles,bounds});
  audit(`Q3-${side}-${d}`,P,segments,circles,bounds,labels);
}
function mapQ5(m){const core=['A','B','C','D','E','F','I','K','S','T','R','O1'].map(k=>m[k]).filter(Boolean);let minX=Math.min(-1,...core.map(p=>p.x)),maxX=Math.max(1,...core.map(p=>p.x)),minY=Math.min(-1,...core.map(p=>p.y)),maxY=Math.max(1,...core.map(p=>p.y));const spanX=maxX-minX,centerX=(minX+maxX)/2,showJ=!!m.J&&Math.abs(m.J.x-centerX)<=Math.max(8,2.5*spanX);if(showJ){minX=Math.min(minX,m.J.x);maxX=Math.max(maxX,m.J.x);minY=Math.min(minY,m.J.y);maxY=Math.max(maxY,m.J.y)}const pad=.35,w=maxX-minX+2*pad,h=maxY-minY+2*pad,scale=Math.min(680/w,400/h),ox=40+(680-w*scale)/2,oy=40,f=p=>({x:ox+(p.x-(minX-pad))*scale,y:oy+(p.y-(minY-pad))*scale});return{f,scale,showJ}}
for(const [b,c] of [[-3.4,.7],[-3.4,1.5],[-1.8,.7],[-1.8,1.5],[-2.6,1.3],[-3,1]]){
  const m=computeQ5Model({b,c}),{f,scale,showJ}=mapQ5(m),P={};for(const k of ['A','B','C','D','E','F','I','K','S','T','R','O1','J'])if(m[k]&&(k!=='J'||showJ))P[k]=f(m[k]);
  const specs=[['A','B'],['A','C'],['B','C'],['C','K'],['B','K'],['D','E'],['D','F'],['S','T'],['E','F'],['I','R']];if(showJ)specs.push(['K','J'],['O1','J'],['B','J']);else specs.push(['A','K'],['I','O1'],['B','C']);
  const segments=specs.map(([a,z])=>({a:P[a],b:P[z]})),circles=[{c:P.I,r:scale}],bounds={x:0,y:0,width:760,height:480},labels=placeCardinalLabels({points:P,segments,circles,bounds});
  audit(`Q5-${b}-${c}`,P,segments,circles,bounds,labels);
}
console.log('LABEL SANITY: PASS (Q3/Q5 cardinal labels, no geometry/label overlap)');
