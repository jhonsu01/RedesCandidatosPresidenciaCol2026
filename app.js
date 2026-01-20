document.addEventListener('DOMContentLoaded', () => {
    const candidatesList = document.getElementById('candidates-list');
    const sortSelect = document.getElementById('sort-select');
    const lastUpdateLabel = document.getElementById('last-update');
    
    let candidatesData = [];
    const ELECTION_DATE = new Date('2026-05-24T08:00:00-05:00').getTime();

    init();

    function init() {
        startCountdown();
        fetchData();
        sortSelect.addEventListener('change', renderCandidates);
    }

    async function fetchData() {
        try {
            const response = await fetch('data.json?t=' + Date.now());
            candidatesData = await response.json();
            
            candidatesData = candidatesData.map(c => ({
                ...c,
                calculatedTotal: (c.followers.instagram || 0) + (c.followers.tiktok || 0) + (c.followers.facebook || 0)
            }));

            lastUpdateLabel.innerText = `Actualizado: ${candidatesData[0]?.last_update || 'Reciente'}`;
            renderCandidates();
        } catch (error) {
            console.error('Error:', error);
            candidatesList.innerHTML = '<div style="text-align:center">Error cargando datos.</div>';
        }
    }

    function renderCandidates() {
        if (!candidatesData.length) return;

        const sortKey = sortSelect.value;
        const sorted = [...candidatesData].sort((a, b) => {
            let valA = sortKey === 'total' ? a.calculatedTotal : (sortKey === 'growth' ? a.last_days_growth : a.followers[sortKey]);
            let valB = sortKey === 'total' ? b.calculatedTotal : (sortKey === 'growth' ? b.last_days_growth : b.followers[sortKey]);
            return (valB || 0) - (valA || 0);
        });

        candidatesList.innerHTML = '';
        sorted.forEach((c, i) => {
            const card = document.createElement('div');
            card.className = 'candidate-card';
            const trendIcon = c.trend === 'up' ? '▲' : (c.trend === 'down' ? '▼' : '•');
            const trendClass = `trend-${c.trend}`;
            const socialLinks = buildSocialLinks(c.socials);

            card.innerHTML = `
                <div class="photo-container">
                    <img src="${c.photo || 'https://via.placeholder.com/80?text=Avatar'}"
                         class="candidate-photo"
                         alt="${c.name}"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&size=80'">
                    <div class="candidate-rank">#${i + 1}</div>
                </div>
                <div class="candidate-info">
                    <div class="candidate-name">${c.name}</div>
                    <div class="candidate-sector">${c.sector}</div>
                    <div class="social-links">${socialLinks}</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-item"><div class="stat-label">Insta</div><div class="stat-value">${formatNumber(c.followers.instagram)}</div></div>
                    <div class="stat-item"><div class="stat-label">TikTok</div><div class="stat-value">${formatNumber(c.followers.tiktok)}</div></div>
                    <div class="stat-item"><div class="stat-label">FB</div><div class="stat-value">${formatNumber(c.followers.facebook)}</div></div>
                </div>
                <div class="total-followers">
                    <div class="total-label">Total</div>
                    <div class="total-val">${formatNumber(c.calculatedTotal)}</div>
                    <div class="trend-indicator ${trendClass}">${trendIcon} ${c.last_days_growth ? '+' + formatNumber(c.last_days_growth) : ''}</div>
                </div>`;
            candidatesList.appendChild(card);
        });
    }

    function buildSocialLinks(socials) {
        const baseUrls = {
            instagram: 'https://www.instagram.com/',
            tiktok: 'https://www.tiktok.com/@',
            facebook: 'https://www.facebook.com/',
            x: 'https://x.com/'
        };
        const icons = {
            instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
            tiktok: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>`,
            facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`,
            x: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>`
        };

        let links = '';
        for (const [platform, username] of Object.entries(socials)) {
            if (username && icons[platform]) {
                const url = baseUrls[platform] + username;
                links += `<a href="${url}" target="_blank" rel="noopener noreferrer" class="social-icon social-${platform}" title="${platform}">${icons[platform]}</a>`;
            }
        }
        return links;
    }

    function startCountdown() {
        const countdownEl = document.getElementById('countdown');
        setInterval(() => {
            const distance = ELECTION_DATE - Date.now();
            if (distance < 0) { countdownEl.innerHTML = "¡Elecciones!"; return; }
            const d = Math.floor(distance / 86400000), h = Math.floor((distance % 86400000) / 3600000), m = Math.floor((distance % 3600000) / 60000), s = Math.floor((distance % 60000) / 1000);
            countdownEl.innerHTML = `<div class="countdown-item"><span>${d}</span><small>Días</small></div><div class="countdown-item"><span>${h}</span><small>Hs</small></div><div class="countdown-item"><span>${m}</span><small>Min</small></div><div class="countdown-item"><span>${s}</span><small>Seg</small></div>`;
        }, 1000);
    }

    function formatNumber(num) {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    }
});
