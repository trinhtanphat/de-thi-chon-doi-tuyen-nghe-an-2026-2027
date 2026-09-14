import assert from 'node:assert/strict';
import {dot,projectPointToLine,lineIntersection,circumcenter,orthocenter,distancePointToLine} from '../tools/geometry-core.js';
import {computeQ3Model} from '../tools/q3-interactive.js';
import {computeQ5Model} from '../tools/q5-interactive.js';

const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
const nearPoint=(p,q,t=1e-9)=>{near(p.x,q.x,t);near(p.y,q.y,t)};
near(dot({x:1,y:2},{x:3,y:4}),11);
nearPoint(projectPointToLine({x:2,y:3},{x:0,y:0},{x:4,y:0}),{x:2,y:0});
nearPoint(lineIntersection({x:0,y:0},{x:2,y:2},{x:0,y:2},{x:2,y:0}),{x:1,y:1});
const A={x:0,y:0},B={x:4,y:0},C={x:0,y:3};nearPoint(circumcenter(A,B,C),{x:2,y:1.5});nearPoint(orthocenter(A,B,C),A);near(distancePointToLine({x:1,y:2},A,{x:2,y:0}),2);

let q3Cases=0;
for(const side of ['left','right'])for(let d=40;d<=320;d+=10){const m=computeQ3Model({side,distance:d});assert.ok(m.residuals.midpointOnYZ<1e-9,`Q3 midpoint ${side}/${d}`);assert.ok(m.residuals.axPerpXp<1e-9,`Q3 perp ${side}/${d}`);q3Cases++;}

let q5Cases=0;
for(const b of [-3.4,-3.0,-2.6,-2.5,-2.2,-2.0,-1.8])for(const c of [.7,.9,1.0,1.2,1.3,1.5]){if(Math.abs(b+c)<1e-6||Math.abs(b*c+1)<1e-6)continue;const m=computeQ5Model({b,c});assert.ok(m.residuals.irPerpAk<1e-8,`Q5 perp ${b}/${c}`);assert.ok(m.residuals.eulerRelation<1e-8,`Q5 Euler ${b}/${c}/${m.relationMode}`);q5Cases++;}
console.log(`GEOMETRY SANITY: PASS (${q3Cases} Q3 configurations, ${q5Cases} Q5 configurations)`);
