export function startGradient(){
  const canvas=document.querySelector('[data-gradient]');
  const palettes={jade:[[.75,.89,.73],[.22,.52,.38],[.82,.87,.52]],clay:[[.9,.8,.72],[.61,.36,.29],[.83,.67,.56]],ocean:[[.73,.87,.89],[.26,.51,.61],[.61,.8,.71]]};
  let palette=palettes.jade,refresh=()=>{};
  const setFallback=()=>{canvas.parentElement.style.background='linear-gradient(120deg,'+palette.map(rgb=>'rgb('+rgb.map(v=>Math.round(v*255)).join(' ')+')').join(',')+')';};
  setFallback();
  document.querySelectorAll('[data-palette]').forEach(button=>button.addEventListener('click',()=>{palette=palettes[button.dataset.palette];document.querySelectorAll('[data-palette]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));setFallback();refresh();}));
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl)return;
  const vs='attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
  const fs='precision mediump float;varying vec2 uv;uniform float time;uniform vec2 pointer;uniform vec3 a;uniform vec3 b;uniform vec3 c;void main(){vec2 p=uv;float x=p.x+.09*sin(p.y*4.+time*.18)+pointer.x*.09;float wave=sin(x*5.1+p.y*2.7+time*.2)*.5+.5;float light=sin(p.y*4.7-x*2.1-time*.12)*.5+.5;vec3 col=mix(a,b,smoothstep(.1,.9,wave));col=mix(col,c,light*.45);float shade=pow(1.-abs(p.x-.66),3.);col+=shade*.035;gl_FragColor=vec4(col,1.);}';
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Gradient shader failed');}return s;}
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const uniforms=Object.fromEntries(['time','pointer','a','b','c'].map(k=>[k,gl.getUniformLocation(program,k)]));
  let paused=document.documentElement.dataset.motion==='paused',visible=true,handle=0,time=0,last=0,pointer=[.5,.5];
  function draw(t){if(gl.isContextLost())return;if(last)time+=Math.min((t-last)/1000,.05);last=t;gl.uniform1f(uniforms.time,time);gl.uniform2fv(uniforms.pointer,pointer);['a','b','c'].forEach((key,i)=>gl.uniform3fv(uniforms[key],palette[i]));gl.drawArrays(gl.TRIANGLES,0,6);if(!paused&&visible&&!document.hidden)handle=requestAnimationFrame(draw);}
  function sync(){cancelAnimationFrame(handle);last=0;draw(0);}
  refresh=sync;
  function resize(){const r=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);gl.viewport(0,0,canvas.width,canvas.height);sync();}
  new ResizeObserver(resize).observe(canvas);resize();
  canvas.parentElement.addEventListener('pointermove',e=>{if(paused||e.pointerType!=='mouse')return;const r=canvas.getBoundingClientRect();pointer=[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height];});
  document.addEventListener('motionchange',e=>{paused=e.detail.paused;sync();});document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(canvas);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(handle);canvas.hidden=true;});
  window.addEventListener('pagehide',()=>cancelAnimationFrame(handle));
}
