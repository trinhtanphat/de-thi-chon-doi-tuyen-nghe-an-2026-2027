export const EPS=1e-12;
export const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y});
export const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
export const scale=(a,k)=>({x:a.x*k,y:a.y*k});
export const dot=(a,b)=>a.x*b.x+a.y*b.y;
export const cross=(a,b)=>a.x*b.y-a.y*b.x;
export const norm2=a=>dot(a,a);
export const norm=a=>Math.hypot(a.x,a.y);
export const distance=(a,b)=>norm(sub(a,b));
export const midpoint=(a,b)=>scale(add(a,b),.5);

export function lineIntersection(a,b,c,d){
  const r=sub(b,a),s=sub(d,c),den=cross(r,s);
  if(Math.abs(den)<EPS)return null;
  const t=cross(sub(c,a),s)/den;
  return add(a,scale(r,t));
}

export function projectPointToLine(p,a,b){
  const ab=sub(b,a),den=norm2(ab);
  if(den<EPS)throw new Error('Degenerate line');
  return add(a,scale(ab,dot(sub(p,a),ab)/den));
}

export function distancePointToLine(p,a,b){
  const ab=sub(b,a),den=norm(ab);
  if(den<EPS)throw new Error('Degenerate line');
  return Math.abs(cross(ab,sub(p,a)))/den;
}

export function circumcenter(a,b,c){
  const d=2*(a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y));
  if(Math.abs(d)<EPS)throw new Error('Collinear triangle');
  const aa=norm2(a),bb=norm2(b),cc=norm2(c);
  return {
    x:(aa*(b.y-c.y)+bb*(c.y-a.y)+cc*(a.y-b.y))/d,
    y:(aa*(c.x-b.x)+bb*(a.x-c.x)+cc*(b.x-a.x))/d
  };
}

export function orthocenter(a,b,c){
  const o=circumcenter(a,b,c);
  return sub(add(add(a,b),c),scale(o,2));
}

export function normalizedDotResidual(a,b){
  const den=norm(a)*norm(b);
  return den<EPS?Infinity:Math.abs(dot(a,b))/den;
}

export function normalizedCrossResidual(a,b){
  const den=norm(a)*norm(b);
  return den<EPS?Infinity:Math.abs(cross(a,b))/den;
}

export const svgPoint=p=>`${Number(p.x.toFixed(3))},${Number(p.y.toFixed(3))}`;
