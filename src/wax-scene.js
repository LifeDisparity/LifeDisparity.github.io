import * as THREE from 'three';
import { getSquishySpec, createAccessories } from './squishy-models.js';
import { createPressureState, stepPressure, deformPoint, localStress, advanceFracture, getSquishProfile, deformationFrame } from './wax-physics.js';
const clamp = THREE.MathUtils.clamp;

function randomGenerator(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function clipPolygon(polygon, nx, ny, limit) {
  const output = [];
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i], b = polygon[(i + 1) % polygon.length];
    const da = a[0] * nx + a[1] * ny - limit;
    const db = b[0] * nx + b[1] * ny - limit;
    if (da <= 1e-8) output.push(a);
    if ((da < 0) !== (db < 0)) {
      const t = da / (da - db);
      output.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  }
  return output;
}

function makeStamp() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 320;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1024, 320);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '600 97px Georgia, serif';
  ctx.fillStyle = '#d6cfb2';
  ctx.fillText('BUTTER', 570, 171);
  ctx.strokeStyle = '#d6cfb2'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(202, 170, 39, 31, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(178, 159); ctx.lineTo(165, 120); ctx.lineTo(197, 141);
  ctx.moveTo(218, 146); ctx.lineTo(242, 125); ctx.lineTo(235, 167); ctx.stroke();
  ctx.beginPath(); ctx.arc(187, 169, 3, 0, Math.PI * 2); ctx.arc(216, 169, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(197, 183); ctx.quadraticCurveTo(203, 190, 209, 182); ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeRindTexture() {
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#292929';ctx.fillRect(0,0,256,256);
  const random=randomGenerator(6192);
  for(let row=0;row<8;row++)for(let col=0;col<8;col++) {
    const x=(col+(row%2)*.5)*32+(random()-.5)*8,y=row*32+(random()-.5)*8;
    const radius=13+random()*5;
    for(const dx of [-256,0,256])for(const dy of [-256,0,256]) {
      const gradient=ctx.createRadialGradient(x+dx-2,y+dy-2,1,x+dx,y+dy,radius);
      gradient.addColorStop(0,'#ededed');gradient.addColorStop(.35,'#b5b5b5');gradient.addColorStop(.75,'#666666');gradient.addColorStop(1,'#292929');
      ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(x+dx,y+dy,radius,0,Math.PI*2);ctx.fill();
    }
  }
  const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(2.2,2.2);texture.anisotropy=4;
  return texture;
}

function makeRindColorTexture(heightTexture) {
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
  const ctx=canvas.getContext('2d');ctx.drawImage(heightTexture.image,0,0);
  const pixels=ctx.getImageData(0,0,256,256);
  for(let i=0;i<pixels.data.length;i+=4){
    const value=Math.round(153+pixels.data[i]*.40);
    pixels.data[i]=value;pixels.data[i+1]=value;pixels.data[i+2]=value;
  }
  ctx.putImageData(pixels,0,0);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.copy(heightTexture.repeat);texture.anisotropy=4;return texture;
}

function surfacePoint(point, spec) {
  const half = spec.size;
  let normal;
  if (spec.shape === 'ellipsoid') {
    const unit = new THREE.Vector3(point.x / half[0], point.y / half[1], point.z / half[2]).normalize();
    point.set(unit.x * half[0], unit.y * half[1], unit.z * half[2]);
    normal = new THREE.Vector3(unit.x / half[0], unit.y / half[1], unit.z / half[2]).normalize();
    if (spec.surface === 'lychee') {
      // Coherent across all six face boundaries; wax has the fruit's fine texture.
      const wave = Math.sin(point.x * 25) * Math.sin(point.y * 25) * Math.sin(point.z * 25);
      point.addScaledVector(normal, 0.018 * wave * wave);
    }
  } else {
    const radius = spec.roundness || 0.29;
    const inside = new THREE.Vector3(...half.map((h, i) => clamp(point.getComponent(i), -h + radius, h - radius)));
    normal = point.clone().sub(inside).normalize();
    point.copy(inside).addScaledVector(normal, radius);
  }
  return {point, normal};
}

function buildShell(group, materials, spec) {
  const random = randomGenerator(81377);
  const cells = [];
  const half = spec.size;
  const faces = [
    {axis:1,sign:1,u:0,v:2}, {axis:1,sign:-1,u:0,v:2},
    {axis:2,sign:1,u:0,v:1}, {axis:2,sign:-1,u:0,v:1},
    {axis:0,sign:1,u:2,v:1}, {axis:0,sign:-1,u:2,v:1},
  ];
  for (const face of faces) {
    const hu = half[face.u], hv = half[face.v];
    const nx = Math.max(3, Math.round(hu * 4.2)), ny = Math.max(3, Math.round(hv * 4.2));
    const seeds = [];
    for(let i=0;i<nx;i++) for(let j=0;j<ny;j++) seeds.push([
      -hu + (i + .16 + random() * .68) * 2 * hu / nx,
      -hv + (j + .16 + random() * .68) * 2 * hv / ny,
    ]);
    const toSurface = uv => {
      const p = [0,0,0]; p[face.axis] = half[face.axis] * face.sign; p[face.u] = uv[0]; p[face.v] = uv[1];
      return surfacePoint(new THREE.Vector3(...p), spec);
    };
    for (const seed of seeds) {
      let polygon = [[-hu,-hv],[hu,-hv],[hu,hv],[-hu,hv]];
      for(const other of seeds) {
        if(other===seed) continue;
        polygon=clipPolygon(polygon, other[0]-seed[0], other[1]-seed[1], (other[0]**2+other[1]**2-seed[0]**2-seed[1]**2)/2);
        if(!polygon.length) break;
      }
      if(polygon.length<3) continue;
      const boundary=[];
      for(let i=0;i<polygon.length;i++) {
        const a=polygon[i],b=polygon[(i+1)%polygon.length];
        const steps=Math.max(2,Math.ceil(Math.hypot(a[0]-b[0],a[1]-b[1])/.085));
        for(let j=0;j<steps;j++) boundary.push([a[0]+(b[0]-a[0])*j/steps,a[1]+(b[1]-a[1])*j/steps]);
      }
      const center=toSurface(seed), positions=[], normals=[], uvs=[];
      const push=(s,inset=0,n=s.normal)=>{
        const p=s.point.clone().addScaledVector(s.normal,-inset);
        positions.push(p.x,p.y,p.z);normals.push(n.x,n.y,n.z);
        if(spec.stamp)uvs.push((s.point.x/half[0]+1)/2,(1-s.point.z/half[2])/2);
        else uvs.push((s.point.getComponent(face.u)/hu+1)/2,(s.point.getComponent(face.v)/hv+1)/2);
      };
      for(let i=0;i<boundary.length;i++) {
        const a=toSurface(boundary[i]),b=toSurface(boundary[(i+1)%boundary.length]);
        const outward=a.point.clone().sub(center.point).cross(b.point.clone().sub(center.point)).dot(center.normal)>0;
        push(center);push(outward?a:b);push(outward?b:a);
      }
      const frontCount=positions.length/3;
      for(let i=0;i<boundary.length;i++) {
        const a=toSurface(boundary[i]),b=toSurface(boundary[(i+1)%boundary.length]);
        const n=b.point.clone().sub(a.point).cross(a.normal).normalize();
        push(a,0,n);push(a,.035,n);push(b,0,n);push(b,0,n);push(a,.035,n);push(b,.035,n);
      }
      const geometry=new THREE.BufferGeometry();
      geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
      geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
      geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
      geometry.addGroup(0,frontCount,0);geometry.addGroup(frontCount,positions.length/3-frontCount,1);
      const mesh=new THREE.Mesh(geometry,[spec.stamp&&face.axis===1&&face.sign===1?materials.top:materials.wax,materials.edge]);
      mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;group.add(mesh);
      // A central fracture band branches along irregular adjacent cell boundaries.
      const x=Math.abs(center.point.x/half[0]);
      const threshold=.075+x*.19+random()*.08;
      cells.push({mesh, base:Float32Array.from(positions), normals:Float32Array.from(normals),
        origin:center.point,normal:center.normal, threshold, damage:0, opening:0,
        tilt:(random()-.5)*.36, hinge:new THREE.Vector3(random()-.5,random()-.5,random()-.5).cross(center.normal).normalize(), neighbors:[]});
    }
  }
  // Nearest touching plates transmit stress, encouraging connected fracture fronts.
  for(const cell of cells) {
    cell.neighbors=cells.filter(other=>other!==cell).sort((a,b)=>a.origin.distanceToSquared(cell.origin)-b.origin.distanceToSquared(cell.origin)).slice(0,4);
  }
  return cells;
}

function normalUnderPressure(nx,ny,nz,x,y,z,p,halfX,out,index,profile) {
  const {sx,sy,sz,dsy,bendSlope}=deformationFrame(x,p,halfX,profile);
  const yx=y*dsy+bendSlope,zx=-z*dsy/(sx*sy*sy);
  const a=(nx-yx*ny/sy-zx*nz/sz)/sx,b=ny/sy,c=nz/sz;
  const length=Math.hypot(a,b,c);
  if(length<1e-10){out[index]=0;out[index+1]=1;out[index+2]=0;return;}
  const inverse=1/length;out[index]=a*inverse;out[index+1]=b*inverse;out[index+2]=c*inverse;
}

export function createWaxScene(container,{onReady,onError,onCrack}={}) {
  let renderer;
  try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}
  catch(error) {onError?.(error);return {setPressure(){},setColor(){},setSquishy(){},setWaxEnabled(){},reset(){},resize(){},dispose(){},getStats:()=>({available:false})};}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0x000000,0);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  renderer.domElement.setAttribute('role','img');renderer.domElement.style.cssText='display:block;width:100%;height:100%;touch-action:none';container.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,80);
  camera.position.set(5.4,6.5,8.6);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xfff9ed,0xa49ca6,2));
  const key=new THREE.DirectionalLight(0xfff5e4,3.1);key.position.set(-3,7,5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;
  key.shadow.normalBias=.025;key.shadow.bias=-.00015;key.shadow.radius=4;scene.add(key);
  const rim=new THREE.DirectionalLight(0xffffff,1.5);rim.position.set(4,3,-5);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xe5e5ff,.6);fill.position.set(-4,0,-2);scene.add(fill);
  const stage=new THREE.Group();stage.rotation.set(0,-.22,-.035);scene.add(stage);
  const stampTexture=makeStamp(),rindTexture=makeRindTexture();
  const rindColorTexture=makeRindColorTexture(rindTexture);
  const wax=new THREE.MeshPhysicalMaterial({roughness:.48,metalness:0,clearcoat:.13,clearcoatRoughness:.5,side:THREE.DoubleSide});
  const top= wax.clone();top.map=stampTexture;
  const edge=wax.clone();edge.roughness=.78;
  const coreMaterial=new THREE.MeshPhysicalMaterial({roughness:.5,clearcoat:.2,clearcoatRoughness:.45});
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-1.43;ground.receiveShadow=true;scene.add(ground);
  let spec,profile,cells=[],core,coreBase,coreBareBase,coreNormals,accessories=[],toy;
  let waxEnabled=true;
  const physics=createPressureState();let target=0,alive=true,raf,lastTime=0,width=0,height=0;
  const initialCamera=camera.position.clone().normalize();

  function disposeToy() {
    if(!toy)return;
    toy.traverse(obj=>{obj.geometry?.dispose();if(obj.userData.accessory&&obj.material) for(const material of [].concat(obj.material))material.dispose();});
    stage.remove(toy);
  }
  function setSquishy(id) {
    disposeToy();spec=getSquishySpec(id);profile=getSquishProfile(spec.id);toy=new THREE.Group();stage.add(toy);
    wax.bumpMap=spec.surface==='lychee'?rindTexture:null;
    wax.map=spec.surface==='lychee'?rindColorTexture:null;wax.bumpScale=.10;wax.needsUpdate=true;
    cells=buildShell(toy,{wax,top,edge},spec);
    cells.forEach(cell=>{cell.mesh.visible=waxEnabled;});
    const geo=new THREE.SphereGeometry(1,64,40);
    // Use a dense cube for rounded-box interiors, maintaining matching corners.
    const coreGeo=spec.shape==='ellipsoid'?geo:new THREE.BoxGeometry(spec.size[0]*2,spec.size[1]*2,spec.size[2]*2,36,16,16);
    if(coreGeo!==geo)geo.dispose();
    const pos=coreGeo.attributes.position.array;
    coreBareBase=new Float32Array(pos.length);
    for(let i=0;i<pos.length;i+=3) {
      const point=new THREE.Vector3(pos[i],pos[i+1],pos[i+2]);
      if(spec.shape==='ellipsoid')point.multiply(new THREE.Vector3(...spec.size));
      const surf=surfacePoint(point,spec);
      coreBareBase[i]=surf.point.x;coreBareBase[i+1]=surf.point.y;coreBareBase[i+2]=surf.point.z;
      surf.point.addScaledVector(surf.normal,-.046);
      pos[i]=surf.point.x;pos[i+1]=surf.point.y;pos[i+2]=surf.point.z;
    }
    coreGeo.computeVertexNormals();coreBase=pos.slice();coreNormals=coreGeo.attributes.normal.array.slice();
    core=new THREE.Mesh(coreGeo,coreMaterial);core.castShadow=true;core.receiveShadow=true;core.frustumCulled=false;toy.add(core);
    const extra=createAccessories(id);extra.updateMatrixWorld(true);accessories=[];
    extra.traverse(obj=>{if(!obj.isMesh)return;const geo=obj.geometry.clone();geo.applyMatrix4(obj.matrixWorld);const mesh=new THREE.Mesh(geo,obj.material);mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;mesh.userData.accessory=true;toy.add(mesh);accessories.push({mesh,base:geo.attributes.position.array.slice(),normals:geo.attributes.normal.array.slice()});});
    extra.traverse(obj=>obj.geometry?.dispose());
    setColor(spec.color);
    Object.assign(physics,createPressureState());target=0;
    renderer.domElement.setAttribute('aria-label',`Interactive 3D wax-coated ${spec.name.toLowerCase()} squishy`);
    ground.position.y=-spec.size[1]-.36;
    updateGeometry(0);resize();
  }
  function setColor(hex) {
    const color=new THREE.Color(hex);wax.color.copy(color);top.color.copy(color);edge.color.copy(color).multiplyScalar(.88);
    updateCoreMaterial();
  }
  function updateCoreMaterial() {
    coreMaterial.color.copy(waxEnabled ? new THREE.Color(spec.coreColor) : wax.color);
    coreMaterial.bumpMap=!waxEnabled&&spec.surface==='lychee'?rindTexture:null;
    coreMaterial.map=!waxEnabled&&spec.surface==='lychee'?rindColorTexture:null;
    coreMaterial.bumpScale=.035;
    coreMaterial.needsUpdate=true;
  }
  function setWaxEnabled(value) {
    waxEnabled=Boolean(value);
    for(const cell of cells){cell.mesh.visible=waxEnabled;cell.damage=0;cell.opening=0;}
    updateCoreMaterial();
    updateGeometry(0);
    renderer.domElement.setAttribute('aria-label',`Interactive 3D ${waxEnabled?'wax-coated':'soft'} ${spec.name.toLowerCase()} squishy`);
  }
  function resize() {
    const rect=container.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    renderer.setSize(width,height,false);camera.aspect=width/height;
    const wide=spec?.id==='butter'||spec?.id==='platypus';
    const extent=wide?6.2:4.9;
    camera.position.copy(initialCamera).multiplyScalar(Math.max(wide?7.2:6.0,extent/camera.aspect));
    camera.lookAt(0,0,0);camera.updateProjectionMatrix();
  }
  function deformGeometry(mesh,base,normals) {
    const positions=mesh.geometry.attributes.position.array,normalArray=mesh.geometry.attributes.normal.array,p=physics.pressure;
    for(let i=0;i<base.length;i+=3) {
      const x=base[i],y=base[i+1],z=base[i+2],d=deformPoint(x,y,z,p,spec.size[0],profile);
      positions[i]=d[0];positions[i+1]=d[1];positions[i+2]=d[2];
      normalUnderPressure(normals[i],normals[i+1],normals[i+2],x,y,z,p,spec.size[0],normalArray,i,profile);
    }
    mesh.geometry.attributes.position.needsUpdate=true;mesh.geometry.attributes.normal.needsUpdate=true;
  }
  function updateGeometry(dt) {
    const p=physics.pressure;let newCracks=0;
    for(const cell of cells) {
      if(!waxEnabled)continue;
      const transmitted=cell.neighbors.reduce((n,c)=>n+c.damage,0)/cell.neighbors.length*.085;
      const stress=localStress(cell.origin.x,cell.origin.y,cell.origin.z,spec.size,p)+transmitted*p;
      if(advanceFracture(cell,stress,p,physics.restTime>.16,dt))newCracks++;
      const positions=cell.mesh.geometry.attributes.position.array,normalArray=cell.mesh.geometry.attributes.normal.array;
      const open=cell.opening,base=cell.base,n=cell.normal,origin=cell.origin;
      for(let i=0;i<base.length;i+=3) {
        // Contract only in the shell's tangent plane, exposing a narrow fissure.
        // Every resulting vertex follows the core field; no plate floats away.
        const dx=base[i]-origin.x,dy=base[i+1]-origin.y,dz=base[i+2]-origin.z;
        const radial=dx*n.x+dy*n.y+dz*n.z;
        const buckle=THREE.MathUtils.smoothstep(p,.52,1)*cell.damage*cell.tilt;
        const hingeDistance=dx*cell.hinge.x+dy*cell.hinge.y+dz*cell.hinge.z;
        const lift=open*.13+clamp(hingeDistance*buckle,-.014,.055);
        const x=base[i]-(dx-radial*n.x)*open+n.x*lift;
        const y=base[i+1]-(dy-radial*n.y)*open+n.y*lift;
        const z=base[i+2]-(dz-radial*n.z)*open+n.z*lift;
        const d=deformPoint(x,y,z,p,spec.size[0],profile);
        positions[i]=d[0];positions[i+1]=d[1];positions[i+2]=d[2];
        const isFace=cell.normals[i]*n.x+cell.normals[i+1]*n.y+cell.normals[i+2]*n.z>.5;
        const slope=isFace?buckle:0;
        normalUnderPressure(cell.normals[i]-cell.hinge.x*slope,cell.normals[i+1]-cell.hinge.y*slope,cell.normals[i+2]-cell.hinge.z*slope,x,y,z,p,spec.size[0],normalArray,i,profile);
      }
      cell.mesh.geometry.attributes.position.needsUpdate=true;cell.mesh.geometry.attributes.normal.needsUpdate=true;
    }
    deformGeometry(core,waxEnabled?coreBase:coreBareBase,coreNormals);for(const accessory of accessories)deformGeometry(accessory.mesh,accessory.base,accessory.normals);
    if(newCracks)onCrack?.({count:newCracks,strength:Math.min(1,.25+p*.65+newCracks*.018)});
  }
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function frame(time) {
    if(!alive)return;
    const dt=Math.min(.05,(time-lastTime)/1000||.016);lastTime=time;
    const before=physics.pressure;stepPressure(physics,target,dt,profile);
    if(Math.abs(before-physics.pressure)>1e-7||cells.some(cell=>cell.damage>0||cell.opening>1e-6))updateGeometry(dt);
    stage.position.y=reducedMotion.matches?0:Math.sin(time*.00065)*.025;
    stage.rotation.y=-.22+(reducedMotion.matches?0:Math.sin(time*.00026)*.02);
    renderer.render(scene,camera);raf=requestAnimationFrame(frame);
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
  setSquishy('butter');raf=requestAnimationFrame(frame);onReady?.();
  return {
    setPressure(value){target=Number.isFinite(value)?clamp(value,0,1):0;},setColor,setSquishy,setWaxEnabled,
    reset(){target=0;},resize,
    getStats(){return {available:true,pressure:physics.pressure,targetPressure:target,fragments:cells.length,fractureCount:cells.filter(c=>c.damage>0).length,squishy:spec.id,waxEnabled,width,height,drawCalls:renderer.info.render.calls};},
    dispose(){alive=false;cancelAnimationFrame(raf);resizeObserver.disconnect();disposeToy();ground.geometry.dispose();[wax,top,edge,coreMaterial,ground.material].forEach(m=>m.dispose());stampTexture.dispose();rindTexture.dispose();rindColorTexture.dispose();renderer.dispose();renderer.domElement.remove();},
  };
}
