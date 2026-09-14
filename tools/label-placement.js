const DIRS={up:{x:0,y:-1},right:{x:1,y:0},down:{x:0,y:1},left:{x:-1,y:0}};
const DEFAULT_GAPS=[6,10,16,24,34,46,60,78,98,122,150];
const rectOverlap=(a,b,m=5)=>!(a.x+a.width+m<b.x||b.x+b.width+m<a.x||a.y+a.height+m<b.y||b.y+b.height+m<a.y);
const inside=(p,r)=>p.x>=r.x&&p.x<=r.x+r.width&&p.y>=r.y&&p.y<=r.y+r.height;
const inflate=(r,m)=>({x:r.x-m,y:r.y-m,width:r.width+2*m,height:r.height+2*m});
function segmentHitsRect(a,b,rect){
  const r=inflate(rect,2); if(inside(a,r)||inside(b,r))return true;
  const dx=b.x-a.x,dy=b.y-a.y,p=[-dx,dx,-dy,dy],q=[a.x-r.x,r.x+r.width-a.x,a.y-r.y,r.y+r.height-a.y];
  let t0=0,t1=1; for(let i=0;i<4;i++){if(Math.abs(p[i])<1e-12){if(q[i]<0)return false;continue}const t=q[i]/p[i];if(p[i]<0)t0=Math.max(t0,t);else t1=Math.min(t1,t);if(t0>t1)return false} return true;
}
function circleHitsRect(circle,rect){
  const r=inflate(rect,2),cx=circle.c.x,cy=circle.c.y,nx=Math.max(r.x,Math.min(cx,r.x+r.width)),ny=Math.max(r.y,Math.min(cy,r.y+r.height));
  const minD=Math.hypot(nx-cx,ny-cy),maxD=Math.max(...[[r.x,r.y],[r.x+r.width,r.y],[r.x+r.width,r.y+r.height],[r.x,r.y+r.height]].map(([x,y])=>Math.hypot(x-cx,y-cy)));
  return minD<=circle.r&&maxD>=circle.r;
}
function pointHitsRect(p,rect){const r=inflate(rect,2),nx=Math.max(r.x,Math.min(p.x,r.x+r.width)),ny=Math.max(r.y,Math.min(p.y,r.y+r.height));return Math.hypot(nx-p.x,ny-p.y)<7}
function labelRect(point,name,dir,gap,fontSize){
  const w=Math.max(18,fontSize*.72*name.length+10),h=fontSize*1.55,d=5+gap,v=DIRS[dir];
  const cx=point.x+v.x*(d+(v.x?w/2:h/2)),cy=point.y+v.y*(d+(v.y?h/2:w/2));
  return{x:cx-w/2,y:cy-h/2,width:w,height:h,cx,cy,dir,gap};
}
function preferredDirs(point,center){const dx=point.x-center.x,dy=point.y-center.y,h=dx>=0?'right':'left',v=dy>=0?'down':'up';return Math.abs(dx)>=Math.abs(dy)?[h,v,v==='up'?'down':'up',h==='left'?'right':'left']:[v,h,h==='left'?'right':'left',v==='up'?'down':'up']}
function hardValid(box,name,points,segments,circles,bounds){
  if(bounds&&(box.x<bounds.x+2||box.y<bounds.y+2||box.x+box.width>bounds.x+bounds.width-2||box.y+box.height>bounds.y+bounds.height-2))return false;
  if(segments.some(s=>segmentHitsRect(s.a,s.b,box)))return false;
  if(circles.some(c=>circleHitsRect(c,box)))return false;
  if(Object.entries(points).some(([n,p])=>n!==name&&pointHitsRect(p,box)))return false;
  return true;
}
export function placeCardinalLabels({points,segments=[],circles=[],bounds,fontSize=15,gaps=DEFAULT_GAPS}){
  const names=Object.keys(points),xs=names.map(n=>points[n].x),ys=names.map(n=>points[n].y),center={x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2};
  const options={}; for(const name of names){const dirs=preferredDirs(points[name],center),list=[];for(let di=0;di<dirs.length;di++)for(let gi=0;gi<gaps.length;gi++){const b=labelRect(points[name],name,dirs[di],gaps[gi],fontSize);if(hardValid(b,name,points,segments,circles,bounds))list.push({...b,cost:di*100+gi})}options[name]=list.sort((a,b)=>a.cost-b.cost)}
  const order=[...names].sort((a,b)=>options[a].length-options[b].length||Math.hypot(points[b].x-center.x,points[b].y-center.y)-Math.hypot(points[a].x-center.x,points[a].y-center.y));
  if(order.some(n=>options[n].length===0))throw new Error(`No collision-free cardinal label candidate for ${order.find(n=>options[n].length===0)}`);
  const chosen={},placed=[];let states=0;
  function dfs(i){if(i===order.length)return true;if(++states>250000)return false;const name=order[i];for(const box of options[name]){if(placed.some(p=>rectOverlap(p,box)))continue;chosen[name]=box;placed.push(box);if(dfs(i+1))return true;placed.pop();delete chosen[name]}return false}
  if(!dfs(0))throw new Error('Unable to resolve collision-free cardinal label layout');
  return chosen;
}
