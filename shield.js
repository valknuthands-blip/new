// (c) 2026 Vivash Singh - All Rights Reserved
(function(){
  "use strict";

  function _wipe(){
    try{
      document.documentElement.style.opacity="0";
      document.body.innerHTML="";
      window.location.replace("about:blank");
    }catch(e){}
  }

  // Wait for DOM before attaching anything
  function _init(){

    // 1. UI PROTECTION
    document.addEventListener("contextmenu",function(e){e.preventDefault();return false;});
    document.addEventListener("selectstart",function(e){e.preventDefault();return false;});
    document.addEventListener("dragstart",function(e){e.preventDefault();return false;});
    document.addEventListener("keydown",function(e){
      var k=e.keyCode||e.which;
      if(k===123){e.preventDefault();return false;}
      if(e.ctrlKey&&e.shiftKey&&[73,74,67,75].indexOf(k)>-1){e.preventDefault();return false;}
      if(e.ctrlKey&&[85,83].indexOf(k)>-1){e.preventDefault();return false;}
      if(e.metaKey&&e.altKey&&k===73){e.preventDefault();return false;}
    });

    // 2. WINDOW SIZE PANEL DETECTION — only fires after page is fully loaded
    var _po=false;
    window.addEventListener("load",function(){
      setInterval(function(){
        var wd=window.outerWidth-window.innerWidth;
        var hd=window.outerHeight-window.innerHeight;
        if(wd>200||hd>200){
          if(!_po){_po=true;_wipe();}
        }else{_po=false;}
      },1000);
    });

    // 3. CONSOLE toString TRAP — delayed so it doesn't fire at load
    setTimeout(function(){
      var _c=function(){};
      _c.toString=function(){_wipe();return "";};
      try{(function(x){})((_c,console.log(_c)));}catch(e){}
    },3000);

    // 4. CONSOLE PROPERTY GETTER — delayed
    setTimeout(function(){
      var _dd=false;
      var _img=new Image();
      Object.defineProperty(_img,"id",{get:function(){
        if(!_dd){_dd=true;_wipe();}
      }});
      try{console.log(_img);}catch(e){}
    },3000);

    // 5. SCRIPT INTEGRITY MONITOR
    window.addEventListener("load",function(){
      var _bc=document.scripts.length;
      setInterval(function(){
        if(document.scripts.length>_bc+5){_wipe();}
      },3000);
    });

  }

  // Run after DOM ready
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",_init);
  }else{
    _init();
  }

})();
