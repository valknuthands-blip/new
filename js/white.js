// (c) 2026 Vivash Singh - All Rights Reserved!function(){"use strict";let e=document.getElementById("fluidCanvas"),t=null,n=[];function i(){if(!e)return;const i=document.getElementById("noiseOverlay"),r=document.getElementById("zoneCenter"),o=document.getElementById("zoneNav"),a=document.getElementById("zoneContent");let u,c="ontouchstart"in window||navigator.maxTouchPoints>0,l=c?2:1;function s(){let t=Me(e.clientWidth),n=Me(e.clientHeight);return(e.width!=t||e.height!=n)&&(e.width=t,e.height=n,!0)}let m={SIM_RESOLUTION:64,DYE_RESOLUTION:512,CAPTURE_RESOLUTION:256,DENSITY_DISSIPATION:1.5,VELOCITY_DISSIPATION:.3,PRESSURE:.02,PRESSURE_ITERATIONS:10,CURL:.5,SPLAT_RADIUS:.06,SPLAT_FORCE:3e3,SHADING:!1,COLORFUL:!0,COLOR_UPDATE_SPEED:5,PAUSED:!1,BACK_COLOR:{r:255,g:255,b:255},TRANSPARENT:!1,BLOOM:!1,BLOOM_ITERATIONS:4,BLOOM_RESOLUTION:128,BLOOM_INTENSITY:.4,BLOOM_THRESHOLD:.4,BLOOM_SOFT_KNEE:.5,SUNRAYS:!1,SUNRAYS_RESOLUTION:128,SUNRAYS_WEIGHT:.5};function f(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=Ne()}let v=[],d=[];v.push(new f),s();const{gl:h,ext:g}=function(e){const t={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let n=e.getContext("webgl2",t);const i=!!n;i||(n=e.getContext("webgl",t)||e.getContext("experimental-webgl",t));let r,o;i?(n.getExtension("EXT_color_buffer_float"),o=n.getExtension("OES_texture_float_linear")):(r=n.getExtension("OES_texture_half_float"),o=n.getExtension("OES_texture_half_float_linear"));n.clearColor(1,1,1,1);const a=i?n.HALF_FLOAT:r.HALF_FLOAT_OES;let u,c,l;i?(u=x(n,n.RGBA16F,n.RGBA,a),c=x(n,n.RG16F,n.RG,a),l=x(n,n.R16F,n.RED,a)):(u=x(n,n.RGBA,n.RGBA,a),c=x(n,n.RGBA,n.RGBA,a),l=x(n,n.RGBA,n.RGBA,a));return{gl:n,ext:{formatRGBA:u,formatRG:c,formatR:l,halfFloatTexType:a,supportLinearFiltering:o}}}(e);function p(e,t){return[r,o,a].some(n=>{const i=n.getBoundingClientRect();return e>=i.left&&e<=i.right&&t>=i.top&&t<=i.bottom})}function E(){i&&(i.classList.add("active"),u&&clearTimeout(u))}function T(){i&&(u=setTimeout(()=>{i.classList.remove("active")},300))}function x(e,t,n,i){if(!function(e,t,n,i){let r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,t,4,4,0,n,i,null);let o=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0);let a=e.checkFramebufferStatus(e.FRAMEBUFFER);return a==e.FRAMEBUFFER_COMPLETE}(e,t,n,i))switch(t){case e.R16F:return x(e,e.RG16F,e.RG,i);case e.RG16F:return x(e,e.RGBA16F,e.RGBA,i);default:return null}return{internalFormat:t,format:n}}/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)&&(m.DYE_RESOLUTION=256,m.SPLAT_RADIUS=.08,m.SPLAT_FORCE=4e3),g.supportLinearFiltering||(m.DYE_RESOLUTION=256,m.SHADING=!1,m.BLOOM=!1,m.SUNRAYS=!1),function(){if("undefined"!=typeof dat){var e=new dat.GUI({width:180});e.add({fun:()=>{d.push(parseInt(10*Math.random())+2)}},"fun").name("Random Splats"),e.close()}}();class R{constructor(e,t){this.uniforms={},this.program=y(e,t),this.uniforms=S(this.program)}bind(){h.useProgram(this.program)}}function y(e,t){let n=h.createProgram();return h.attachShader(n,e),h.attachShader(n,t),h.linkProgram(n),h.getProgramParameter(n,h.LINK_STATUS)||console.trace(h.getProgramInfoLog(n)),n}function S(e){let t=[],n=h.getProgramParameter(e,h.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){let n=h.getActiveUniform(e,i).name;t[n]=h.getUniformLocation(e,n)}return t}function D(e,t,n){t=function(e,t){if(null==t)return e;let n="";return t.forEach(e=>{n+="#define "+e+"
"}),n+e}(t,n);const i=h.createShader(e);return h.shaderSource(i,t),h.compileShader(i),h.getShaderParameter(i,h.COMPILE_STATUS)||console.trace(h.getShaderInfoLog(i)),i}const A=D(h.VERTEX_SHADER,"
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
        "),L=D(h.VERTEX_SHADER,"
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            uniform vec2 texelSize;
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                float offset = 1.33333333;
                vL = vUv - texelSize * offset;
                vR = vUv + texelSize * offset;
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        "),_=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            uniform sampler2D uTexture;
            void main () {
                vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
                sum += texture2D(uTexture, vL) * 0.35294117;
                sum += texture2D(uTexture, vR) * 0.35294117;
                gl_FragColor = sum;
            }
        "),w=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            uniform sampler2D uTexture;
            void main () {
                gl_FragColor = texture2D(uTexture, vUv);
            }
        "),b=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            uniform sampler2D uTexture;
            uniform float value;
            void main () {
                gl_FragColor = value * texture2D(uTexture, vUv);
            }
        "),U=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            uniform vec4 color;
            void main () {
                gl_FragColor = color;
            }
        "),F=D(h.FRAGMENT_SHADER,"
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform float aspectRatio;
            #define SCALE 25.0
            void main () {
                vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
                float v = mod(uv.x + uv.y, 2.0);
                v = v * 0.1 + 0.8;
                gl_FragColor = vec4(vec3(v), 1.0);
            }
        "),O=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform vec3 curve;
            uniform float threshold;
            void main () {
                vec3 c = texture2D(uTexture, vUv).rgb;
                float br = max(c.r, max(c.g, c.b));
                float rq = clamp(br - curve.x, 0.0, curve.y);
                rq = curve.z * rq * rq;
                c *= max(rq, br - threshold) / max(br, 0.0001);
                gl_FragColor = vec4(c, 0.0);
            }
        "),B=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uTexture;
            void main () {
                vec4 sum = vec4(0.0);
                sum += texture2D(uTexture, vL);
                sum += texture2D(uTexture, vR);
                sum += texture2D(uTexture, vT);
                sum += texture2D(uTexture, vB);
                sum *= 0.25;
                gl_FragColor = sum;
            }
        "),I=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uTexture;
            uniform float intensity;
            void main () {
                vec4 sum = vec4(0.0);
                sum += texture2D(uTexture, vL);
                sum += texture2D(uTexture, vR);
                sum += texture2D(uTexture, vT);
                sum += texture2D(uTexture, vB);
                sum *= 0.25;
                gl_FragColor = sum * intensity;
            }
        "),N=D(h.FRAGMENT_SHADER,"
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            void main () {
                vec4 c = texture2D(uTexture, vUv);
                float br = max(c.r, max(c.g, c.b));
                c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
                gl_FragColor = c;
            }
        "),P=D(h.FRAGMENT_SHADER,"
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform float weight;
            #define ITERATIONS 16
            void main () {
                float Density = 0.3;
                float Decay = 0.95;
                float Exposure = 0.7;
                vec2 coord = vUv;
                vec2 dir = vUv - 0.5;
                dir *= 1.0 / float(ITERATIONS) * Density;
                float illuminationDecay = 1.0;
                float color = texture2D(uTexture, vUv).a;
                for (int i = 0; i < ITERATIONS; i++) {
                    coord -= dir;
                    float col = texture2D(uTexture, coord).a;
                    color += col * illuminationDecay * weight;
                    illuminationDecay *= Decay;
                }
                gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
            }
        "),M=D(h.FRAGMENT_SHADER,"
            precision highp float;
            precision highp sampler2D;
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
        "),C=D(h.FRAGMENT_SHADER,"
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform vec2 dyeTexelSize;
            uniform float dt;
            uniform float dissipation;
            vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
                vec2 st = uv / tsize - 0.5;
                vec2 iuv = floor(st);
                vec2 fuv = fract(st);
                vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
                vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
                vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
                vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
                return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
            }
            void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
                float decay = 1.0 + dissipation * dt;
                gl_FragColor = result / decay;
            }",g.supportLinearFiltering?null:["MANUAL_FILTERING"]),X=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).x;
                float R = texture2D(uVelocity, vR).x;
                float T = texture2D(uVelocity, vT).y;
                float B = texture2D(uVelocity, vB).y;
                vec2 C = texture2D(uVelocity, vUv).xy;
                if (vL.x < 0.0) { L = -C.x; }
                if (vR.x > 1.0) { R = -C.x; }
                if (vT.y > 1.0) { T = -C.y; }
                if (vB.y < 0.0) { B = -C.y; }
                float div = 0.5 * (R - L + T - B);
                gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
            }
        "),z=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).y;
                float R = texture2D(uVelocity, vR).y;
                float T = texture2D(uVelocity, vT).x;
                float B = texture2D(uVelocity, vB).x;
                float vorticity = R - L - T + B;
                gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
            }
        "),Y=D(h.FRAGMENT_SHADER,"
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;
            uniform sampler2D uCurl;
            uniform float curl;
            uniform float dt;
            void main () {
                float L = texture2D(uCurl, vL).x;
                float R = texture2D(uCurl, vR).x;
                float T = texture2D(uCurl, vT).x;
                float B = texture2D(uCurl, vB).x;
                float C = texture2D(uCurl, vUv).x;
                vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                force /= length(force) + 0.0001;
                force *= curl * C;
                force.y *= -1.0;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity += force * dt;
                velocity = min(max(velocity, -1000.0), 1000.0);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        "),G=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uDivergence;
            void main () {
                float L = texture2D(uPressure, vL).x;
                float R = texture2D(uPressure, vR).x;
                float T = texture2D(uPressure, vT).x;
                float B = texture2D(uPressure, vB).x;
                float C = texture2D(uPressure, vUv).x;
                float divergence = texture2D(uDivergence, vUv).x;
                float pressure = (L + R + B + T - divergence) * 0.25;
                gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
            }
        "),H=D(h.FRAGMENT_SHADER,"
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uPressure, vL).x;
                float R = texture2D(uPressure, vR).x;
                float T = texture2D(uPressure, vT).x;
                float B = texture2D(uPressure, vB).x;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity.xy -= vec2(R - L, T - B);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        "),V=(h.bindBuffer(h.ARRAY_BUFFER,h.createBuffer()),h.bufferData(h.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),h.STATIC_DRAW),h.bindBuffer(h.ELEMENT_ARRAY_BUFFER,h.createBuffer()),h.bufferData(h.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),h.STATIC_DRAW),h.vertexAttribPointer(0,2,h.FLOAT,!1,0,0),h.enableVertexAttribArray(0),(e,t=!1)=>{null==e?(h.viewport(0,0,h.drawingBufferWidth,h.drawingBufferHeight),h.bindFramebuffer(h.FRAMEBUFFER,null)):(h.viewport(0,0,e.width,e.height),h.bindFramebuffer(h.FRAMEBUFFER,e.fbo)),t&&(h.clearColor(0,0,0,1),h.clear(h.COLOR_BUFFER_BIT)),h.drawElements(h.TRIANGLES,6,h.UNSIGNED_SHORT,0)});let q,W,k,$,K,Z,Q,j,J=[],ee=function(e){let t=h.createTexture();h.bindTexture(h.TEXTURE_2D,t),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MIN_FILTER,h.LINEAR),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MAG_FILTER,h.LINEAR),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_S,h.REPEAT),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_T,h.REPEAT),h.texImage2D(h.TEXTURE_2D,0,h.RGB,1,1,0,h.RGB,h.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let n={texture:t,width:1,height:1,attach:e=>(h.activeTexture(h.TEXTURE0+e),h.bindTexture(h.TEXTURE_2D,t),e)},i=new Image;return i.onload=()=>{n.width=i.width,n.height=i.height,h.bindTexture(h.TEXTURE_2D,t),h.texImage2D(h.TEXTURE_2D,0,h.RGB,h.RGB,h.UNSIGNED_BYTE,i)},i.src=e,n}("https://raw.githubusercontent.com/PavelDoGreat/WebGL-Fluid-Simulation/master/textures/LDR_LLL1_0.png");const te=new R(L,_),ne=new R(A,w),ie=new R(A,b),re=new R(A,U),oe=new R(A,F),ae=new R(A,O),ue=new R(A,B),ce=new R(A,I),le=new R(A,N),se=new R(A,P),me=new R(A,M),fe=new R(A,C),ve=new R(A,X),de=new R(A,z),he=new R(A,Y),ge=new R(A,G),pe=new R(A,H),Ee=new class{constructor(e,t){this.vertexShader=e,this.fragmentShaderSource=t,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(e){let t=0;for(let n=0;n<e.length;n++)t+=Ce(e[n]);let n=this.programs[t];if(null==n){let i=D(h.FRAGMENT_SHADER,this.fragmentShaderSource,e);n=y(this.vertexShader,i),this.programs[t]=n}n!=this.activeProgram&&(this.uniforms=S(n),this.activeProgram=n)}bind(){h.useProgram(this.activeProgram)}}(A,"
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uTexture;
            uniform sampler2D uBloom;
            uniform sampler2D uSunrays;
            uniform sampler2D uDithering;
            uniform vec2 ditherScale;
            uniform vec2 texelSize;
            vec3 linearToGamma (vec3 color) {
                color = max(color, vec3(0));
                return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
            }
            void main () {
                vec3 c = texture2D(uTexture, vUv).rgb;
            #ifdef SHADING
                vec3 lc = texture2D(uTexture, vL).rgb;
                vec3 rc = texture2D(uTexture, vR).rgb;
                vec3 tc = texture2D(uTexture, vT).rgb;
                vec3 bc = texture2D(uTexture, vB).rgb;
                float dx = length(rc) - length(lc);
                float dy = length(tc) - length(bc);
                vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                vec3 l = vec3(0.0, 0.0, 1.0);
                float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                c *= diffuse;
            #endif
            #ifdef BLOOM
                vec3 bloom = texture2D(uBloom, vUv).rgb;
            #endif
            #ifdef SUNRAYS
                float sunrays = texture2D(uSunrays, vUv).r;
                c *= sunrays;
            #ifdef BLOOM
                bloom *= sunrays;
            #endif
            #endif
            #ifdef BLOOM
                float noise = texture2D(uDithering, vUv * ditherScale).r;
                noise = noise * 2.0 - 1.0;
                bloom += noise / 255.0;
                bloom = linearToGamma(bloom);
                c += bloom;
            #endif
                float a = max(c.r, max(c.g, c.b));
                gl_FragColor = vec4(c, a);
            }
        ");function Te(){let e=Pe(m.SIM_RESOLUTION),t=Pe(m.DYE_RESOLUTION);const n=g.halfFloatTexType,i=g.formatRGBA,r=g.formatRG,o=g.formatR,a=g.supportLinearFiltering?h.LINEAR:h.NEAREST;h.disable(h.BLEND),q=null==q?Re(t.width,t.height,i.internalFormat,i.format,n,a):ye(q,t.width,t.height,i.internalFormat,i.format,n,a),W=null==W?Re(e.width,e.height,r.internalFormat,r.format,n,a):ye(W,e.width,e.height,r.internalFormat,r.format,n,a),k=xe(e.width,e.height,o.internalFormat,o.format,n,h.NEAREST),$=xe(e.width,e.height,o.internalFormat,o.format,n,h.NEAREST),K=Re(e.width,e.height,o.internalFormat,o.format,n,h.NEAREST),function(){let e=Pe(m.BLOOM_RESOLUTION);const t=g.halfFloatTexType,n=g.formatRGBA,i=g.supportLinearFiltering?h.LINEAR:h.NEAREST;Z=xe(e.width,e.height,n.internalFormat,n.format,t,i),J.length=0;for(let r=0;r<m.BLOOM_ITERATIONS;r++){let o=e.width>>r+1,a=e.height>>r+1;if(o<2||a<2)break;let u=xe(o,a,n.internalFormat,n.format,t,i);J.push(u)}}(),function(){let e=Pe(m.SUNRAYS_RESOLUTION);const t=g.halfFloatTexType,n=g.formatR,i=g.supportLinearFiltering?h.LINEAR:h.NEAREST;Q=xe(e.width,e.height,n.internalFormat,n.format,t,i),j=xe(e.width,e.height,n.internalFormat,n.format,t,i)}()}function xe(e,t,n,i,r,o){h.activeTexture(h.TEXTURE0);let a=h.createTexture();h.bindTexture(h.TEXTURE_2D,a),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MIN_FILTER,o),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MAG_FILTER,o),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_S,h.CLAMP_TO_EDGE),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_T,h.CLAMP_TO_EDGE),h.texImage2D(h.TEXTURE_2D,0,n,e,t,0,i,r,null);let u=h.createFramebuffer();return h.bindFramebuffer(h.FRAMEBUFFER,u),h.framebufferTexture2D(h.FRAMEBUFFER,h.COLOR_ATTACHMENT0,h.TEXTURE_2D,a,0),h.viewport(0,0,e,t),h.clear(h.COLOR_BUFFER_BIT),{texture:a,fbo:u,width:e,height:t,texelSizeX:1/e,texelSizeY:1/t,attach:e=>(h.activeTexture(h.TEXTURE0+e),h.bindTexture(h.TEXTURE_2D,a),e)}}function Re(e,t,n,i,r,o){let a=xe(e,t,n,i,r,o),u=xe(e,t,n,i,r,o);return{width:e,height:t,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,get read(){return a},set read(e){a=e},get write(){return u},set write(e){u=e},swap(){let e=a;a=u,u=e}}}function ye(e,t,n,i,r,o,a){return e.width==t&&e.height==n||(e.read=function(e,t,n,i,r,o,a){let u=xe(t,n,i,r,o,a);return ne.bind(),h.uniform1i(ne.uniforms.uTexture,e.attach(0)),V(u),u}(e.read,t,n,i,r,o,a),e.write=xe(t,n,i,r,o,a),e.width=t,e.height=n,e.texelSizeX=1/t,e.texelSizeY=1/n),e}!function(){let e=[];m.SHADING&&e.push("SHADING"),m.BLOOM&&e.push("BLOOM"),m.SUNRAYS&&e.push("SUNRAYS"),Ee.setKeywords(e)}(),Te(),Le(parseInt(5*Math.random())+2);let Se=Date.now(),De=0;function Ae(e){let t=c?l:1,n=e.deltaX*m.SPLAT_FORCE*t,i=e.deltaY*m.SPLAT_FORCE*t;_e(e.texcoordX,e.texcoordY,n,i,e.color)}function Le(e){for(let t=0;t<e;t++){const e=Ne();e.r*=5,e.g*=5,e.b*=5;const t=Math.random(),n=Math.random(),i=c?1.2:1;_e(t,n,500*(Math.random()-.5)*i,500*(Math.random()-.5)*i,e)}}function _e(t,n,i,r,o){let a=c?1.2:1;me.bind(),h.uniform1i(me.uniforms.uTarget,W.read.attach(0)),h.uniform1f(me.uniforms.aspectRatio,e.width/e.height),h.uniform2f(me.uniforms.point,t,n),h.uniform3f(me.uniforms.color,i,r,0),h.uniform1f(me.uniforms.radius,function(t){let n=e.width/e.height;n>1&&(t*=n);return t}(m.SPLAT_RADIUS/100*a)),V(W.write),W.swap(),h.uniform1i(me.uniforms.uTarget,q.read.attach(0)),h.uniform3f(me.uniforms.color,o.r,o.g,o.b),V(q.write),q.swap()}function we(e,t,i,r){e.addEventListener(t,i,r),n.push({element:e,type:t,listener:i,options:r})}let be=!1;function Ue(e){const t=e.changedTouches;for(let e=0;e<t.length;e++){let n=v.find(n=>n.id==t[e].identifier);null!=n&&Ie(n)}T()}function Fe(e){"KeyP"===e.code&&(m.PAUSED=!m.PAUSED)," "===e.key&&d.push(parseInt(5*Math.random())+1)}function Oe(t,n,i,r){t.id=n,t.down=!0,t.moved=!1,t.texcoordX=i/e.width,t.texcoordY=1-r/e.height,t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.deltaX=0,t.deltaY=0,t.color=Ne()}function Be(t,n,i){t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.texcoordX=n/e.width,t.texcoordY=1-i/e.height,t.deltaX=function(t){let n=e.width/e.height;n<1&&(t*=n);return t}(t.texcoordX-t.prevTexcoordX),t.deltaY=function(t){let n=e.width/e.height;n>1&&(t/=n);return t}(t.texcoordY-t.prevTexcoordY),t.moved=Math.abs(t.deltaX)>0||Math.abs(t.deltaY)>0}function Ie(e){e.down=!1}function Ne(){if(window.generateRandomColor)return window.generateRandomColor();const e=[{r:0,g:0,b:0},{r:.533,g:.6,b:.98}];return e[Math.floor(Math.random()*e.length)]}function Pe(e){let t=h.drawingBufferWidth/h.drawingBufferHeight;t<1&&(t=1/t);let n=Math.round(e),i=Math.round(e*t);return h.drawingBufferWidth>h.drawingBufferHeight?{width:i,height:n}:{width:n,height:i}}function Me(e){let t=window.devicePixelRatio||1;return Math.floor(e*t)}function Ce(e){if(0==e.length)return 0;let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0;return t}function Xe(){s(),Te()}we(e,"mouseenter",function(e){be=!0}),we(e,"mouseleave",function(e){be=!1,v[0].down=!1,v[0].moved=!1}),we(e,"mousemove",function(t){let n=v[0];if(!be)return;n.down=!0;let i=e.getBoundingClientRect();Be(n,Me(t.clientX-i.left),Me(t.clientY-i.top)),p(t.clientX,t.clientY)?E():T()}),we(e,"touchstart",function(t){const n=t.targetTouches;for(;n.length>=v.length;)v.push(new f);for(let t=0;t<n.length;t++){let i=n[t],r=e.getBoundingClientRect(),o=Me(i.clientX-r.left),a=Me(i.clientY-r.top);Oe(v[t+1],i.identifier,o,a);let u=v[t+1];u.down&&Ae(u),p(i.clientX,i.clientY)&&E()}},{passive:!0}),we(e,"touchmove",function(t){const n=t.targetTouches;for(let t=0;t<n.length;t++){let i=n[t],r=v[t+1];if(!r)continue;let o=e.getBoundingClientRect();Be(r,Me(i.clientX-o.left),Me(i.clientY-o.top)),r.down&&r.moved&&Ae(r),p(i.clientX,i.clientY)&&E()}},{passive:!0}),we(e,"touchend",Ue),window.addEventListener("touchend",Ue),window.addEventListener("keydown",Fe),n.push({element:window,type:"keydown",listener:Fe}),window.addEventListener("resize",Xe),n.push({element:window,type:"resize",listener:Xe});[r,o,a].forEach(e=>{if(e){function t(){E()}function i(){T()}e.addEventListener("mouseenter",t),e.addEventListener("mouseleave",i),e.addEventListener("touchstart",t),e.addEventListener("touchend",i),n.push({element:e,type:"mouseenter",listener:t}),n.push({element:e,type:"mouseleave",listener:i}),n.push({element:e,type:"touchstart",listener:t}),n.push({element:e,type:"touchend",listener:i})}}),t=requestAnimationFrame(function n(){const i=function(){let e=Date.now(),t=(e-Se)/1e3;return t=Math.min(t,.016666),Se=e,t}();s()&&Te(),function(e){if(!m.COLORFUL)return;De+=e*m.COLOR_UPDATE_SPEED,De>=1&&(De=function(e,t,n){let i=n-t;return 0==i?t:(e-t)%i+t}(De,0,1),v.forEach(e=>{e.color=Ne()}))}(i),function(){d.length>0&&Le(d.pop());v.forEach(e=>{e.moved&&(e.moved=!1,Ae(e))})}(),m.PAUSED||function(e){h.disable(h.BLEND),de.bind(),h.uniform2f(de.uniforms.texelSize,W.texelSizeX,W.texelSizeY),h.uniform1i(de.uniforms.uVelocity,W.read.attach(0)),V($),he.bind(),h.uniform2f(he.uniforms.texelSize,W.texelSizeX,W.texelSizeY),h.uniform1i(he.uniforms.uVelocity,W.read.attach(0)),h.uniform1i(he.uniforms.uCurl,$.attach(1)),h.uniform1f(he.uniforms.curl,m.CURL),h.uniform1f(he.uniforms.dt,e),V(W.write),W.swap(),ve.bind(),h.uniform2f(ve.uniforms.texelSize,W.texelSizeX,W.texelSizeY),h.uniform1i(ve.uniforms.uVelocity,W.read.attach(0)),V(k),ie.bind(),h.uniform1i(ie.uniforms.uTexture,K.read.attach(0)),h.uniform1f(ie.uniforms.value,m.PRESSURE),V(K.write),K.swap(),ge.bind(),h.uniform2f(ge.uniforms.texelSize,W.texelSizeX,W.texelSizeY),h.uniform1i(ge.uniforms.uDivergence,k.attach(0));for(let e=0;e<m.PRESSURE_ITERATIONS;e++)h.uniform1i(ge.uniforms.uPressure,K.read.attach(1)),V(K.write),K.swap();pe.bind(),h.uniform2f(pe.uniforms.texelSize,W.texelSizeX,W.texelSizeY),h.uniform1i(pe.uniforms.uPressure,K.read.attach(0)),h.uniform1i(pe.uniforms.uVelocity,W.read.attach(1)),V(W.write),W.swap(),fe.bind(),h.uniform2f(fe.uniforms.texelSize,W.texelSizeX,W.texelSizeY),g.supportLinearFiltering||h.uniform2f(fe.uniforms.dyeTexelSize,W.texelSizeX,W.texelSizeY);let t=W.read.attach(0);h.uniform1i(fe.uniforms.uVelocity,t),h.uniform1i(fe.uniforms.uSource,t),h.uniform1f(fe.uniforms.dt,e),h.uniform1f(fe.uniforms.dissipation,m.VELOCITY_DISSIPATION),V(W.write),W.swap(),g.supportLinearFiltering||h.uniform2f(fe.uniforms.dyeTexelSize,q.texelSizeX,q.texelSizeY);h.uniform1i(fe.uniforms.uVelocity,W.read.attach(0)),h.uniform1i(fe.uniforms.uSource,q.read.attach(1)),h.uniform1f(fe.uniforms.dissipation,m.DENSITY_DISSIPATION),V(q.write),q.swap()}(i),function(t){m.BLOOM&&function(e,t){if(J.length<2)return;let n=t;h.disable(h.BLEND),ae.bind();let i=m.BLOOM_THRESHOLD*m.BLOOM_SOFT_KNEE+1e-4,r=m.BLOOM_THRESHOLD-i,o=2*i,a=.25/i;h.uniform3f(ae.uniforms.curve,r,o,a),h.uniform1f(ae.uniforms.threshold,m.BLOOM_THRESHOLD),h.uniform1i(ae.uniforms.uTexture,e.attach(0)),V(n),ue.bind();for(let e=0;e<J.length;e++){let t=J[e];h.uniform2f(ue.uniforms.texelSize,n.texelSizeX,n.texelSizeY),h.uniform1i(ue.uniforms.uTexture,n.attach(0)),V(t),n=t}h.blendFunc(h.ONE,h.ONE),h.enable(h.BLEND);for(let e=J.length-2;e>=0;e--){let t=J[e];h.uniform2f(ue.uniforms.texelSize,n.texelSizeX,n.texelSizeY),h.uniform1i(ue.uniforms.uTexture,n.attach(0)),h.viewport(0,0,t.width,t.height),V(t),n=t}h.disable(h.BLEND),ce.bind(),h.uniform2f(ce.uniforms.texelSize,n.texelSizeX,n.texelSizeY),h.uniform1i(ce.uniforms.uTexture,n.attach(0)),h.uniform1f(ce.uniforms.intensity,m.BLOOM_INTENSITY),V(t)}(q.read,Z);m.SUNRAYS&&(n=q.read,i=q.write,r=Q,h.disable(h.BLEND),le.bind(),h.uniform1i(le.uniforms.uTexture,n.attach(0)),V(i),se.bind(),h.uniform1f(se.uniforms.weight,m.SUNRAYS_WEIGHT),h.uniform1i(se.uniforms.uTexture,i.attach(0)),V(r),function(e,t,n){te.bind();for(let i=0;i<n;i++)h.uniform2f(te.uniforms.texelSize,e.texelSizeX,0),h.uniform1i(te.uniforms.uTexture,e.attach(0)),V(t),h.uniform2f(te.uniforms.texelSize,0,e.texelSizeY),h.uniform1i(te.uniforms.uTexture,t.attach(0)),V(e)}(Q,j,1));var n,i,r;null!=t&&m.TRANSPARENT?h.disable(h.BLEND):(h.blendFunc(h.ONE,h.ONE_MINUS_SRC_ALPHA),h.enable(h.BLEND));m.TRANSPARENT||function(e,t){re.bind(),h.uniform4f(re.uniforms.color,t.r,t.g,t.b,1),V(e)}(t,(o=m.BACK_COLOR,{r:o.r/255,g:o.g/255,b:o.b/255}));var o;null==t&&m.TRANSPARENT&&function(t){oe.bind(),h.uniform1f(oe.uniforms.aspectRatio,e.width/e.height),V(t)}(t);!function(e){let t=null==e?h.drawingBufferWidth:e.width,n=null==e?h.drawingBufferHeight:e.height;Ee.bind(),m.SHADING&&h.uniform2f(Ee.uniforms.texelSize,1/t,1/n);if(h.uniform1i(Ee.uniforms.uTexture,q.read.attach(0)),m.BLOOM){h.uniform1i(Ee.uniforms.uBloom,Z.attach(1)),h.uniform1i(Ee.uniforms.uDithering,ee.attach(2));let e=function(e,t,n){return{x:t/e.width,y:n/e.height}}(ee,t,n);h.uniform2f(Ee.uniforms.ditherScale,e.x,e.y)}m.SUNRAYS&&h.uniform1i(Ee.uniforms.uSunrays,Q.attach(3));V(e)}(t)}(null),t=requestAnimationFrame(n)})}function r(e,t,i=200,r=12,o=50){const a=document.getElementById(e),u=document.querySelectorAll(`#${t} .line`);if(!a||!u.length)return;let c=`M0,6 Q${i/2},6 ${i},6`,l=!0;function s(e,t){const n=a.getBoundingClientRect();if(e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom){l=!1;const a=e-n.left,s=n.width,m=Math.min(1,Math.max(0,a/s))*i,f=r/2,v=t-n.top;if(Math.abs(v-f)<o){const e=`M0,${f} Q${m},${v} ${i},${f}`;u.forEach(t=>t.setAttribute("d",e))}else u[0].getAttribute("d")!==c&&(TweenMax.to(u[0],.3,{attr:{d:c},ease:Power2.easeOut}),TweenMax.to(u[1],.3,{attr:{d:c},ease:Power2.easeOut}))}else l||(l=!0,TweenMax.to(u[0],.5,{attr:{d:c},ease:Elastic.easeOut.config(1,.3)}),TweenMax.to(u[1],.5,{attr:{d:c},ease:Elastic.easeOut.config(1,.3)}))}const m=e=>s(e.clientX,e.clientY),f=e=>{e.touches.length&&s(e.touches[0].clientX,e.touches[0].clientY)},v=()=>s(-1e3,-1e3);document.addEventListener("mousemove",m),document.addEventListener("touchmove",f),document.addEventListener("touchend",v),n.push({element:document,type:"mousemove",listener:m}),n.push({element:document,type:"touchmove",listener:f}),n.push({element:document,type:"touchend",listener:v})}window.generateRandomColor=function(){const e=[{r:0,g:0,b:0},{r:.533,g:.6,b:.98}];return e[Math.floor(Math.random()*e.length)]};let o=null;window.__currentTheme={init:function(){console.log("Light theme init"),document.body.style.opacity="0",setTimeout(()=>{document.body.style.transition="opacity 0.8s ease",document.body.style.opacity="1"},100),i(),function(){const e=document.querySelector(".image-container"),t=document.getElementById("prev"),n=document.getElementById("next");if(e&&t&&n){const o=Array.from(e.querySelectorAll("span")),a=o.length;if(0===a)return;const u=e.offsetWidth||300,c=360/a,l=Math.round(u/2/Math.tan(Math.PI/a)*1.5);o.forEach((e,t)=>{e.style.width=u+"px",e.style.height=u+"px",e.style.transform=`rotateY(${t*c}deg) translateZ(${l}px)`});let s=0;function m(t){s=(t%a+a)%a,e.style.transform=`rotateY(${-s*c}deg)`,o.forEach((e,t)=>e.classList.toggle("face-active",t===s))}m(0),t.addEventListener("click",()=>m(s-1)),n.addEventListener("click",()=>m(s+1));let f=0;e.addEventListener("touchstart",e=>{f=e.touches[0].clientX},{passive:!0}),e.addEventListener("touchend",e=>{const t=f-e.changedTouches[0].clientX;Math.abs(t)>40&&m(t>0?s+1:s-1)},{passive:!0})}const i=document.querySelector(".instagram-gallery");i&&i.querySelectorAll(".instagram-img-c").forEach(e=>{e.addEventListener("click",function(){if(this.classList.contains("active"))return;const e=this.offsetWidth,t=this.offsetHeight,n=this.getBoundingClientRect().left+window.scrollX,i=this.getBoundingClientRect().top+window.scrollY;document.querySelectorAll(".instagram-img-c.active").forEach(e=>{e.classList.remove("active"),e.classList.add("postactive"),setTimeout(()=>{e.classList.contains("postactive")&&e.classList.remove("postactive")},500)});const r=this.cloneNode(!0);r.style.width=e+"px",r.style.height=t+"px",r.style.position="fixed",r.style.top=i+"px",r.style.left=n+"px",r.classList.add("active"),document.body.appendChild(r),setTimeout(()=>{r.classList.add("positioned"),r.style.width="100%",r.style.height="100%",r.style.top="0",r.style.left="0",r.style.transition="all ease 400ms"},0),r.addEventListener("click",function(e){(e.target===this||e.target.closest(".instagram-img-w"))&&(this.classList.remove("positioned","active"),this.classList.add("postactive"),setTimeout(()=>{this.remove()},500))})})});document.querySelectorAll("video").forEach(e=>{e.addEventListener("mouseenter",()=>{e.play()}),e.addEventListener("mouseleave",()=>{e.pause(),e.currentTime=0}),e.addEventListener("touchstart",()=>{e.play()}),e.addEventListener("touchend",()=>{e.pause(),e.currentTime=0})});const r=document.getElementById("new-contact-form");if(r&&!r.dataset.listenerAttached&&(r.dataset.listenerAttached="true",r.addEventListener("submit",function(e){e.preventDefault();const t=document.querySelector('input[name="name"]').value,n=document.querySelector('input[name="email"]').value,i=document.querySelector('textarea[name="message"]').value;if(!t||!n||!i)return void alert("Please fill in all required fields");const r=new FormData(this);fetch(this.action,{method:"POST",body:r,headers:{Accept:"application/json"}}).then(e=>{e.ok?(alert("Thank you for your message! I will get back to you soon."),this.reset(),document.querySelectorAll(".floating-label-group select").forEach(e=>e.selectedIndex=0)):alert("There was an error sending your message. Please try again.")}).catch(e=>{console.error("Error:",e),alert("There was an error sending your message. Please try again.")})})),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(e){e.preventDefault();const t=this.getAttribute("href");if("#"===t)return;const n=document.querySelector(t);n&&window.scrollTo({top:n.offsetTop-80,behavior:"smooth"})})}),window.addEventListener("scroll",()=>{let e="";document.querySelectorAll("section[id], div[id='home']").forEach(t=>{const n=t.offsetTop;window.scrollY>=n-150&&(e=t.getAttribute("id"))}),document.querySelectorAll(".nav a").forEach(t=>{const n=t.getAttribute("href");if(n&&n.startsWith("#")){const i=n.substring(1);t.classList.toggle("active",i===e)}})}),document.querySelectorAll(".nav a, .btn, .contact-btn, .instagram-img-c, .animation-card, .portfolio-card, .dev-item, .footer a").forEach(e=>{e.addEventListener("mousedown",function(e){e.stopPropagation()}),e.addEventListener("touchstart",function(e){e.stopPropagation()})}),!document.getElementById("instagram-zoom-style")){const v=document.createElement("style");v.id="instagram-zoom-style",v.textContent="
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
            ",document.head.appendChild(v)}}(),r("emailWrapper","elasticLineEmail"),r("btnWrapper","elasticLineBtn"),function(){const e=document.querySelector(".contact-section");e&&new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add("visible")})},{threshold:.2}).observe(e)}(),o=function(){if(window.innerWidth>=768)return null;const e=document.querySelector(".nav ul"),t=document.querySelectorAll("
            .section-title, .bio-text p, .bio-image,
            .animation-card, .portfolio-card, .dev-item,
            .instagram-img-c, .contact-left h2, .contact-left p,
            .contact-email-wrapper, .contact-form-container,
            .main-name, .signature, .tagline
        ");t.forEach(e=>e.classList.add("animate-mobile"));const n=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("visible"),n.unobserve(e.target))})},{threshold:.15,rootMargin:"0px 0px -30px 0px"});return t.forEach(e=>n.observe(e)),()=>{e&&e.classList.remove("show"),n.disconnect(),t.forEach(e=>{e.classList.remove("animate-mobile","visible")})}}(),function(){const e=(e,t)=>{e.addEventListener("click",n=>{n.preventDefault(),t.classList.toggle("open"),e.classList.toggle("open")})},t=document.getElementById("pricingToggle"),n=document.getElementById("pricingDrawer");if(t&&n)return void e(t,n);const i=new MutationObserver((t,n)=>{const i=document.getElementById("pricingToggle"),r=document.getElementById("pricingDrawer");i&&r&&(e(i,r),n.disconnect())});i.observe(document.body,{childList:!0,subtree:!0}),setTimeout(()=>i.disconnect(),5e3)}(),document.querySelectorAll(".yt-thumb").forEach(function(e){e.addEventListener("click",function(){var t=e.dataset.id,n=document.createElement("iframe");n.src="https://www.youtube-nocookie.com/embed/"+t+"?autoplay=1&rel=0&modestbranding=1&playsinline=1",n.allow="autoplay; fullscreen",n.allowFullscreen=!0,n.style.position="absolute",n.style.inset="0",n.style.width="100%",n.style.height="100%",n.style.border="none",e.innerHTML="",e.appendChild(n)})})},destroy:function(){console.log("Light theme destroy"),t&&(cancelAnimationFrame(t),t=null),n.forEach(({element:e,type:t,listener:n,options:i})=>{e.removeEventListener(t,n,i)}),n=[],o&&o()}}}();
