// WeZuno Agency Client JavaScript

const init = () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // 1. Navbar Scroll Spy & Active States
  const sections = ['hero', 'about', 'services', 'process', 'pricing', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');
  const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');

  const updateActiveNavbar = () => {
    const scrollPosition = window.scrollY;
    let activeSection = '';
    
    // Check which section is in view
    sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const absoluteTop = rect.top + scrollPosition;
        const windowCenter = scrollPosition + (window.innerHeight / 2);
        
        if (windowCenter >= absoluteTop && windowCenter <= absoluteTop + rect.height) {
          activeSection = secId;
        }
      }
    });

    // Special case for top of page
    if (scrollPosition < 100) {
      activeSection = '';
    }

    // Update Desktop Nav Links
    navLinks.forEach(link => {
      const sectionName = link.getAttribute('data-section');
      if (sectionName === activeSection) {
        link.classList.add('nav-link-active');
        link.classList.remove('text-white/70', 'hover:text-white');
      } else {
        link.classList.remove('nav-link-active');
        link.classList.add('text-white/70', 'hover:text-white');
      }
    });

    // Update Mobile Bottom Nav Links
    bottomNavLinks.forEach(link => {
      const sectionName = link.getAttribute('data-section');
      const icon = link.querySelector('.nav-icon');
      const text = link.querySelector('span');
      
      const isHeroActive = activeSection === '' || activeSection === 'hero';
      const isActive = (sectionName === activeSection) || (sectionName === 'hero' && isHeroActive);

      if (isActive) {
        if (icon) {
          icon.classList.add('bottom-nav-active-icon');
          icon.classList.remove('text-white/30');
        }
        if (text) {
          text.classList.add('bottom-nav-active-text');
          text.classList.remove('text-white/30');
        }
      } else {
        if (icon) {
          icon.classList.remove('bottom-nav-active-icon');
          icon.classList.add('text-white/30');
        }
        if (text) {
          text.classList.remove('bottom-nav-active-text');
          text.classList.add('text-white/30');
        }
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavbar);
  updateActiveNavbar();

  // Desktop Logo scroll to top
  const desktopLogo = document.getElementById('desktop-logo');
  if (desktopLogo) {
    desktopLogo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Stats Count-Up Animation
  const statsSection = document.getElementById('stats');
  const statCards = document.querySelectorAll('.stat-card');
  let statsAnimated = false;

  const animateStats = () => {
    statCards.forEach(card => {
      const target = parseInt(card.getAttribute('data-target'), 10);
      const numberEl = card.querySelector('.stat-number');
      let current = 0;
      const duration = 1500; // ms
      const increment = target / (duration / 16); // ~60fps
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          numberEl.textContent = target;
          clearInterval(counter);
        } else {
          numberEl.textContent = Math.floor(current);
        }
      }, 16);
    });
  };

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStats();
        }
      });
    }, { threshold: 0.2 });
    
    statsObserver.observe(statsSection);
  }

  // 3. Process Section Horizontal Sticky Scroll
  const processSection = document.getElementById('process');
  const processTrack = document.getElementById('process-track');
  const processProgressBar = document.getElementById('process-progress-bar');
  const processPhaseNum = document.getElementById('process-phase-num');

  const handleProcessScroll = () => {
    if (!processSection || !processTrack) return;
    
    const rect = processSection.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const containerHeight = rect.height;
    
    const maxScroll = containerHeight - window.innerHeight;
    const currentScroll = window.scrollY - containerTop;
    
    let progress = currentScroll / maxScroll;
    progress = Math.max(0, Math.min(1, progress));
    
    // Translate the track horizontally from 0% to -80%
    const translateX = progress * -80;
    processTrack.style.transform = `translate3d(${translateX}%, 0, 0)`;
    
    // Update progress bar scaleX
    processProgressBar.style.width = `${progress * 100}%`;
    
    // Update Phase status number (1 to 5)
    const activePhase = Math.min(Math.floor(progress * 4) + 1, 5);
    processPhaseNum.textContent = activePhase;
  };

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(handleProcessScroll);
  });
  handleProcessScroll();

  // 4. Portfolio Section Code
  const portfolioItems = [
    { id: 1, category: 'Shade', name: 'Persian', video: 'assets/Shade (1).mp4' },
    { id: 2, category: 'Shade', name: 'Cinematic Promo', video: 'assets/Shade (2).mp4' },
    { id: 3, category: 'Shade', name: 'Product Showcase', video: 'assets/Shade (3).mp4' },
    { id: 4, category: 'Dentist', name: 'Smile Design', video: 'assets/Dentist (1).mp4' },
    { id: 5, category: 'Dentist', name: 'Perfect Care', video: 'assets/Dentist (2).mp4' },
    { id: 6, category: 'Dentist', name: 'Expert Clinic', video: 'assets/Dentist (3).mp4' }
  ];

  let currentPortfolioCategory = 'Shade';
  const portfolioGrid = document.getElementById('portfolio-grid');
  const tabShade = document.getElementById('tab-shade');
  const tabDentist = document.getElementById('tab-dentist');

  const renderPortfolio = (category) => {
    if (!portfolioGrid) return;
    
    const filtered = portfolioItems.filter(item => item.category === category);
    portfolioGrid.innerHTML = '';
    
    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `relative group aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 bg-dark-card shadow-2xl transition-all portfolio-card-hover-state portfolio-card-${index}`;
      
      card.innerHTML = `
        <video src="${item.video}" loop muted playsinline class="portfolio-video w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"></video>
        
        <!-- Large Play Center Button overlay -->
        <div class="play-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity cursor-pointer flex items-center justify-center">
          <div class="play-btn-large w-16 h-16 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110">
            <i data-lucide="play" class="w-8 h-8 fill-current ml-1"></i>
          </div>
        </div>
        
        <!-- Sound Mute Toggle -->
        <div class="absolute top-6 right-6 z-10">
          <button class="mute-btn w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 transition-all">
            <i data-lucide="volume-x" class="mute-icon w-5 h-5"></i>
            <i data-lucide="volume-2" class="unmute-icon w-5 h-5 hidden"></i>
          </button>
        </div>
        
        <!-- Custom Controls Overlay -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] px-4 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <div class="flex items-center gap-3">
            <button class="play-pause-btn text-white hover:text-purple-light transition-colors">
              <i data-lucide="play" class="play-icon w-4 h-4 fill-current"></i>
              <i data-lucide="pause" class="pause-icon w-4 h-4 fill-current hidden"></i>
            </button>
            
            <span class="current-time text-[10px] text-white/60 font-medium min-w-[30px]">0:00</span>
            
            <div class="flex-1 px-1 relative h-4 flex items-center">
              <input type="range" min="0" max="100" value="0" class="seek-slider w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white" />
            </div>
            
            <div class="flex items-center gap-2">
              <button class="fullscreen-btn text-white/60 hover:text-white transition-colors">
                <i data-lucide="maximize" class="w-3.5 h-3.5"></i>
              </button>
              <button class="share-btn text-white/60 hover:text-white transition-colors">
                <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
              </button>
              
              <div class="relative inline-block text-left">
                <button class="more-btn text-white/60 hover:text-white transition-colors flex items-center justify-center">
                  <i data-lucide="more-vertical" class="w-4 h-4"></i>
                </button>
                <div class="more-menu hidden absolute bottom-full right-0 mb-4 w-40 bg-dark-card border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30">
                  <button class="menu-copy-btn w-full px-4 py-2.5 flex items-center gap-3 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all text-left">
                    <i data-lucide="link" class="w-3.5 h-3.5"></i> Copy Link
                  </button>
                  <a href="${item.video}" download class="w-full px-4 py-2.5 flex items-center gap-3 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all text-left">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i> Download
                  </a>
                  <button class="menu-share-btn w-full px-4 py-2.5 flex items-center gap-3 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all text-left">
                    <i data-lucide="share-2" class="w-3.5 h-3.5"></i> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Video Label Card Title -->
        <div class="absolute bottom-20 left-1/2 -translate-x-1/2 text-center w-full px-6 group-hover:bottom-24 transition-all duration-300 pointer-events-none">
          <h3 class="text-xl font-bold text-white tracking-wide drop-shadow-lg leading-tight">${item.name}</h3>
        </div>
        
        <div class="absolute inset-0 border-2 border-purple-deep/0 group-hover:border-purple-deep/30 rounded-[2.5rem] transition-all duration-300 pointer-events-none"></div>
      `;
      
      portfolioGrid.appendChild(card);
      setupVideoControls(card, item.video);
    });
    
    // Update Lucide Icons for dynamic elements
    lucide.createIcons();
  };

  const setupVideoControls = (card, videoSrc) => {
    const video = card.querySelector('.portfolio-video');
    const playOverlay = card.querySelector('.play-overlay');
    const playPauseBtn = card.querySelector('.play-pause-btn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    
    const muteBtn = card.querySelector('.mute-btn');
    const muteIcon = muteBtn.querySelector('.mute-icon');
    const unmuteIcon = muteBtn.querySelector('.unmute-icon');
    
    const currentTimeText = card.querySelector('.current-time');
    const seekSlider = card.querySelector('.seek-slider');
    const fullscreenBtn = card.querySelector('.fullscreen-btn');
    const moreBtn = card.querySelector('.more-btn');
    const moreMenu = card.querySelector('.more-menu');
    const menuCopyBtn = card.querySelector('.menu-copy-btn');
    const menuShareBtn = card.querySelector('.menu-share-btn');
    const shareBtnDirect = card.querySelector('.share-btn');

    // Helper: format time MM:SS
    const formatTime = (time) => {
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle Play/Pause
    const togglePlay = () => {
      // Pause all other videos first
      document.querySelectorAll('.portfolio-video').forEach(otherVideo => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
          const otherCard = otherVideo.closest('.portfolio-card-hover-state');
          if (otherCard) {
            const otherPlayOverlay = otherCard.querySelector('.play-overlay');
            if (otherPlayOverlay) otherPlayOverlay.classList.remove('hidden');
            const otherPlayIcon = otherCard.querySelector('.play-icon');
            const otherPauseIcon = otherCard.querySelector('.pause-icon');
            if (otherPlayIcon && otherPauseIcon) {
              otherPlayIcon.classList.remove('hidden');
              otherPauseIcon.classList.add('hidden');
            }
          }
        }
      });

      if (video.paused) {
        video.play();
        playOverlay.classList.add('hidden');
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
      } else {
        video.pause();
        playOverlay.classList.remove('hidden');
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
      }
    };

    playOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    // Mute/Unmute
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (video.muted) {
        if (muteIcon) muteIcon.classList.remove('hidden');
        if (unmuteIcon) unmuteIcon.classList.add('hidden');
      } else {
        if (muteIcon) muteIcon.classList.add('hidden');
        if (unmuteIcon) unmuteIcon.classList.remove('hidden');
      }
    });

    // Time Update & Seek
    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        seekSlider.value = progress;
        currentTimeText.textContent = formatTime(video.currentTime);
      }
    });

    seekSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      if (video.duration) {
        const seekTo = (seekSlider.value / 100) * video.duration;
        video.currentTime = seekTo;
      }
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    });

    // More Vertical menu dropdown
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close all other dropdowns
      document.querySelectorAll('.more-menu').forEach(menu => {
        if (menu !== moreMenu) menu.classList.add('hidden');
      });
      moreMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      if (moreMenu) moreMenu.classList.add('hidden');
    });

    // Copy Video Link
    const copyLink = (e) => {
      e.stopPropagation();
      if (moreMenu) moreMenu.classList.add('hidden');
      const fullUrl = window.location.origin + '/' + videoSrc;
      navigator.clipboard.writeText(fullUrl).then(() => {
        alert('Video link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    };
    if (menuCopyBtn) menuCopyBtn.addEventListener('click', copyLink);

    // Share Handler
    const shareVideo = (e) => {
      e.stopPropagation();
      if (moreMenu) moreMenu.classList.add('hidden');
      const shareData = {
        title: card.querySelector('h3').textContent,
        text: 'Check out WeZuno video!',
        url: window.location.origin + '/' + videoSrc
      };
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        copyLink(e);
      }
    };
    if (menuShareBtn) menuShareBtn.addEventListener('click', shareVideo);
    if (shareBtnDirect) shareBtnDirect.addEventListener('click', shareVideo);
  };

  // Bind Portfolio Category Switch Tabs
  tabShade.addEventListener('click', () => {
    if (currentPortfolioCategory === 'Shade') return;
    currentPortfolioCategory = 'Shade';
    tabShade.className = 'px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-premium-gradient text-white shadow-[0_0_20px_rgba(138,43,226,0.3)]';
    tabDentist.className = 'px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 text-white/50 hover:text-white';
    renderPortfolio('Shade');
  });

  tabDentist.addEventListener('click', () => {
    if (currentPortfolioCategory === 'Dentist') return;
    currentPortfolioCategory = 'Dentist';
    tabDentist.className = 'px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-premium-gradient text-white shadow-[0_0_20px_rgba(138,43,226,0.3)]';
    tabShade.className = 'px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 text-white/50 hover:text-white';
    renderPortfolio('Dentist');
  });

  // Render Shade portfolio first
  renderPortfolio('Shade');


  // 5. Pricing Plans Dynamic Inject & Switcher
  const marketingPlans = [
    {
      name: 'STARTER',
      subtitle: 'Brand Awareness & Reach',
      features: [
        { category: 'Strategy', items: ['Development & Planning'] },
        { category: 'Content', items: ['5 Impact Posters', '5 Impact Videos', 'Scripting + Shooting + Editing'] },
        { category: 'Marketing', items: ['Build a Strategy', 'Content Optimization', 'Content Distribution'] },
        { category: 'Social Media', items: ['Full Management'] },
        { category: 'Meta Ads', items: ['Ad Spend: up to ₹15K / month', 'Campaigns: 2 (Awareness/Reach)', 'Creatives: 3 images/videos'] }
      ]
    },
    {
      name: 'GROWTH',
      subtitle: 'Traffic & Lead Generation',
      popular: true,
      features: [
        { category: 'Strategy', items: ['Development & Planning'] },
        { category: 'Content', items: ['5 Impact Posters', '11 Impact Videos', 'Scripting + Shooting + Editing'] },
        { category: 'Marketing', items: ['Build a Strategy', 'Content Optimization', 'Content Distribution'] },
        { category: 'Social Media', items: ['Full Management'] },
        { category: 'Meta Ads', items: ['Ad Spend: up to ₹20K / month', 'Campaigns: 3–4 (Traffic/Engagement)', 'Pixel Setup + Retargeting'] }
      ]
    },
    {
      name: 'PREMIUM',
      subtitle: 'Advanced Funnel & Scale',
      features: [
        { category: 'Strategy', items: ['Development & Planning'] },
        { category: 'Content', items: ['5 Impact Posters', '20 Visual Impact Videos', 'Scripting + Shooting + Editing'] },
        { category: 'Marketing', items: ['Build a Strategy', 'Content Optimization', 'Content Distribution'] },
        { category: 'Social Media', items: ['Full Management'] },
        { category: 'Meta Ads', items: ['Ad Spend: ₹40K–₹50K+ / month', 'Conversion API + Tracking', 'Optimization: Weekly'] }
      ]
    }
  ];

  const videoPlans = [
    {
      name: 'BASIC',
      subtitle: 'Essential Professional Edits',
      features: [
        { category: 'Foundational', items: ['Cutting & Trimming', 'Merging Clips'] },
        { category: 'Visuals', items: ['Basic Transitions', 'Text Titles'] },
        { category: 'Audio/Color', items: ['Color Correction (Basics)', 'Sound Editing', 'Background Music'] }
      ]
    },
    {
      name: 'RETENTION',
      subtitle: 'High-Engagement Viral Edits',
      popular: true,
      features: [
        { category: 'Foundational', items: ['Include Basic Editing', 'Cutting & Trimming', 'Merging Clips'] },
        { category: 'Visuals/VFX', items: ['Animated Text & Images', 'Motion Graphics', 'Transitions & Effects'] },
        { category: 'Audio/Engagement', items: ['Sound Effects (SFX)', 'Text Titles', 'Advanced Storytelling'] }
      ]
    },
    {
      name: 'CUSTOMIZED',
      subtitle: 'Full-Scale Cinematic Production',
      features: [
        { category: 'Production', items: ['Content Shooting', 'Content Scripting'] },
        { category: 'Cinematic', items: ['Cinematic Editing', 'Advanced Color Grading'] },
        { category: 'Post/VFX', items: ['VFX / Green Screen', 'Motion Graphics', 'Tailored for Content Type'] }
      ]
    }
  ];

  let currentPricingCategory = 'marketing';
  const pricingGrid = document.getElementById('pricing-grid');
  const priceTabMarketing = document.getElementById('price-tab-marketing');
  const priceTabVideo = document.getElementById('price-tab-video');
  const pricingSlider = document.getElementById('pricing-slider');

  const renderPricing = (category) => {
    if (!pricingGrid) return;
    
    const plans = category === 'marketing' ? marketingPlans : videoPlans;
    pricingGrid.innerHTML = '';
    
    plans.forEach(plan => {
      const card = document.createElement('div');
      card.className = `glass-card relative flex flex-col h-full bg-dark-card/40 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2.5 ${
        plan.popular ? 'border-purple-deep border-2 shadow-[0_0_40px_rgba(138,43,226,0.1)]' : 'border-white/10'
      }`;
      
      let featuresHtml = '';
      plan.features.forEach(feat => {
        let itemsList = '';
        feat.items.forEach(item => {
          itemsList += `
            <li class="text-sm text-white/70 flex items-start gap-2.5 leading-snug">
              <span class="text-purple-light/50 text-xs mt-0.5">•</span>
              ${item}
            </li>
          `;
        });
        
        featuresHtml += `
          <div class="border-t border-white/5 pt-5 first:border-0 first:pt-0 text-left">
            <h4 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <i data-lucide="check" class="w-3 h-3 text-purple-deep"></i> ${feat.category}
            </h4>
            <ul class="space-y-2.5">
              ${itemsList}
            </ul>
          </div>
        `;
      });
      
      card.innerHTML = `
        ${plan.popular ? `
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-premium-gradient px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-10 shadow-lg text-white">
            Most Popular
          </div>
        ` : ''}
        
        <div class="mb-8 text-left">
          <h3 class="text-3xl font-black tracking-tighter mb-1">${plan.name}</h3>
          <p class="text-purple-light text-sm font-medium opacity-80">${plan.subtitle}</p>
        </div>

        <div class="space-y-6 flex-grow">
          ${featuresHtml}
        </div>

        <button class="w-full py-4 mt-10 rounded-full font-black uppercase tracking-widest transition-all shadow-xl group flex items-center justify-center gap-2 ${
          plan.popular ? 'bg-premium-gradient text-white hover:shadow-[0_0_30px_rgba(138,43,226,0.4)]' : 'bg-white/5 hover:bg-white/10 text-white'
        }">
          Get Started
        </button>
      `;
      
      pricingGrid.appendChild(card);
    });
    
    lucide.createIcons();
  };

  priceTabMarketing.addEventListener('click', () => {
    if (currentPricingCategory === 'marketing') return;
    currentPricingCategory = 'marketing';
    pricingSlider.style.transform = 'translateX(0)';
    priceTabMarketing.className = 'flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-white';
    priceTabVideo.className = 'flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-white/40 hover:text-white/60';
    renderPricing('marketing');
  });

  priceTabVideo.addEventListener('click', () => {
    if (currentPricingCategory === 'video') return;
    currentPricingCategory = 'video';
    pricingSlider.style.transform = 'translateX(calc(100% + 6px))';
    priceTabVideo.className = 'flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-white';
    priceTabMarketing.className = 'flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-white/40 hover:text-white/60';
    renderPricing('video');
  });

  // Render Marketing plans initially
  renderPricing('marketing');


  // 6. WhatsApp Inquiry Form Submission
  const whatsappForm = document.getElementById('whatsapp-form');
  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = whatsappForm.querySelector('[name="name"]').value;
      const phone = whatsappForm.querySelector('[name="phone"]').value;
      const message = whatsappForm.querySelector('[name="message"]').value;
      
      // Formatted WhatsApp Message
      const textMessage = `Hello Authority-Driven Team!\n\n*New Inquiry*\n*Name:* ${name}\n*Contact:* ${phone}\n*Message:* ${message}`;
      const encodedMsg = encodeURIComponent(textMessage);
      const whatsappUrl = `https://wa.me/918610645268?text=${encodedMsg}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
