// (c) 2026 Vivash Singh - All Rights Reserved
(function(w){var _q=[];var _r=false;function _f(){while(_q.length){try{_q.shift()();}catch(e){}}}w.addEventListener("load",function(){_r=true;_f();});w.__runtime={run:function(fn){if(_r){try{fn();}catch(e){}}else{_q.push(fn);}},ready:function(){return _r;}};})(window);
