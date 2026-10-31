import * as T from './three.module.js';
import {CompatibilityRenderer} from './compat.js';
const $=s=>document.querySelector(s), scene=new T.Scene();
let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(e){renderer=new CompatibilityRenderer();document.body.classList.add('compatibility');}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;$('#scene').appendChild(renderer.domElement);
scene.background=new T.Color('#a2a18c');scene.fog=new T.FogExp2('#aaa58b',.0018);
const camera=new T.PerspectiveCamera(42,innerWidth/innerHeight,.1,1800);
scene.add(new T.HemisphereLight('#c8d9d3','#777151',2.0));
const sun=new T.DirectionalLight('#ffd29a',4);sun.position.set(-75,90,-85);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-60,right:60,top:70,bottom:-60,near:1,far:250});sun.shadow.bias=-.0006;scene.add(sun);
const sky=new T.Mesh(new T.SphereGeometry(900,32,20),new T.ShaderMaterial({side:T.BackSide,uniforms:{top:{value:new T.Color('#647b80')},bottom:{value:new T.Color('#edc090')}},vertexShader:'varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 v; uniform vec3 top;uniform vec3 bottom; void main(){float h=normalize(v).y; vec3 c=mix(bottom,top,smoothstep(-.06,.65,h)); float s=pow(max(0.,dot(normalize(v),normalize(vec3(-.7,.15,-.7)))),180.);gl_FragColor=vec4(c+vec3(1.,.65,.3)*s*1.5,1.);}'}));scene.add(sky);
const envCanvas=document.createElement('canvas');envCanvas.width=1024;envCanvas.height=512;const ec=envCanvas.getContext('2d');const eg=ec.createLinearGradient(0,0,0,512);eg.addColorStop(0,'#607a87');eg.addColorStop(.42,'#e5ac75');eg.addColorStop(.55,'#d9c9a6');eg.addColorStop(1,'#2d3b34');ec.fillStyle=eg;ec.fillRect(0,0,1024,512);const glow=ec.createRadialGradient(220,225,4,220,225,100);glow.addColorStop(0,'#fffde6');glow.addColorStop(.12,'#ffe2a2');glow.addColorStop(1,'#e6b47100');ec.fillStyle=glow;ec.fillRect(100,100,240,240);const envMap=new T.CanvasTexture(envCanvas);envMap.mapping=T.EquirectangularReflectionMapping;envMap.colorSpace=T.SRGBColorSpace;scene.environment=envMap;
let seed=29;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
function texture(kind){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=kind==='wood'?'#8b6544':kind==='stone'?'#a49e8c':'#b8b5a6';ctx.fillRect(0,0,256,256);for(let i=0;i<4000;i++){let g=rand();ctx.strokeStyle=`rgba(${kind==='wood'?'35,20,10':'55,50,40'},${g*.12})`;ctx.lineWidth=rand()*2;ctx.beginPath();let x=rand()*256,y=rand()*256;ctx.moveTo(x,y);ctx.lineTo(kind==='wood'?x+rand()*10:x+rand()*40,kind==='wood'?y+rand()*120:y+rand()*3);ctx.stroke();}const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(2,2);tex.colorSpace=T.SRGBColorSpace;return tex;}
const mats={concrete:new T.MeshStandardMaterial({color:'#c9c6b9',map:texture('concrete'),roughness:.85}),bronze:new T.MeshStandardMaterial({color:'#5f5140',metalness:.78,roughness:.3}),glass:new T.MeshPhysicalMaterial({color:'#b5cece',metalness:.2,roughness:.12,transparent:true,opacity:.56,side:T.DoubleSide,depthWrite:false}),wood:new T.MeshStandardMaterial({color:'#bda17a',map:texture('wood'),roughness:.45}),stone:new T.MeshStandardMaterial({color:'#c4bca8',map:texture('stone'),roughness:.5}),fabric:new T.MeshStandardMaterial({color:'#d5c6ab',roughness:.96}),dark:new T.MeshStandardMaterial({color:'#292e27',roughness:.6}),gold:new T.MeshStandardMaterial({color:'#ad8050',metalness:.8,roughness:.24}),light:new T.MeshStandardMaterial({color:'#ffe0a4',emissive:'#ffba5d',emissiveIntensity:2})};
function box(w,h,d,x,y,z,mat,parent=scene){let o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function cylinder(r,h,x,y,z,mat,parent=scene){let o=new T.Mesh(new T.CylinderGeometry(r,r,h,32),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
box(1800,.8,1800,0,-2,0,new T.MeshStandardMaterial({color:'#687062',roughness:1}));box(40,1.3,34,0,-.65,0,mats.stone);
const floors=[],facades=[],finishes=[],furnish=new T.Group();scene.add(furnish);furnish.position.y=32;
// Every story has independent slab, column and beam animation tracks.
for(let level=0;level<8;level++){
 const group=new T.Group();scene.add(group);group.position.y=level*4;
 const slab=box(26,.35,20,0,0,0,mats.concrete,group),columns=[],beams=[];
 for(let x of [-12,-4,4,12])for(let z of [-9,0,9])columns.push(box(.6,3.65,.6,x,2,z,mats.concrete,group));
 for(let z of [-9.5,9.5])beams.push(box(26,.65,.5,0,3.7,z,mats.concrete,group));
 floors.push({group,slab,columns,beams});
 let facade=new T.Group();scene.add(facade);facades.push(facade);let y=level*4;
 for(let x=-12;x<=12;x+=3){box(.12,3.5,.18,x,y+1.9,9.65,mats.bronze,facade);box(.12,3.5,.18,x,y+1.9,-9.65,mats.bronze,facade);if(x<12){box(2.85,3.4,.06,x+1.5,y+1.9,9.65,mats.glass,facade);box(2.85,3.4,.06,x+1.5,y+1.9,-9.65,mats.glass,facade);}}
 for(let x of [-12.65,12.65]){box(.05,3.5,19,x,y+1.9,0,mats.glass,facade);for(let z=-9;z<=9;z+=3)box(.15,3.6,.15,x,y+1.9,z,mats.bronze,facade);}
 facade.children.forEach((o,i)=>o.userData={home:o.position.clone(),order:i});
 let detail=new T.Group();scene.add(detail);finishes.push(detail);
 box(27,.18,21,0,y+3.85,0,mats.bronze,detail);
 for(let z of [-9.8,9.8])box(25,.045,.06,0,y+3.52,z,mats.light,detail);
 for(let x of [-12.9,12.9])box(.06,.045,19,x,y+3.52,0,mats.light,detail);
}
// The first stage: a plan drawn on site and reinforcement emerging from it.
const blueprint=new T.Group();scene.add(blueprint);
const blueMat=new T.MeshBasicMaterial({color:'#3ac9ff',transparent:true,opacity:1});
for(let x=-12;x<=12;x+=4)box(.045,.025,19,x,.04,0,blueMat,blueprint);
for(let z=-9;z<=9;z+=3)box(25,.025,.045,0,.04,z,blueMat,blueprint);
for(let x of [-12,-4,4,12])for(let z of [-9,0,9]){
 box(1.1,.035,.045,x,.055,z-.55,blueMat,blueprint);box(1.1,.035,.045,x,.055,z+.55,blueMat,blueprint);
 box(.045,.035,1.1,x-.55,.055,z,blueMat,blueprint);box(.045,.035,1.1,x+.55,.055,z,blueMat,blueprint);
}
const reinforcement=new T.Group();scene.add(reinforcement);
for(let x of [-12,-4,4,12])for(let z of [-9,0,9])for(let dx of [-.18,.18])for(let dz of [-.18,.18])cylinder(.025,5,x+dx,2.5,z+dz,mats.bronze,reinforcement);
// Penthouse floor, warm timber walls and continuous glazing.
box(26,.3,20,0,0,0,mats.wood,furnish);box(26,.25,20,0,4.3,0,mats.concrete,furnish);box(.25,4,20,-12.8,2,0,mats.stone,furnish);box(.25,4,20,12.8,2,0,mats.wood,furnish);
box(26,3.9,.07,0,2,-9.8,mats.glass,furnish);for(let x=-12;x<=12;x+=4)box(.13,4,.15,x,2,-9.7,mats.bronze,furnish);
// Front open portal admits the journey camera.
for(let x of [-10,10])box(5,4,.1,x,2,9.5,mats.glass,furnish);
box(17,.04,12,-1,.18,-1,new T.MeshStandardMaterial({color:'#c4b69d',roughness:1}),furnish);
function sofa(x,z,w,rot=0){const g=new T.Group();g.position.set(x,.2,z);g.rotation.y=rot;furnish.add(g);box(w,.6,2.1,0,.55,0,mats.fabric,g);box(w,.8,.32,0,1.05,-.9,mats.fabric,g);for(let s of [-1,1])box(.28,.75,2.1,s*w/2,.9,0,mats.fabric,g);for(let i=0;i<3;i++)box(w/3-.07,.22,1.65,-w/3+i*w/3,.95,.12,mats.fabric,g);for(let a of [-1,1])for(let b of [-1,1])box(.1,.3,.1,a*(w/2-.3),.12,b*.7,mats.bronze,g);}
sofa(-3,-4.7,6.7);sofa(-7,-.2,3.3,Math.PI/2);sofa(5,-3.5,3.2,-.25);
box(5,.2,3,-2,.9,0,mats.stone,furnish);box(3,.65,1.8,-2,.5,0,mats.dark,furnish);cylinder(.7,.12,-2,1.08,0,mats.gold,furnish);cylinder(.15,.55,-2,1.4,0,mats.stone,furnish);
for(let i=0;i<3;i++)box(.8,.07,1.1,-.5,1.06+i*.08,.2,mats.fabric,furnish);
// Kitchen and glowing linear ceiling detail.
box(6,1.1,2,8,.7,-6,mats.stone,furnish);box(6,.15,2.2,8,1.3,-6,mats.stone,furnish);box(8,3.6,.5,8,1.9,-9.2,mats.wood,furnish);for(let x=4;x<12;x+=1.3)box(.03,3.5,.06,x,1.9,-8.9,mats.bronze,furnish);
for(let x of [-9,9]){box(.045,.035,16,x,4.1,0,mats.light,furnish);let l=new T.PointLight('#ffd49a',24,20,2);l.position.set(x,3,-3);furnish.add(l);}
for(let x of [-3,0,3]){cylinder(.015,1.5,x,3.5,-1,mats.bronze,furnish);cylinder(.32,.12,x,2.75,-1,mats.light,furnish);}
function plant(x,z){cylinder(.46,.8,x,.6,z,mats.dark,furnish);const foliage=new T.MeshStandardMaterial({color:'#3d5232',roughness:.8});for(let i=0;i<12;i++){let a=i*2.4;let leaf=new T.Mesh(new T.SphereGeometry(1,10,8),foliage);leaf.scale.set(.16,.8,.3);leaf.position.set(x+Math.sin(a)*.4,1.5+rand()*.9,z+Math.cos(a)*.4);leaf.rotation.set(.3,0,a*.4);furnish.add(leaf);}}
plant(-10,-7);plant(10,6);
// Rooftop crane: articulated lattice construction silhouette.
const crane=new T.Group();scene.add(crane);for(let y=0;y<48;y+=3){box(.22,3,.22,17,y,0,mats.gold,crane);box(.22,3,.22,18,y,0,mats.gold,crane);let brace=box(.1,3.2,.1,17.5,y,0,mats.gold,crane);brace.rotation.z=.32;}box(38,.35,.4,6,47,0,mats.gold,crane);for(let x=-12;x<24;x+=2){box(.08,1.7,.08,x,47.7,0,mats.gold,crane);let br=box(.08,2.5,.08,x+1,47.7,0,mats.gold,crane);br.rotation.z=.9;}box(.05,17,.05,-10,38,0,mats.dark,crane);box(3,2,2,22,46,0,mats.concrete,crane);
// Distant skyline has varied profiles, windows and atmospheric depth.
const cityMat=new T.MeshStandardMaterial({color:'#737c73',roughness:.8});for(let i=0;i<90;i++){let x=(rand()-.5)*700,z=-170-rand()*550;if(Math.abs(x)<25&&z>-90)continue;let h=5+Math.pow(rand(),2)*58,w=7+rand()*17,d=8+rand()*18;box(w,h,d,x,h/2-2,z,cityMat);if(i%3===0)box(w*.65,h*.08,d*.65,x,h+h*.04-2,z,cityMat);for(let k=0;k<Math.min(h/5,12);k++)if(rand()>.45)box(w*.65,.4,.05,x,k*5+3,z+d/2+.05,mats.light);}
const sections=[{name:'THE STRUCTURE',h:'Every space<br>begins with<br><em>a vision.</em>',d:'From the first line to the last light.<br>Explore the making of a place to belong.'},{name:'THE ENVELOPE',h:'A frame.<br>A rhythm.<br><em>A new form.</em>',d:'Concrete finds its rhythm.<br>Glass catches the last of the sun.'},{name:'THE ARRIVAL',h:'Beyond<br>the facade.<br><em>Into the light.</em>',d:'Follow the architecture inward.<br>A different perspective is waiting.'},{name:'THE LIVING',h:'Not just built.<br><em>Belonged to.</em>',d:'Warm materials. Quiet proportions.<br>A space that finally feels like home.'}];
let progress=scrollY/(document.documentElement.scrollHeight-innerHeight),target=scrollY/(document.documentElement.scrollHeight-innerHeight),playing=false,last=performance.now(),chapter=-1,motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth=(a,b,v)=>{let t=T.MathUtils.clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
function update(p){
 let completed=0,installed=0;
 for(let i=0;i<8;i++){
  const f=floors[i],start=.09+i*.046;
  const slab=smooth(start,start+.035,p),column=smooth(start+.025,start+.070,p),beam=smooth(start+.052,start+.085,p);
  f.group.visible=slab>.001;f.slab.scale.set(Math.max(.001,slab),1,Math.max(.001,slab));
  f.columns.forEach((o,k)=>{let q=smooth(start+.025+k*.0005,start+.065+k*.0005,p);o.visible=q>.001;o.scale.y=Math.max(.001,q);o.position.y=.2+1.825*q;});
  f.beams.forEach(o=>{o.visible=beam>.001;o.scale.x=Math.max(.001,beam);});
  if(beam>.995)completed++;
  const facade=facades[i];facade.visible=p>.49+i*.014;
  facade.children.forEach((o,k)=>{let q=smooth(.49+i*.014+k*.0004,.56+i*.014+k*.0004,p);o.visible=q>.001;o.scale.y=Math.max(.001,q);o.position.copy(o.userData.home);o.position.y+=(1-q)*2;if(q>.995)installed++;});
  let finish=smooth(.64+i*.011,.72+i*.011,p);finishes[i].visible=finish>.001;finishes[i].scale.set(Math.max(.001,finish),1,Math.max(.001,finish));
 }
 let plan=1-smooth(.10,.25,p);blueprint.visible=plan>.001;blueMat.opacity=plan;blueprint.scale.setScalar(.45+.55*smooth(0,.075,p));
 reinforcement.visible=p<.23;reinforcement.scale.y=Math.max(.001,smooth(.015,.10,p));
 crane.visible=p>.02&&p<.79;crane.position.y=smooth(.72,.79,p)*32;
 furnish.visible=p>.69;furnish.scale.y=Math.max(.001,smooth(.69,.78,p));
 // A single camera follows the building from the plan to the completed upper residence.
 const mobile=innerWidth<700,orbit=smooth(.05,.57,p),travel=smooth(.80,1,p);
 const exterior=new T.Vector3((mobile?56:47)+Math.sin(orbit*.65)*9,26+orbit*15,mobile?85:68);
 const inside=new T.Vector3(.5,34.1,7.7),focusA=new T.Vector3(-3,10+orbit*10,0),focusB=new T.Vector3(-1,33.8,-7);
 camera.position.lerpVectors(exterior,inside,travel);camera.lookAt(focusA.lerp(focusB,travel));camera.fov=mobile?48:42;camera.updateProjectionMatrix();
 let c=p<.49?0:p<.72?1:p<.91?2:3;
 if(c!==chapter){chapter=c;$('#heading').innerHTML=sections[c].h;$('#description').innerHTML=sections[c].d;$('#sideName').textContent=sections[c].name;$('#count').textContent=`0${c+1} / 04`;document.body.classList.toggle('interior',c===3);document.querySelectorAll('[data-stage]').forEach((b,i)=>{b.classList.toggle('active',i===c);b.setAttribute('aria-current',i===c?'step':'false');});}
 $('#build-status').textContent=p<.09?'01 — DRAWING THE PLAN':p<.49?`02 — STRUCTURE / ${completed} OF 8 FLOORS`:p<.72?'03 — INSTALLING GLASS + BRONZE':p<.80?'04 — LIGHT + FINISHES':p<.96?'05 — ENTERING THE RESIDENCE':'06 — WELCOME HOME';
 $('#scene').dataset.builtFloors=String(completed);$('#scene').dataset.installedPanels=String(installed);$('#scene').dataset.progress=p.toFixed(4);
 $('#progress').value=Math.round(p*1000);$('#progress').setAttribute('aria-valuetext',`${sections[c].name}, ${Math.round(p*100)} percent`);$('#percent').textContent=Math.round(p*100)+'%';$('#hint').style.opacity=p>.8?'0':'1';
}
function setTarget(p){playing=false;$('#play').textContent='▷';$('#play').setAttribute('aria-label','Play journey');target=p;window.scrollTo(0,p*(document.documentElement.scrollHeight-innerHeight));if(!motion)progress=target;}
window.addEventListener('scroll',()=>{target=scrollY/(document.documentElement.scrollHeight-innerHeight);},{passive:true});$('#progress').addEventListener('input',e=>setTarget(+e.target.value/1000));document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>setTarget(+b.dataset.stage));$('#replay').onclick=()=>setTarget(0);$('.brand').onclick=e=>{e.preventDefault();setTarget(0);};$('#play').onclick=()=>{playing=!playing;if(playing&&target>.99){target=progress=0;window.scrollTo(0,0);}$('#play').textContent=playing?'Ⅱ':'▷';$('#play').setAttribute('aria-label',playing?'Pause journey':'Play journey');};
function motionLabel(){$('#motion').textContent=motion?'Motion on':'Motion reduced';$('#motion').setAttribute('aria-pressed',String(!motion));}motionLabel();$('#motion').onclick=()=>{motion=!motion;motionLabel();if(!motion){playing=false;progress=target;$('#play').textContent='▷';}};$('#about').onclick=()=>$('#details').showModal();$('#close').onclick=()=>$('#details').close();$('#details').onclick=e=>{if(e.target===$('#details'))$('#details').close();};
let renderedProgress=-1;window.addEventListener('resize',()=>{renderedProgress=-1;renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;update(progress);});
function tick(now){let dt=Math.min((now-last)/1000,.06);last=now;if(playing){target=Math.min(1,target+dt/35);window.scrollTo(0,target*(document.documentElement.scrollHeight-innerHeight));if(target>=1){playing=false;$('#play').textContent='▷';}}progress=motion?T.MathUtils.lerp(progress,target,1-Math.exp(-dt*10)):target;update(progress);if(!document.hidden&&(Math.abs(progress-renderedProgress)>.00015||renderedProgress<0)){renderer.render(scene,camera);renderedProgress=progress;}requestAnimationFrame(tick);}requestAnimationFrame(tick);$('#loading').style.opacity=0;setTimeout(()=>$('#loading').hidden=true,700);
