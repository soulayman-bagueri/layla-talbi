(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const sceneOne = $("sceneOne"), sceneTwo = $("sceneTwo"), sceneThree = $("sceneThree");
  const nextOne = $("nextOne"), nextTwo = $("nextTwo");
  const flowerGarden = $("flowerGarden");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  let gardenBuilt = false, finalBuilt = false;

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  }
  function add(parent, tag, attrs = {}) {
    const el = svgEl(tag, attrs); parent.appendChild(el); return el;
  }
  function makeDefs(svg, suffix) {
    const defs = add(svg, "defs");
    const gradients = [
      ["petalOuter", [["0%","#7d071e"],["35%","#c20d32"],["72%","#ed3154"],["100%","#72051c"]]],
      ["petalLight", [["0%","#a50929"],["42%","#e21e46"],["78%","#fa6077"],["100%","#8d0927"]]],
      ["petalInner", [["0%","#5d061a"],["45%","#b70d34"],["100%","#f64a68"]]],
      ["leafGrad", [["0%","#0e3928"],["48%","#2c7545"],["100%","#8bad62"]]]
    ];
    gradients.forEach(([name, stops]) => {
      const grad = add(defs, "linearGradient", {id:`${name}-${suffix}`, x1:"0%", y1:"0%", x2:"100%", y2:"100%"});
      stops.forEach(([offset, color]) => add(grad, "stop", {offset, "stop-color":color}));
    });
    const glow = add(defs, "radialGradient", {id:`centerGlow-${suffix}`});
    [["0%","#f7b65c"],["45%","#bd5524"],["100%","#4a0718"]].forEach(([offset,color]) => add(glow,"stop",{offset,"stop-color":color}));
    const shadow = add(defs,"filter",{id:`softShadow-${suffix}`,x:"-50%",y:"-50%",width:"200%",height:"200%"});
    add(shadow,"feGaussianBlur",{stdDeviation:"7"});
    return defs;
  }

  function createMainRose() {
    if (gardenBuilt || !flowerGarden) return;
    gardenBuilt = true;
    const svg = add(flowerGarden,"svg",{class:"main-rose",viewBox:"0 0 800 1100",role:"img","aria-label":"A detailed red rose"});
    makeDefs(svg,"main");
    const shadow = add(svg,"ellipse",{cx:"410",cy:"1040",rx:"120",ry:"17",fill:"#000","opacity":".22"});
    // Long curved stem and its fine highlight
    add(svg,"path",{class:"rose-stem",d:"M402 432 C390 590 470 735 428 1080"});
    add(svg,"path",{class:"rose-stem-highlight",d:"M398 470 C393 610 449 755 421 1030"});
    // Branches
    add(svg,"path",{class:"rose-branch",d:"M435 755 C500 700 557 661 612 625"});
    add(svg,"path",{class:"rose-branch",d:"M431 900 C350 850 288 816 224 785"});
    // Leaves, with individual veins
    function leaf(d, vein, cls="rose-leaf") {
      const g=add(svg,"g",{class:cls});
      add(g,"path",{d,fill:"url(#leafGrad-main)",stroke:"#123c2b","stroke-width":"4"});
      add(g,"path",{class:"leaf-vein",d:vein});
      return g;
    }
    leaf("M470 728 C520 636 602 614 660 621 C638 691 570 752 470 728 Z","M477 724 Q557 670 645 629");
    leaf("M330 846 C262 759 174 747 119 775 C155 848 236 889 330 846 Z","M320 842 Q224 802 136 781","rose-leaf late");
    leaf("M439 956 C496 894 557 887 601 906 C568 965 511 991 439 956 Z","M446 953 Q518 921 590 910","rose-leaf late");
    // Small side bud on a curved branch
    add(svg,"path",{class:"rose-branch",d:"M465 690 C520 630 525 575 505 535"});
    const bud=add(svg,"g",{class:"rose-leaf late"});
    add(bud,"path",{d:"M505 550 C457 532 445 486 477 455 C516 471 534 512 505 550Z",fill:"#a80b2c",stroke:"#5c0920","stroke-width":"4"});
    add(bud,"path",{d:"M500 548 Q485 501 479 465",fill:"none",stroke:"#f56b7b","stroke-width":"4","stroke-linecap":"round"});
    add(bud,"path",{d:"M505 550 Q535 513 527 481",fill:"none",stroke:"#286b42","stroke-width":"8","stroke-linecap":"round"});
    // Thorns along the stem
    [[420,570,1],[444,660,-1],[433,820,1],[427,990,-1]].forEach(([x,y,dir],i)=>{
      add(svg,"path",{class:"rose-thorn",d:`M${x} ${y} q${dir*28} -9 ${dir*37} -34 q${-dir*4} 29 ${-dir*37} 34Z`,fill:"#a94a50",style:`animation-delay:${2.7+i*.18}s`});
    });
    // Calyx and sepals under the flower head
    const calyx=add(svg,"g",{});
    add(calyx,"path",{d:"M400 407 C350 446 337 492 360 532 C382 510 395 478 400 407Z",fill:"#1b5936",stroke:"#12432b","stroke-width":"3"});
    add(calyx,"path",{d:"M400 407 C450 446 463 492 440 532 C418 510 405 478 400 407Z",fill:"#286b42",stroke:"#12432b","stroke-width":"3"});
    add(calyx,"path",{d:"M400 407 C386 470 386 508 400 550 C414 508 414 470 400 407Z",fill:"#397a48"});
    // Rose head: concentric overlapping petals. Each petal is a separate animated path.
    const head=add(svg,"g",{transform:"translate(400 340)"});
    const petalPath="M0 12 C-28 -12 -83 -60 -73 -126 C-66 -178 -21 -208 0 -211 C26 -190 70 -150 73 -104 C78 -54 30 -12 0 12Z";
    const layers=[
      {count:13,rx:160,ry:154,scale:.94,fill:"petalOuter-main",delay:1.55},
      {count:11,rx:122,ry:122,scale:.78,fill:"petalLight-main",delay:2.0},
      {count:9,rx:83,ry:88,scale:.62,fill:"petalInner-main",delay:2.45},
      {count:7,rx:49,ry:53,scale:.48,fill:"petalLight-main",delay:2.9}
    ];
    layers.forEach((layer,li)=>{
      for(let i=0;i<layer.count;i++){
        const angle=(360/layer.count)*i+(li%2?16:0);
        const rad=angle*Math.PI/180;
        const x=Math.cos(rad)*layer.rx*.20, y=Math.sin(rad)*layer.ry*.12;
        const p=add(head,"path",{class:"rose-petal",d:petalPath,fill:`url(#${layer.fill})`,stroke:"#65091e","stroke-width":"2.4",transform:`translate(${x} ${y}) rotate(${angle}) scale(${layer.scale})`,style:`animation-delay:${layer.delay+i*.045}s`});
        if(i%3===0) p.setAttribute("opacity",".98");
      }
    });
    // Folded central petals
    const core=add(head,"g",{class:"rose-center"});
    add(core,"path",{d:"M-38 25 C-60 -28 -35 -84 8 -91 C55 -98 70 -43 43 -9 C25 13 -5 6 -10 -18 C-14 -37 4 -55 23 -49 C40 -44 42 -23 29 -15",fill:"none",stroke:"#7b071f","stroke-width":"24","stroke-linecap":"round"});
    add(core,"path",{d:"M-38 25 C-60 -28 -35 -84 8 -91 C55 -98 70 -43 43 -9 C25 13 -5 6 -10 -18 C-14 -37 4 -55 23 -49 C40 -44 42 -23 29 -15",fill:"none",stroke:"#e84a60","stroke-width":"12","stroke-linecap":"round"});
    add(core,"ellipse",{cx:"0",cy:"0",rx:"33",ry:"25",fill:"url(#centerGlow-main)"});
    for(let i=0;i<18;i++){
      const a=i*Math.PI*2/18, x=Math.cos(a)*25, y=Math.sin(a)*18;
      add(core,"circle",{cx:x,cy:y,r:"2.8",fill:"#ffd17d"});
    }
    // Subtle light veins on outer petals
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4;
      add(head,"path",{d:"M0 5 Q-4 -48 0 -125",fill:"none",stroke:"#ff9aaa","stroke-width":"2","stroke-linecap":"round",opacity:".18",transform:`rotate(${i*45})`});
    }
    if(reducedMotion){
      svg.querySelectorAll("*").forEach(el=>{el.style.animationDuration="0.01ms";el.style.animationDelay="0ms";});
    }
    window.setTimeout(()=>nextTwo.classList.remove("hidden"),reducedMotion?100:5600);
  }

  function createMiniRose(container, index, side) {
    const svg=add(container,"svg",{class:"side-rose",viewBox:"0 0 180 250",style:`top:${(index%6)*16+((index*17)%9)}%;left:${(index%3)*8+((index*7)%8)}%;animation-delay:${.12+index*.09}s`});
    const defs=add(svg,"defs");
    const grad=add(defs,"radialGradient",{id:`mini-${side}-${index}`});
    [["0%","#f45a72"],["55%","#c20f37"],["100%","#69091f"]].forEach(([offset,color])=>add(grad,"stop",{offset,"stop-color":color}));
    add(svg,"path",{d:"M88 112 C82 155 105 196 91 244",fill:"none",stroke:"#27613d","stroke-width":"8","stroke-linecap":"round"});
    add(svg,"path",{d:"M94 180 C124 154 145 157 158 164 C140 187 117 195 94 180Z",fill:"#2f7547",stroke:"#17452d","stroke-width":"2"});
    add(svg,"path",{d:"M90 205 C64 181 42 183 26 194 C45 214 69 219 90 205Z",fill:"#286943",stroke:"#17452d","stroke-width":"2"});
    for(let i=0;i<9;i++){
      const a=i*40;
      add(svg,"path",{d:"M88 112 C55 94 45 61 68 36 C96 36 119 63 111 91 C106 104 97 110 88 112Z",fill:`url(#mini-${side}-${index})`,stroke:"#760a24","stroke-width":"1.5",transform:`rotate(${a} 88 112)`});
    }
    add(svg,"circle",{cx:"88",cy:"108",r:"19",fill:"#8d0b2b"});
    add(svg,"path",{d:"M76 110 Q80 88 99 91 Q112 96 101 111 Q91 124 82 116",fill:"none",stroke:"#f46a7d","stroke-width":"7","stroke-linecap":"round"});
  }

  function createFinalGarden() {
    if(finalBuilt)return; finalBuilt=true;
    const count=window.innerWidth<700?5:8;
    for(let i=0;i<count;i++){createMiniRose($("leftFlowers"),i,"l");createMiniRose($("rightFlowers"),i,"r");}
  }

  function showScene(target) {
    [sceneOne,sceneTwo,sceneThree].forEach(s=>s.classList.remove("active"));
    target.classList.add("active");
    if(target===sceneTwo) createMainRose();
    if(target===sceneThree) createFinalGarden();
  }

  function typeName(){
    const target=$("typingName");
    const letters="LAYLA".split("");
    letters.forEach((letter,index)=>{
      const span=document.createElement("span");
      span.textContent=letter;
      span.style.animationDelay=`${reducedMotion?0:.55+index*.32}s`;
      target.appendChild(span);
    });
    window.setTimeout(()=>nextOne.classList.remove("hidden"),reducedMotion?100:2600);
  }
  function createStars(){
    const field=$("particlesOne");
    for(let i=0;i<48;i++){
      const star=document.createElement("i"); star.className="spark";
      star.style.left=`${Math.random()*100}%`;star.style.top=`${Math.random()*100}%`;
      star.style.setProperty("--dur",`${2.5+Math.random()*4}s`);
      star.style.setProperty("--delay",`${Math.random()*5}s`);
      field.appendChild(star);
    }
  }
  nextOne.addEventListener("click",()=>showScene(sceneTwo));
  nextTwo.addEventListener("click",()=>showScene(sceneThree));
  createStars();
  typeName();
})();