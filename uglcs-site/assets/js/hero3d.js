/* 3D interactive emblem: gold particle sphere + wire icosahedron + orbit rings. Loaded only on desktop. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
export function start(canvas){
  const size=()=>[canvas.clientWidth||520,canvas.clientHeight||520];
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(42,1,.1,50);cam.position.z=6.2;
  const gold=new THREE.Color(0xD6B45C),pale=new THREE.Color(0xF2E3B3),blue=new THREE.Color(0x7FA2DC);
  const g=new THREE.Group();scene.add(g);
  /* particles on a fibonacci sphere */
  const N=1100,pos=new Float32Array(N*3),ph=Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<N;i++){const y=1-(i/(N-1))*2,r=Math.sqrt(1-y*y),t=ph*i;pos.set([Math.cos(t)*r*2,y*2,Math.sin(t)*r*2],i*3)}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pm=new THREE.PointsMaterial({color:gold,size:.032,transparent:true,opacity:.95,depthWrite:false});
  const pts=new THREE.Points(pg,pm);g.add(pts);
  /* wire icosahedron */
  const ico=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.35,1)),new THREE.LineBasicMaterial({color:pale,transparent:true,opacity:.55}));g.add(ico);
  /* orbit rings */
  const rings=[];[[2.55,.35,0],[2.75,-.9,.6],[2.35,1.25,-.4]].forEach(([r,rx,rz],i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,.008,8,160),new THREE.MeshBasicMaterial({color:i==1?blue:gold,transparent:true,opacity:.6}));m.rotation.set(rx,0,rz);g.add(m);rings.push(m)});
  const dark=()=>document.documentElement.getAttribute('data-theme')==='dark';
  function resize(){const [w,h]=size();renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
  resize();addEventListener('resize',resize);
  let mx=0,my=0,tx=0,ty=0,boost=0;
  const host=canvas.parentNode;
  host.addEventListener('mousemove',e=>{const r=host.getBoundingClientRect();mx=((e.clientX-r.left)/r.width-.78)*2;my=((e.clientY-r.top)/r.height-.5)*2});
  canvas.addEventListener('mouseenter',()=>boost=1);canvas.addEventListener('mouseleave',()=>boost=0);
  let vis=true;new IntersectionObserver(en=>{vis=en[0].isIntersecting}).observe(canvas);
  let last=performance.now(),spin=0,speed=.0035;
  function frame(now){
    requestAnimationFrame(frame);if(!vis||document.hidden)return;
    const dt=Math.min((now-last)/16.7,3);last=now;
    speed+=((boost?.011:.0035)-speed)*.06;spin+=speed*dt;
    tx+=(mx*.55-tx)*.05;ty+=(my*.45-ty)*.05;
    g.rotation.y=spin+tx;g.rotation.x=ty*.8+.18;ico.rotation.y=-spin*1.6;
    rings.forEach((r,i)=>r.rotation.z+=.0016*(i+1)*dt);
    const d=dark();pm.color.copy(d?pale:gold);
    renderer.render(scene,cam);
  }
  requestAnimationFrame(frame);canvas.classList.add('on');
}
