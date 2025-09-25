// Hamburger Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create and insert hamburger menu HTML
  const hamburgerMenuHTML = `
    <!-- 1) Hamburger button (fixed top-left) -->
    <button id="menuBtn" aria-label="Open menu" aria-controls="menuDrawer" aria-expanded="false"
      style="position:fixed; top:14px; left:14px; z-index:1001; background:transparent; border:0; cursor:pointer; padding:8px;">
      <span style="display:block; width:26px; height:3px; background:#1b4332; margin:5px 0;"></span>
      <span style="display:block; width:26px; height:3px; background:#1b4332; margin:5px 0;"></span>
      <span style="display:block; width:26px; height:3px; background:#1b4332; margin:5px 0;"></span>
    </button>

    <!-- 2) Backdrop -->
    <div id="menuBackdrop" hidden style="position:fixed; inset:0; background:rgba(0,0,0,.35); backdrop-filter:saturate(120%) blur(2px); z-index:1000; opacity:0; transition:opacity .18s ease;"></div>

    <!-- 3) Drawer -->
    <aside id="menuDrawer" hidden role="dialog" aria-modal="true" tabindex="-1"
      style="position:fixed; top:0; left:0; height:100dvh; width:min(360px, 90vw); background:#f6f2e9; color:#1b4332; box-shadow: 0 12px 38px rgba(0,0,0,.18); border-right:1px solid #d6d0c4; z-index:1002; transform:translateX(-100%); transition: transform .18s ease; display:flex; flex-direction:column;">
        <!-- Header: profile -->
        <div style="padding:20px 18px; border-bottom:1px solid #d6d0c4; display:flex; flex-direction:column; align-items:center; gap:12px;">
          <img src="images/headshot2.jpg" alt="Maria Patni" width="200" height="200" style="width:200px; height:200px; border-radius:50%; object-fit:cover; border:1px solid #d6d0c4;"/>
          <div style="font: 600 1rem 'Fira Code', ui-monospace, monospace; text-align:left;">Maria Patni</div>
        </div>
      
      <!-- Nav links -->
      <nav style="padding:12px 8px 8px; font: 16px 'Fira Code', ui-monospace, monospace;">
        <a class="menu-link" href="./index.html" style="display:block; padding:10px 14px; text-decoration:none; color:#1b4332;">Home</a>
        <a class="menu-link" href="./experience.html" style="display:block; padding:10px 14px; text-decoration:none; color:#1b4332;">Experience</a>
        <a class="menu-link" href="./projects.html" style="display:block; padding:10px 14px; text-decoration:none; color:#1b4332;">Projects</a>

        <div style="height:1px; background:#d6d0c4; margin:10px 14px;"></div>

        <a class="menu-link" href="./files/resume.pdf" style="display:block; padding:10px 14px; text-decoration:underline; color:#0f5132;">CV</a>
      </nav>

      <!-- Close area at bottom -->
      <div style="margin-top:auto; padding:12px 18px;">
        <button id="closeMenu" style="font: 14px 'Fira Code', ui-monospace, monospace; border:1px solid #d6d0c4; border-radius:10px; background:#fff4; color:#1b4332; padding:8px 12px; cursor:pointer;">Close</button>
      </div>
    </aside>
  `;

  // Insert the hamburger menu HTML into the body
  document.body.insertAdjacentHTML('afterbegin', hamburgerMenuHTML);

  // Now get the elements for the toggle functionality
  const btn = document.getElementById('menuBtn');
  const drawer = document.getElementById('menuDrawer');
  const backdrop = document.getElementById('menuBackdrop');
  const closeBtn = document.getElementById('closeMenu');

  function openMenu(){
    drawer.hidden = false; backdrop.hidden = false;
    requestAnimationFrame(()=>{
      drawer.style.transform = 'translateX(0)';
      backdrop.style.opacity = '1';
      btn.setAttribute('aria-expanded','true');
      drawer.focus();
    });
  }
  function closeMenu(){
    drawer.style.transform = 'translateX(-100%)';
    backdrop.style.opacity = '0';
    btn.setAttribute('aria-expanded','false');
    setTimeout(()=>{ drawer.hidden = true; backdrop.hidden = true; }, 180);
  }

  btn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeMenu(); });

  // Close when a link is clicked
  document.querySelectorAll('.menu-link').forEach(a=>{
    a.addEventListener('click', closeMenu);
  });
});
