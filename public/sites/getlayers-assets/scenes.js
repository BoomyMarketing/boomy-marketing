import * as THREE from './vendor/three.module.min.js';

function rounded(width, height, radius, depth) {
  const shape = new THREE.Shape();
  const x = -width / 2, y = -height / 2, w = width, h = height, r = radius;
  shape.moveTo(x+r,y); shape.lineTo(x+w-r,y); shape.quadraticCurveTo(x+w,y,x+w,y+r);
  shape.lineTo(x+w,y+h-r); shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  shape.lineTo(x+r,y+h); shape.quadraticCurveTo(x,y+h,x,y+h-r);
  shape.lineTo(x,y+r); shape.quadraticCurveTo(x,y,x+r,y);
  return new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:12});
}

function screenTexture() {
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=1024;
  const c=canvas.getContext('2d');
  const gradient=c.createLinearGradient(0,0,512,1024);gradient.addColorStop(0,'#255b50');gradient.addColorStop(1,'#0b2623');
  c.fillStyle=gradient;c.fillRect(0,0,512,1024);
  c.fillStyle='#d3e9d8';c.font='24px sans-serif';c.fillText('9:41',38,53);
  c.font='bold 28px sans-serif';c.fillText('SmartphoneKey',38,165);
  c.fillStyle='#9cc3ad';c.font='21px sans-serif';c.fillText('YOUR EVERYDAY WAY IN',38,228);
  c.strokeStyle='#b2d6bb';c.lineWidth=3;c.beginPath();c.arc(258,455,104,0,Math.PI*2);c.stroke();
  c.lineWidth=7;c.beginPath();c.arc(258,435,22,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(258,458);c.lineTo(258,504);c.stroke();
  c.fillStyle='#e4eee5';c.font='bold 47px sans-serif';c.fillText('Studio',38,674);c.fillText('entrance.',38,735);
  c.font='22px sans-serif';c.fillStyle='#b7d0c1';c.fillText('Wallet access key',38,822);
  c.fillStyle='#b2d6bb';c.fillRect(38,877,436,2);c.font='18px sans-serif';c.fillText('TAP TO EXPLORE',38,934);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

export function startScenes() {
  for(const mount of document.querySelectorAll('[data-scene]')) {
    let renderer;
    try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});} catch {
      const caption=mount.parentElement.querySelector('.scene-caption');
      if(caption)caption.textContent='Your phone. Your key. Your door.';
      continue;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
    mount.append(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(35,1,.1,50);camera.position.set(0,0,9);
    const group=new THREE.Group();scene.add(group);
    const product=mount.dataset.scene==='product';
    let phone,reader,ring,points,manual=0,unlocked=false;
    if(product) {
      const front=new THREE.MeshStandardMaterial({color:'#244c43',metalness:.2,roughness:.35});
      const metal=new THREE.MeshStandardMaterial({color:'#8eaaa4',metalness:.85,roughness:.28});
      const phoneBody=new THREE.Mesh(rounded(1.65,3.35,.23,.14),metal);
      phone=new THREE.Group();phone.add(phoneBody);
      const displayGeometry=rounded(1.49,3.17,.19,.015);
      const displayPositions=displayGeometry.attributes.position;
      for(let i=0;i<displayPositions.count;i++)displayGeometry.attributes.uv.setXY(i,(displayPositions.getX(i)+.745)/1.49,(displayPositions.getY(i)+1.585)/3.17);
      const display=new THREE.Mesh(displayGeometry,new THREE.MeshBasicMaterial({map:screenTexture()}));display.position.z=.17;phone.add(display);
      const cameraPill=new THREE.Mesh(rounded(.43,.1,.05,.01),new THREE.MeshBasicMaterial({color:'#122522'}));cameraPill.position.set(0,1.4,.22);phone.add(cameraPill);
      phone.position.set(-.58,.14,.3);phone.rotation.set(-.08,.1,-.12);group.add(phone);
      reader=new THREE.Group();
      const body=new THREE.Mesh(rounded(.75,2.33,.12,.3),metal);reader.add(body);
      const face=new THREE.Mesh(rounded(.65,2.2,.095,.03),front);face.position.z=.33;reader.add(face);
      ring=new THREE.Mesh(new THREE.TorusGeometry(.16,.014,12,50),new THREE.MeshBasicMaterial({color:'#94d6b2'}));ring.position.set(0,.23,.39);reader.add(ring);
      const light=new THREE.Mesh(new THREE.BoxGeometry(.43,.035,.018),new THREE.MeshBasicMaterial({color:'#91d2ae'}));light.position.set(0,.87,.4);reader.add(light);
      reader.position.set(1.12,-.13,-.38);reader.rotation.y=-.2;group.add(reader);
      const halo=new THREE.Mesh(new THREE.TorusGeometry(2.4,.009,8,110),new THREE.MeshBasicMaterial({color:'#6c9b87',transparent:true,opacity:.22}));halo.rotation.x=.2;halo.position.z=-1.1;scene.add(halo);
      scene.add(new THREE.HemisphereLight('#deefe7','#1a312b',2.5));
      const key=new THREE.DirectionalLight('#effaf1',4.2);key.position.set(-3,4,5);scene.add(key);
      const rim=new THREE.DirectionalLight('#6ad6b0',2);rim.position.set(3,-1,2);scene.add(rim);
      group.rotation.y=-.25;group.rotation.x=.06;
    } else {
      const total=matchMedia('(max-width:650px)').matches?750:1600;
      const positions=new Float32Array(total*3);let seed=82;
      const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
      for(let i=0;i<total;i++){const angle=random()*Math.PI*2,rad=1.5+random()*.65;positions[i*3]=Math.cos(angle)*rad+1.9;positions[i*3+1]=Math.sin(angle)*rad;positions[i*3+2]=(random()-.5)*4;}
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
      const mat=new THREE.PointsMaterial({color:'#d5aa70',size:.017,transparent:true,opacity:.9,sizeAttenuation:true});
      points=new THREE.Points(geo,mat);group.add(points);
      const axis=new THREE.Mesh(new THREE.TorusGeometry(1.62,.007,6,100),new THREE.MeshBasicMaterial({color:'#d9ac66',transparent:true,opacity:.3}));axis.position.set(1.9,0,0);axis.rotation.y=.35;group.add(axis);
      camera.position.z=8.2;
    }
    let visible=true, paused=document.documentElement.dataset.motion==='paused', px=0,py=0;
    function resize(){const {width,height}=mount.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();if(product){camera.position.z=width<400?10:9;}renderer.render(scene,camera);}
    const ro=new ResizeObserver(resize);ro.observe(mount);resize();
    let elapsed=0,last=0;
    function frame(t){const delta=last?Math.min((t-last)/1000,.05):0;last=t;elapsed+=delta;
      if(product){group.rotation.y=-.25+manual+Math.sin(elapsed*.35)*.11+px*.17;group.rotation.x=.06+py*.1;phone.position.y=.14+Math.sin(elapsed*.7)*.065;phone.position.x=unlocked?-.14:-.58;ring.material.color.set(unlocked?'#e0ffa7':'#94d6b2');}
      else{group.rotation.y=Math.sin(elapsed*.11)*.12;group.rotation.z=Math.sin(elapsed*.09)*.06;points.material.size=unlocked?.028:.017;}
      renderer.render(scene,camera);
    }
    function sync(){renderer.setAnimationLoop(!paused&&visible&&!document.hidden?frame:null);last=0;frame(0);}
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'80px'});observer.observe(mount);
    document.addEventListener('motionchange',e=>{paused=e.detail.paused;sync();});document.addEventListener('visibilitychange',sync);
    document.addEventListener('keydemo',e=>{unlocked=e.detail.unlocked;frame(0);});
    mount.addEventListener('pointermove',e=>{if(paused||e.pointerType!=='mouse')return;const r=mount.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;});
    document.querySelector('[data-rotate]')?.addEventListener('click',()=>{manual+=Math.PI/6;frame(0);});
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();renderer.setAnimationLoop(null);mount.dataset.ready='false';});
    renderer.domElement.addEventListener('webglcontextrestored',()=>{mount.dataset.ready='true';resize();sync();});
    mount.dataset.ready='true';sync();
    const caption=mount.parentElement.querySelector('.scene-caption');
    if(caption)caption.textContent='Your phone. Your key. Your door.';
    window.addEventListener('pagehide',e=>{if(e.persisted)return;renderer.setAnimationLoop(null);observer.disconnect();ro.disconnect();scene.traverse(obj=>{obj.geometry?.dispose();if(obj.material){for(const material of [].concat(obj.material)){material.map?.dispose();material.dispose();}}});renderer.dispose();},{once:true});
  }
}
