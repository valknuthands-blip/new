// (c) 2026 Vivash Singh - All Rights Reserved!function(){"use strict";let e,t,n,r,i,o,a,s,u,c,l,v,f,m=document.getElementById("fluidCanvas"),d=null;function g(){if(m){r=[],i=[],n={TEXTURE_DOWNSAMPLE:0,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.85,PRESSURE_ITERATIONS:20,CURL:8,SPLAT_RADIUS:.004,DISTORTION_INTENSITY:.1,BLOB_SOFTNESS:.45},r.push(new N);var g=function(e){var t={alpha:!1,depth:!1,stencil:!1,antialias:!0,preserveDrawingBuffer:!1},n=e.getContext("webgl2",t),r=!!n;r||(n=e.getContext("webgl",t)||e.getContext("experimental-webgl",t));var i=null,o=null;function a(e,t,r){if(!function(e,t,r){var i=n.createTexture();n.bindTexture(n.TEXTURE_2D,i),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,e,4,4,0,t,r,null);var o=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,o),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,i,0);var a=n.checkFramebufferStatus(n.FRAMEBUFFER);return n.deleteFramebuffer(o),n.deleteTexture(i),a===n.FRAMEBUFFER_COMPLETE}(e,t,r))switch(e){case n.R16F:return a(n.RG16F,n.RG,r);case n.RG16F:return a(n.RGBA16F,n.RGBA,r);default:return null}return{internalFormat:e,format:t}}r?(n.getExtension("EXT_color_buffer_float"),o=n.getExtension("OES_texture_float_linear")):(i=n.getExtension("OES_texture_half_float"),o=n.getExtension("OES_texture_half_float_linear")),n.clearColor(0,0,0,1);var s=r?n.HALF_FLOAT:i?i.HALF_FLOAT_OES:null;s||console.warn("Half float textures not supported, falling back to byte format. Effect may look less smooth.");var u=a(r?n.RGBA16F:n.RGBA,n.RGBA,s),c=a(r?n.RG16F:n.RGBA,n.RG,s),l=a(r?n.R16F:n.RGBA,n.RED,s);return{gl:n,ext:{formatRGBA:u,formatRG:c,formatR:l,halfFloatTexType:s,supportLinearFiltering:o}}}(m);e=g.gl,t=g.ext;var E=function(){function t(t,n){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,t),e.attachShader(this.program,n),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);for(var r=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS),i=0;i<r;i++){var o=e.getActiveUniform(this.program,i).name;this.uniforms[o]=e.getUniformLocation(this.program,o)}}return t.prototype.bind=function(){e.useProgram(this.program)},t}(),h=X(e.VERTEX_SHADER,"
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform vec2 texelSize;
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0);
                vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y);
                vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        "),p=X(e.FRAGMENT_SHADER,"
            precision highp float;
            precision mediump sampler2D;

            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform float uTime;
            uniform float uDistortionIntensity;
            uniform float uBlobSoftness;
            uniform vec2 uResolution;

            float blob(vec2 uv, vec2 center, float radius, float softness) {
                vec2 d = uv - center;
                float r = length(d);
                return exp(-r * r / (radius * radius * (1.0 - softness * 0.6)));
            }

            void main() {
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                vec2 distortedUV = vUv + velocity * uDistortionIntensity * 0.04;

                float time = uTime * 0.001;

                vec2 center1 = vec2(0.25 + sin(time * 0.3) * 0.1, 0.5 + cos(time * 0.4) * 0.1);
                vec2 center2 = vec2(0.75 + sin(time * 0.35 + 2.0) * 0.1, 0.5 + cos(time * 0.45 + 1.5) * 0.1);

                vec3 color1 = vec3(0.412, 0.427, 0.627); // #696da0
                vec3 color2 = vec3(0.800, 0.318, 0.439); // #cc5170

                float blob1 = blob(distortedUV, center1, 0.25, uBlobSoftness);
                float blob2 = blob(distortedUV, center2, 0.23, uBlobSoftness);

                float total = blob1 + blob2 + 0.001;
                vec3 blended = (blob1 * color1 + blob2 * color2) / total;

                vec2 uvCentered = vUv - 0.5;
                float vignette = 1.0 - dot(uvCentered, uvCentered) * 0.6;
                vignette = pow(vignette, 0.9);
                blended *= vignette;

                float mask = clamp(total * 0.8, 0.0, 1.0);
                vec3 finalColor = mix(vec3(0.0), blended, mask);

                gl_FragColor = vec4(finalColor, 1.0);
            }
        "),T=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform float value;
            void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
        "),y=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTarget;
            uniform float aspectRatio;
            uniform vec3 color;
            uniform vec2 point;
            uniform float radius;
            void main () {
                vec2 p = vUv - point.xy;
                p.x *= aspectRatio;
                vec3 splat = exp(-dot(p, p) / radius) * color;
                vec3 base = texture2D(uTarget, vUv).xyz;
                gl_FragColor = vec4(base + splat, 1.0);
            }
        "),x=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform float dt;
            uniform float dissipation;
            vec4 bilerp (in sampler2D sam, in vec2 p) {
                vec4 st;
                st.xy = floor(p - 0.5) + 0.5;
                st.zw = st.xy + 1.0;
                vec4 uv = st * texelSize.xyxy;
                vec4 a = texture2D(sam, uv.xy);
                vec4 b = texture2D(sam, uv.zy);
                vec4 c = texture2D(sam, uv.xw);
                vec4 d = texture2D(sam, uv.zw);
                vec2 f = p - st.xy;
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }
            void main () {
                vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
                gl_FragColor = dissipation * bilerp(uSource, coord);
                gl_FragColor.a = 1.0;
            }
        "),R=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform float dt;
            uniform float dissipation;
            void main () {
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                gl_FragColor = dissipation * texture2D(uSource, coord);
                gl_FragColor.a = 1.0;
            }
        "),b=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;
            vec2 sampleVelocity (in vec2 uv) {
                vec2 multiplier = vec2(1.0, 1.0);
                if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
                if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
                if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
                if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
                return multiplier * texture2D(uVelocity, uv).xy;
            }
            void main () {
                float L = sampleVelocity(vL).x;
                float R = sampleVelocity(vR).x;
                float T = sampleVelocity(vT).y;
                float B = sampleVelocity(vB).y;
                float div = 0.5 * (R - L + T - B);
                gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
            }
        "),S=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).y;
                float R = texture2D(uVelocity, vR).y;
                float T = texture2D(uVelocity, vT).x;
                float B = texture2D(uVelocity, vB).x;
                float vorticity = R - L - T + B;
                gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
            }
        "),A=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;
            uniform sampler2D uCurl;
            uniform float curl;
            uniform float dt;
            void main () {
                float T = texture2D(uCurl, vT).x;
                float B = texture2D(uCurl, vB).x;
                float C = texture2D(uCurl, vUv).x;
                vec2 force = vec2(abs(T) - abs(B), 0.0);
                force *= 1.0 / length(force + 0.00001) * curl * C;
                vec2 vel = texture2D(uVelocity, vUv).xy;
                gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
            }
        "),D=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uDivergence;
            vec2 boundary (in vec2 uv) { uv = min(max(uv, 0.0), 1.0); return uv; }
            void main () {
                float L = texture2D(uPressure, boundary(vL)).x;
                float R = texture2D(uPressure, boundary(vR)).x;
                float T = texture2D(uPressure, boundary(vT)).x;
                float B = texture2D(uPressure, boundary(vB)).x;
                float C = texture2D(uPressure, vUv).x;
                float divergence = texture2D(uDivergence, vUv).x;
                float pressure = (L + R + B + T - divergence) * 0.25;
                gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
            }
        "),w=X(e.FRAGMENT_SHADER,"
            precision highp float;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uVelocity;
            vec2 boundary (in vec2 uv) { uv = min(max(uv, 0.0), 1.0); return uv; }
            void main () {
                float L = texture2D(uPressure, boundary(vL)).x;
                float R = texture2D(uPressure, boundary(vR)).x;
                float T = texture2D(uPressure, boundary(vT)).x;
                float B = texture2D(uPressure, boundary(vB)).x;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity.xy -= vec2(R - L, T - B);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        "),_=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),function(t){e.bindFramebuffer(e.FRAMEBUFFER,t),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)}),L=new E(h,T),F=new E(h,p),U=new E(h,y),B=new E(h,t.supportLinearFiltering?R:x),I=new E(h,b),P=new E(h,S),C=new E(h,A),M=new E(h,D),O=new E(h,w);V(),v=Date.now(),f=Date.now(),m.addEventListener("mouseenter",e=>{r[0].down=!0,r[0].moved=!1,r[0].x=e.offsetX,r[0].y=e.offsetY,r[0].dx=0,r[0].dy=0}),m.addEventListener("mousemove",e=>{r[0].moved=r[0].down,r[0].dx=2*(e.offsetX-r[0].x),r[0].dy=2*(e.offsetY-r[0].y),r[0].x=e.offsetX,r[0].y=e.offsetY}),m.addEventListener("mouseleave",()=>{r[0].down=!1,r[0].moved=!1}),m.addEventListener("touchmove",function(e){e.preventDefault();for(var t=e.targetTouches,n=0;n<t.length;n++){var i=r[n];i.moved=i.down,i.dx=2*(t[n].pageX-i.x),i.dy=2*(t[n].pageY-i.y),i.x=t[n].pageX,i.y=t[n].pageY}},!1),m.addEventListener("touchstart",function(e){e.preventDefault();for(var t=e.targetTouches,n=0;n<t.length;n++)n>=r.length&&r.push(new N),r[n].id=t[n].identifier,r[n].down=!0,r[n].x=t[n].pageX,r[n].y=t[n].pageY}),window.addEventListener("touchend",function(e){for(var t=e.changedTouches,n=0;n<t.length;n++)for(var i=0;i<r.length;i++)t[n].identifier==r[i].id&&(r[i].down=!1)}),window.addEventListener("resize",function(){m.width=window.innerWidth,m.height=window.innerHeight,V()}),d=requestAnimationFrame(function t(){m.width==m.clientWidth&&m.height==m.clientHeight||(m.width=m.clientWidth,m.height=m.clientHeight,V());var i=Date.now(),g=Math.min((i-v)/1e3,.016);if(v=i,e.viewport(0,0,o,a),r.every(e=>!e.down)){var E=.001*i,h=.01*Math.sin(.5*E),p=.01*Math.cos(.3*E);k(.5*m.width,.5*m.height,h,p)}B.bind(),e.uniform2f(B.uniforms.texelSize,1/o,1/a),e.uniform1i(B.uniforms.uVelocity,s.read[2]),e.uniform1i(B.uniforms.uSource,s.read[2]),e.uniform1f(B.uniforms.dt,g),e.uniform1f(B.uniforms.dissipation,n.VELOCITY_DISSIPATION),_(s.write[1]),s.swap();for(var T=0;T<r.length;T++){var y=r[T];y.moved&&(k(y.x,y.y,.3*y.dx,.3*y.dy),y.moved=!1)}P.bind(),e.uniform2f(P.uniforms.texelSize,1/o,1/a),e.uniform1i(P.uniforms.uVelocity,s.read[2]),_(c[1]),C.bind(),e.uniform2f(C.uniforms.texelSize,1/o,1/a),e.uniform1i(C.uniforms.uVelocity,s.read[2]),e.uniform1i(C.uniforms.uCurl,c[2]),e.uniform1f(C.uniforms.curl,n.CURL),e.uniform1f(C.uniforms.dt,g),_(s.write[1]),s.swap(),I.bind(),e.uniform2f(I.uniforms.texelSize,1/o,1/a),e.uniform1i(I.uniforms.uVelocity,s.read[2]),_(u[1]),L.bind();var x=l.read[2];e.activeTexture(e.TEXTURE0+x),e.bindTexture(e.TEXTURE_2D,l.read[0]),e.uniform1i(L.uniforms.uTexture,x),e.uniform1f(L.uniforms.value,n.PRESSURE_DISSIPATION),_(l.write[1]),l.swap(),M.bind(),e.uniform2f(M.uniforms.texelSize,1/o,1/a),e.uniform1i(M.uniforms.uDivergence,u[2]),x=l.read[2],e.uniform1i(M.uniforms.uPressure,x),e.activeTexture(e.TEXTURE0+x);for(var R=0;R<n.PRESSURE_ITERATIONS;R++)e.bindTexture(e.TEXTURE_2D,l.read[0]),_(l.write[1]),l.swap();O.bind(),e.uniform2f(O.uniforms.texelSize,1/o,1/a),e.uniform1i(O.uniforms.uPressure,l.read[2]),e.uniform1i(O.uniforms.uVelocity,s.read[2]),_(s.write[1]),s.swap(),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),F.bind(),e.activeTexture(e.TEXTURE0+s.read[2]),e.bindTexture(e.TEXTURE_2D,s.read[0]),e.uniform1i(F.uniforms.uVelocity,s.read[2]),e.uniform1f(F.uniforms.uTime,i-f),e.uniform1f(F.uniforms.uDistortionIntensity,n.DISTORTION_INTENSITY),e.uniform1f(F.uniforms.uBlobSoftness,n.BLOB_SOFTNESS),e.uniform2f(F.uniforms.uResolution,m.width,m.height),_(null),d=requestAnimationFrame(t)})}function N(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[.5,.5,.5]}function X(t,n){var r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw e.getShaderInfoLog(r);return r}function V(){o=e.drawingBufferWidth>>n.TEXTURE_DOWNSAMPLE,a=e.drawingBufferHeight>>n.TEXTURE_DOWNSAMPLE;var r=t.halfFloatTexType,i=(t.formatRGBA,t.formatRG),v=t.formatR;s=H(0,o,a,i.internalFormat,i.format,r,t.supportLinearFiltering?e.LINEAR:e.NEAREST),u=G(4,o,a,v.internalFormat,v.format,r,e.NEAREST),c=G(5,o,a,v.internalFormat,v.format,r,e.NEAREST),l=H(6,o,a,v.internalFormat,v.format,r,e.NEAREST)}function G(t,n,r,i,o,a,s){e.activeTexture(e.TEXTURE0+t);var u=e.createTexture();e.bindTexture(e.TEXTURE_2D,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,n,r,0,o,a,null);var c=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,c),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,u,0),e.viewport(0,0,n,r),e.clear(e.COLOR_BUFFER_BIT),[u,c,t]}function H(e,t,n,r,i,o,a){var s=G(e,t,n,r,i,o,a),u=G(e+1,t,n,r,i,o,a);return{get read(){return s},get write(){return u},swap:function(){var e=s;s=u,u=e}}}function k(t,r,i,o){U.bind(),e.uniform1i(U.uniforms.uTarget,s.read[2]),e.uniform1f(U.uniforms.aspectRatio,m.width/m.height),e.uniform2f(U.uniforms.point,t/m.width,1-r/m.height),e.uniform3f(U.uniforms.color,i,-o,1),e.uniform1f(U.uniforms.radius,n.SPLAT_RADIUS),_(s.write[1]),s.swap()}}function E(e,t,n=200,r=12,i=50){const o=document.getElementById(e),a=document.querySelectorAll(`#${t} .line`);if(!o||!a.length)return;let s=`M0,6 Q${n/2},6 ${n},6`,u=!0;function c(e,t){const c=o.getBoundingClientRect();if(e>=c.left&&e<=c.right&&t>=c.top&&t<=c.bottom){u=!1;const o=e-c.left,l=c.width,v=Math.min(1,Math.max(0,o/l))*n,f=r/2,m=t-c.top;if(Math.abs(m-f)<i){const e=`M0,${f} Q${v},${m} ${n},${f}`;a.forEach(t=>t.setAttribute("d",e))}else a[0].getAttribute("d")!==s&&(TweenMax.to(a[0],.3,{attr:{d:s},ease:Power2.easeOut}),TweenMax.to(a[1],.3,{attr:{d:s},ease:Power2.easeOut}))}else u||(u=!0,TweenMax.to(a[0],.5,{attr:{d:s},ease:Elastic.easeOut.config(1,.3)}),TweenMax.to(a[1],.5,{attr:{d:s},ease:Elastic.easeOut.config(1,.3)}))}document.addEventListener("mousemove",e=>c(e.clientX,e.clientY)),document.addEventListener("touchmove",e=>{e.touches.length&&c(e.touches[0].clientX,e.touches[0].clientY)}),document.addEventListener("touchend",()=>c(-1e3,-1e3))}let h=null;window.__currentTheme={init:function(){console.log("Dark theme init"),g(),function(){const e=document.querySelector(".image-container"),t=document.getElementById("prev"),n=document.getElementById("next");if(e&&t&&n){const a=Array.from(e.querySelectorAll("span")),s=a.length;if(0===s)return;const u=e.offsetWidth||300,c=360/s,l=Math.round(u/2/Math.tan(Math.PI/s)*1.5);a.forEach((e,t)=>{e.style.width=u+"px",e.style.height=u+"px",e.style.transform=`rotateY(${t*c}deg) translateZ(${l}px)`});let v=0;function f(t){v=(t%s+s)%s,e.style.transform=`rotateY(${-v*c}deg)`,a.forEach((e,t)=>e.classList.toggle("face-active",t===v))}f(0),t.addEventListener("click",()=>f(v-1)),n.addEventListener("click",()=>f(v+1));let m=0;e.addEventListener("touchstart",e=>{m=e.touches[0].clientX},{passive:!0}),e.addEventListener("touchend",e=>{const t=m-e.changedTouches[0].clientX;Math.abs(t)>40&&f(t>0?v+1:v-1)},{passive:!0})}const r=document.querySelector(".instagram-gallery");r&&r.querySelectorAll(".instagram-img-c").forEach(e=>{e.addEventListener("click",function(){if(this.classList.contains("active"))return;const e=this.offsetWidth,t=this.offsetHeight,n=this.getBoundingClientRect().left+window.scrollX,r=this.getBoundingClientRect().top+window.scrollY;document.querySelectorAll(".instagram-img-c.active").forEach(e=>{e.classList.remove("active"),e.classList.add("postactive"),setTimeout(()=>{e.classList.contains("postactive")&&e.classList.remove("postactive")},500)});const i=this.cloneNode(!0);i.style.width=e+"px",i.style.height=t+"px",i.style.position="fixed",i.style.top=r+"px",i.style.left=n+"px",i.classList.add("active"),document.body.appendChild(i),setTimeout(()=>{i.classList.add("positioned"),i.style.width="100%",i.style.height="100%",i.style.top="0",i.style.left="0",i.style.transition="all ease 400ms"},0),i.addEventListener("click",function(e){(e.target===this||e.target.closest(".instagram-img-w"))&&(this.classList.remove("positioned","active"),this.classList.add("postactive"),setTimeout(()=>{this.remove()},500))})})});document.querySelectorAll("video").forEach(e=>{e.addEventListener("mouseenter",()=>{e.play()}),e.addEventListener("mouseleave",()=>{e.pause(),e.currentTime=0}),e.addEventListener("touchstart",()=>{e.play()}),e.addEventListener("touchend",()=>{e.pause(),e.currentTime=0})});const i=document.getElementById("new-contact-form");i&&!i.dataset.listenerAttached&&(i.dataset.listenerAttached="true",i.addEventListener("submit",function(e){e.preventDefault();const t=document.querySelector('input[name="name"]').value,n=document.querySelector('input[name="email"]').value,r=document.querySelector('textarea[name="message"]').value;if(!t||!n||!r)return void alert("Please fill in all required fields");const i=new FormData(this);fetch(this.action,{method:"POST",body:i,headers:{Accept:"application/json"}}).then(e=>{e.ok?(alert("Thank you for your message! I will get back to you soon."),this.reset(),document.querySelectorAll(".floating-label-group select").forEach(e=>e.selectedIndex=0)):alert("There was an error sending your message. Please try again.")}).catch(e=>{console.error("Error:",e),alert("There was an error sending your message. Please try again.")})})),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(e){e.preventDefault();const t=this.getAttribute("href");if("#"===t)return;const n=document.querySelector(t);n&&window.scrollTo({top:n.offsetTop-80,behavior:"smooth"})})}),window.addEventListener("scroll",()=>{let e="";document.querySelectorAll("section[id], div[id='home']").forEach(t=>{const n=t.offsetTop;window.scrollY>=n-150&&(e=t.getAttribute("id"))}),document.querySelectorAll(".nav a").forEach(t=>{const n=t.getAttribute("href");if(n&&n.startsWith("#")){const r=n.substring(1);t.classList.toggle("active",r===e)}})}),document.querySelectorAll(".nav a, .btn, .contact-btn, .instagram-img-c, .animation-card, .portfolio-card, .dev-item, .footer a").forEach(e=>{e.addEventListener("mousedown",function(e){e.stopPropagation()}),e.addEventListener("touchstart",function(e){e.stopPropagation()})});const o=document.createElement("style");o.textContent="
            .instagram-img-c.active {
                position: fixed !important;
                z-index: 1000 !important;
                cursor: zoom-out !important;
            }
            .instagram-img-c.positioned {
                width: 100% !important;
                height: 100% !important;
                top: 0 !important;
                left: 0 !important;
                border-radius: 0 !important;
                border: none !important;
            }
            .instagram-img-c.postactive {
                opacity: 0;
                transform: scale(0.8);
            }
            .touch-active {
                transform: scale(0.98) !important;
                opacity: 0.9 !important;
            }
            @media (hover: none) and (pointer: coarse) {
                .btn:active, .contact-btn:active,
                .instagram-img-c:active, .animation-card:active, .portfolio-card:active, .dev-item:active {
                    transform: scale(0.98) !important;
                    transition: transform 0.1s ease !important;
                }
                #fluidCanvas {
                    -webkit-transform: translateZ(0);
                    transform: translateZ(0);
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                }
            }
        ",document.head.appendChild(o)}(),E("emailWrapper","elasticLineEmail"),E("btnWrapper","elasticLineBtn"),function(){const e=document.querySelector(".contact-section");e&&new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add("visible")})},{threshold:.2}).observe(e)}(),h=function(){if(window.innerWidth>=768)return null;const e=document.querySelector(".nav ul"),t=document.querySelectorAll("
            .section-title, .bio-text p, .bio-image,
            .animation-card, .portfolio-card, .dev-item,
            .instagram-img-c, .contact-left h2, .contact-left p,
            .contact-email-wrapper, .contact-form-container,
            .main-name, .signature, .tagline
        ");t.forEach(e=>e.classList.add("animate-mobile"));const n=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("visible"),n.unobserve(e.target))})},{threshold:.15,rootMargin:"0px 0px -30px 0px"});return t.forEach(e=>n.observe(e)),()=>{e&&e.classList.remove("show"),n.disconnect(),t.forEach(e=>{e.classList.remove("animate-mobile","visible")})}}(),function(){const e=(e,t)=>{e.addEventListener("click",n=>{n.preventDefault(),t.classList.toggle("open"),e.classList.toggle("open")})},t=document.getElementById("pricingToggle"),n=document.getElementById("pricingDrawer");if(t&&n)return void e(t,n);const r=new MutationObserver((t,n)=>{const r=document.getElementById("pricingToggle"),i=document.getElementById("pricingDrawer");r&&i&&(e(r,i),n.disconnect())});r.observe(document.body,{childList:!0,subtree:!0}),setTimeout(()=>r.disconnect(),5e3)}(),document.querySelectorAll(".yt-thumb").forEach(function(e){e.addEventListener("click",function(){var t=e.dataset.id,n=document.createElement("iframe");n.src="https://www.youtube-nocookie.com/embed/"+t+"?autoplay=1&rel=0&modestbranding=1&playsinline=1",n.allow="autoplay; fullscreen",n.allowFullscreen=!0,n.style.position="absolute",n.style.inset="0",n.style.width="100%",n.style.height="100%",n.style.border="none",e.innerHTML="",e.appendChild(n)})})},destroy:function(){console.log("Dark theme destroy"),d&&(cancelAnimationFrame(d),d=null),h&&h()}}}();
