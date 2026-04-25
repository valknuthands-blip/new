/* © 2026 Vivash Singh — All Rights Reserved */const fs=require("fs"),path=require("path"),IMAGE_DIR=path.join(__dirname,"assets","images"),IMAGE_EXTS=[".png",".jpg",".jpeg",".webp"];fs.existsSync(IMAGE_DIR)||(console.error("ERROR: Folder not found: "+IMAGE_DIR),process.exit(1));const allFiles=fs.readdirSync(IMAGE_DIR).filter(t=>IMAGE_EXTS.includes(path.extname(t).toLowerCase()));function getImages(t){return allFiles.filter(e=>{const n=path.basename(e,path.extname(e));if(""===t)return/^\d+$/.test(n);return new RegExp("^"+t+"\d+$","i").test(n)}).sort((e,n)=>parseInt(path.basename(e,path.extname(e)).replace(t,""))-parseInt(path.basename(n,path.extname(n)).replace(t,"")))}const marketingImages=getImages(""),marketingCards=marketingImages.map(t=>`        <div class="portfolio-card"><img src="assets/images/${t}" alt="" loading="lazy"></div>`).join("
"),marketingHTML=`<section class="portfolio-section marketing-section" id="marketing">
    <h2 class="section-title">Marketing Collateral</h2>
    <div class="portfolio-grid">
        \x3c!-- AUTO-GENERATED --\x3e
${marketingCards}
    </div>
</section>
`;fs.writeFileSync(path.join(__dirname,"components","marketing.html"),marketingHTML,"utf8"),console.log(`✅ marketing.html — ${marketingImages.length} image(s)`);const photoImages=getImages("p"),photoSpans=photoImages.map((t,e)=>`        <span style="--i: ${e+1}"><img src="assets/images/${t}" alt="" loading="lazy"></span>`).join("
"),photoHTML=`<section class="portfolio-section photography-section" id="photography">
    <h2 class="section-title">Photography</h2>
    <div class="image-container">
        \x3c!-- AUTO-GENERATED --\x3e
${photoSpans}
    </div>
    <div class="btn-container">
        <button class="btn" id="prev">Prev</button>
        <button class="btn" id="next">Next</button>
    </div>
</section>
`;fs.writeFileSync(path.join(__dirname,"components","photography.html"),photoHTML,"utf8"),console.log(`✅ photography.html — ${photoImages.length} image(s)`);const igImages=getImages("ig"),igCards=igImages.map(t=>`        <div class="instagram-img-c"><div class="instagram-img-w" style="background-image: url('assets/images/${t}')"></div></div>`).join("
"),igHTML=`<section class="portfolio-section instagram-section" id="instagram">
    <h2 class="section-title">Instagram</h2>
    <div class="instagram-gallery">
        \x3c!-- AUTO-GENERATED --\x3e
${igCards}
    </div>
</section>
`;fs.writeFileSync(path.join(__dirname,"components","instagram.html"),igHTML,"utf8"),console.log(`✅ instagram.html — ${igImages.length} image(s)`);
