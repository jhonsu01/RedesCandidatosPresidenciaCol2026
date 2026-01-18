document.addEventListener('DOMContentLoaded', () => {
    const candidatesList = document.getElementById('candidates-list');
    const sortSelect = document.getElementById('sort-select');
    const lastUpdateLabel = document.getElementById('last-update');
    
    let candidatesData = [];

    // Election Date: May 24, 2026 (Estimate)
    const ELECTION_DATE = new Date('2026-05-24T08:00:00-05:00').getTime();

    // 1. Initialize
    init();

    function init() {
        startCountdown();
        fetchData();
        
        sortSelect.addEventListener('change', () => {
            renderCandidates();
        });
    }

    // 2. Fetch Data
    async function fetchData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            // Process data: sum totals if not already present
            candidatesData = data.map(c => {
                const total = (c.followers.instagram || 0) + (c.followers.tiktok || 0) + (c.followers.facebook || 0);
                return { ...c, calculatedTotal: total };
            });

            // Set last update text (mock or from file)
            // In a real scenario, we might have a metadata.json or a field in the array
            // For now, assume today if specific date is missing
            const lastUpdate = candidatesData[0]?.last_update || new Date().toLocaleDateString();
            lastUpdateLabel.innerText = `Actualizado: ${lastUpdate}`;

            renderCandidates();
        } catch (error) {
            console.error('Error loading data:', error);
            candidatesList.innerHTML = '<div style="text-align:center">Error cargando datos. Por favor recarga.</div>';
        }
    }

    // 3. Render
    function renderCandidates() {
        if (!candidatesData.length) return;

        const sortKey = sortSelect.value;
        
        // Sorting Logic
        const sorted = [...candidatesData].sort((a, b) => {
            let valA, valB;

            if (sortKey === 'total') {
                valA = a.calculatedTotal;
                valB = b.calculatedTotal;
            } else if (sortKey === 'growth') {
                // Mock growth logic if we had history. 
                // For now, fallback to total or specific logic
                valA = a.calculatedTotal; 
                valB = b.calculatedTotal;
            } else {
                valA = a.followers[sortKey] || 0;
                valB = b.followers[sortKey] || 0;
            }
            return valB - valA; // Descending
        });

        candidatesList.innerHTML = '';

        sorted.forEach((candidate, index) => {
            const card = document.createElement('div');
            card.className = 'candidate-card';
            
            // SVG Icons
            const iconIg = `<svg class="social-icon" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>`;
            const iconTk = `<svg class="social-icon" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a90.25,90.25,0,1,0,43.7,77.81V73.75H229.08L220,73.81a176.67,176.67,0,0,0,94.24,53.28v82.82Z"/></svg>`; // Simplification
            const iconFb = `<svg class="social-icon" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>`;

            const instagramVal = candidate.followers.instagram || 0;
            const tiktokVal = candidate.followers.tiktok || 0;
            const facebookVal = candidate.followers.facebook || 0;

            let trendIcon = '•'; // Default
            let trendClass = 'trend-equal';
            if (candidate.trend === 'up') { trendIcon = '▲'; trendClass = 'trend-up'; }
            if (candidate.trend === 'down') { trendIcon = '▼'; trendClass = 'trend-down'; }

            card.innerHTML = `
                <div class="rank">#${index + 1}</div>
                <div class="candidate-info">
                    <div class="candidate-name">${candidate.name}</div>
                    <div class="candidate-sector">${candidate.sector}</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">${iconIg} Insta</div>
                        <div class="stat-value">${formatNumber(instagramVal)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">${iconTk} TikTok</div>
                        <div class="stat-value">${formatNumber(tiktokVal)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">${iconFb} FB</div>
                        <div class="stat-value">${formatNumber(facebookVal)}</div>
                    </div>
                </div>
                <div class="total-followers">
                    <div class="total-label">Total Seguidores</div>
                    <div class="total-val">${formatNumber(candidate.calculatedTotal)}</div>
                    <div class="trend-indicator ${trendClass}">
                        ${trendIcon} ${candidate.last_days_growth ? '+' + formatNumber(candidate.last_days_growth) : ''}
                    </div>
                </div>
            `;
            candidatesList.appendChild(card);
        });
    }

    // 4. Countdown
    function startCountdown() {
        const countdownEl = document.getElementById('countdown');
        
        setInterval(() => {
            const now = new Date().getTime();
            const distance = ELECTION_DATE - now;

            if (distance < 0) {
                countdownEl.innerHTML = "¡Es día de elecciones!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownEl.innerHTML = `
                <div class="countdown-item"><span class="countdown-val">${days}</span><span class="countdown-label">Días</span></div>
                <div class="countdown-item"><span class="countdown-val">${hours}</span><span class="countdown-label">Hs</span></div>
                <div class="countdown-item"><span class="countdown-val">${minutes}</span><span class="countdown-label">Min</span></div>
                <div class="countdown-item"><span class="countdown-val">${seconds}</span><span class="countdown-label">Seg</span></div>
            `;
        }, 1000);
    }

    function formatNumber(num) {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    }
});
