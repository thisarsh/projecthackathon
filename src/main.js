import { DatabaseManager } from './utils/database.js';
import { VideoProcessor } from './utils/video-processor.js';
import { UIManager } from './utils/ui-manager.js';
import { ChartManager } from './utils/chart-manager.js';

class SAIApp {
    constructor() {
        this.db = new DatabaseManager();
        this.videoProcessor = new VideoProcessor();
        this.ui = new UIManager();
        this.charts = new ChartManager();
        this.currentPage = 'dashboard';
        this.selectedTest = null;
        this.isOfficialLoggedIn = false;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAssessmentPage();
        this.setupOfficialsPage();
        this.setupLeaderboardPage();
        this.loadDashboard();
        
        // Initialize with sample data
        this.db.initializeSampleData();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update page content
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');

        this.currentPage = page;

        // Load page-specific content
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'officials':
                this.loadOfficialsPage();
                break;
            case 'leaderboard':
                this.loadLeaderboard();
                break;
        }
    }

    setupAssessmentPage() {
        // Test selection
        const testCards = document.querySelectorAll('.test-card');
        testCards.forEach(card => {
            card.addEventListener('click', () => {
                testCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedTest = card.dataset.test;
                document.getElementById('video-upload').style.display = 'block';
            });
        });

        // Video upload
        const uploadArea = document.querySelector('.upload-area');
        const videoFile = document.getElementById('video-file');
        const videoPreview = document.getElementById('video-preview');
        const analyzeBtn = document.getElementById('analyze-btn');

        uploadArea.addEventListener('click', () => videoFile.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleVideoUpload(files[0]);
            }
        });

        videoFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleVideoUpload(e.target.files[0]);
            }
        });

        analyzeBtn.addEventListener('click', () => {
            this.analyzeVideo();
        });
    }

    handleVideoUpload(file) {
        if (file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            const videoPreview = document.getElementById('video-preview');
            const uploadPlaceholder = document.getElementById('upload-placeholder');
            
            videoPreview.src = url;
            videoPreview.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
            
            document.getElementById('analyze-btn').disabled = false;
            this.currentVideoFile = file;
        }
    }

    async analyzeVideo() {
        const analyzeBtn = document.getElementById('analyze-btn');
        const resultsSection = document.getElementById('results-section');
        
        analyzeBtn.textContent = '🔄 Analyzing...';
        analyzeBtn.disabled = true;

        // Simulate video processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Get athlete info
        const athleteData = {
            name: document.getElementById('athlete-name').value,
            age: parseInt(document.getElementById('athlete-age').value),
            gender: document.getElementById('athlete-gender').value,
            sport: document.getElementById('athlete-sport').value
        };

        // Process video and get results
        const results = this.videoProcessor.processVideo(this.selectedTest, athleteData);
        
        // Save athlete and assessment
        const athleteId = this.db.addAthlete(athleteData);
        this.db.addAssessment(athleteId, this.selectedTest, results);

        // Display results
        this.displayResults(results);
        resultsSection.style.display = 'block';
        
        analyzeBtn.textContent = '✅ Analysis Complete';
        
        // Update dashboard stats
        this.updateDashboardStats();
    }

    displayResults(results) {
        const resultsGrid = document.getElementById('results-grid');
        resultsGrid.innerHTML = `
            <div class="result-card">
                <div class="result-score">${results.overall_score}</div>
                <div class="result-label">Overall Score</div>
                <div class="result-description">Out of 100</div>
            </div>
            <div class="result-card">
                <div class="result-score">${results.performance_metrics.primary_metric}</div>
                <div class="result-label">${results.performance_metrics.metric_name}</div>
                <div class="result-description">${results.performance_metrics.unit}</div>
            </div>
            <div class="result-card">
                <div class="result-score">${results.percentile}%</div>
                <div class="result-label">Percentile Rank</div>
                <div class="result-description">Among peers</div>
            </div>
            <div class="result-card">
                <div class="result-score">${results.quality_score}%</div>
                <div class="result-label">Video Quality</div>
                <div class="result-description">Analysis confidence</div>
            </div>
        `;
    }

    setupOfficialsPage() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'sai_official' && password === 'demo123') {
                this.isOfficialLoggedIn = true;
                document.getElementById('auth-section').style.display = 'none';
                document.getElementById('officials-content').style.display = 'block';
                this.loadOfficialsData();
            } else {
                alert('Invalid credentials. Use: sai_official / demo123');
            }
        });

        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');

        if (tab === 'analytics') {
            setTimeout(() => this.loadAnalyticsCharts(), 100);
        }
    }

    loadOfficialsData() {
        this.loadAthletesTable();
        this.loadAssessmentsTable();
    }

    loadAthletesTable() {
        const tbody = document.getElementById('athletes-tbody');
        const athletes = this.db.getAthletes();
        
        tbody.innerHTML = athletes.map(athlete => `
            <tr>
                <td>${athlete.name}</td>
                <td>${athlete.age}</td>
                <td>${athlete.gender}</td>
                <td>${athlete.sport}</td>
                <td>${new Date(athlete.registration_date).toLocaleDateString()}</td>
                <td>${this.db.getAssessmentsByAthlete(athlete.id).length}</td>
            </tr>
        `).join('');
    }

    loadAssessmentsTable() {
        const tbody = document.getElementById('assessments-tbody');
        const assessments = this.db.getAssessments();
        
        tbody.innerHTML = assessments.map(assessment => {
            const athlete = this.db.getAthlete(assessment.athlete_id);
            return `
                <tr>
                    <td>${athlete.name}</td>
                    <td>${assessment.test_type.replace('_', ' ').toUpperCase()}</td>
                    <td>${assessment.overall_score}</td>
                    <td>${new Date(assessment.timestamp).toLocaleDateString()}</td>
                    <td><span class="status-badge completed">Completed</span></td>
                    <td><button class="action-btn">View Details</button></td>
                </tr>
            `;
        }).join('');
    }

    setupLeaderboardPage() {
        const sportFilter = document.getElementById('sport-filter');
        const testFilter = document.getElementById('test-filter');
        
        sportFilter.addEventListener('change', () => this.loadLeaderboard());
        testFilter.addEventListener('change', () => this.loadLeaderboard());
    }

    loadDashboard() {
        this.updateDashboardStats();
        this.loadPerformanceChart();
    }

    updateDashboardStats() {
        const athletes = this.db.getAthletes();
        const assessments = this.db.getAssessments();
        const avgScore = assessments.length > 0 
            ? (assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length).toFixed(1)
            : '0.0';

        document.getElementById('total-athletes').textContent = athletes.length;
        document.getElementById('total-assessments').textContent = assessments.length;
        document.getElementById('avg-score').textContent = avgScore;
    }

    loadPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const assessments = this.db.getAssessments();
        if (assessments.length === 0) {
            ctx.parentElement.innerHTML = '<p class="text-center">📈 Analytics will appear here once assessments are completed</p>';
            return;
        }

        const scores = assessments.map(a => a.overall_score);
        const bins = this.createHistogramBins(scores, 10);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: 'Number of Athletes',
                    data: bins.counts,
                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance Score Distribution'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Score Range'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Athletes'
                        }
                    }
                }
            }
        });
    }

    loadAnalyticsCharts() {
        this.loadScoreDistributionChart();
        this.loadCategoryChart();
    }

    loadScoreDistributionChart() {
        const ctx = document.getElementById('scoreDistributionChart');
        const assessments = this.db.getAssessments();
        
        if (assessments.length === 0) return;

        const scores = assessments.map(a => a.overall_score);
        const bins = this.createHistogramBins(scores, 8);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: bins.labels,
                datasets: [{
                    data: bins.counts,
                    backgroundColor: [
                        '#ef4444', '#f97316', '#eab308', '#22c55e',
                        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    loadCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        const assessments = this.db.getAssessments();
        
        const testCounts = {};
        assessments.forEach(a => {
            testCounts[a.test_type] = (testCounts[a.test_type] || 0) + 1;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(testCounts).map(test => test.replace('_', ' ').toUpperCase()),
                datasets: [{
                    label: 'Number of Tests',
                    data: Object.values(testCounts),
                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    loadOfficialsPage() {
        if (!this.isOfficialLoggedIn) {
            document.getElementById('auth-section').style.display = 'flex';
            document.getElementById('officials-content').style.display = 'none';
        }
    }

    loadLeaderboard() {
        const sportFilter = document.getElementById('sport-filter').value;
        const testFilter = document.getElementById('test-filter').value;
        
        let assessments = this.db.getAssessments();
        
        // Apply filters
        if (sportFilter) {
            assessments = assessments.filter(a => {
                const athlete = this.db.getAthlete(a.athlete_id);
                return athlete.sport === sportFilter;
            });
        }
        
        if (testFilter) {
            assessments = assessments.filter(a => a.test_type === testFilter);
        }

        // Sort by score
        assessments.sort((a, b) => b.overall_score - a.overall_score);

        // Group by athlete and get best scores
        const athleteScores = {};
        assessments.forEach(assessment => {
            const athleteId = assessment.athlete_id;
            if (!athleteScores[athleteId] || assessment.overall_score > athleteScores[athleteId].overall_score) {
                athleteScores[athleteId] = assessment;
            }
        });

        const topAthletes = Object.values(athleteScores).slice(0, 20);

        const leaderboardBody = document.getElementById('leaderboard-body');
        leaderboardBody.innerHTML = topAthletes.map((assessment, index) => {
            const athlete = this.db.getAthlete(assessment.athlete_id);
            const rank = index + 1;
            let rankClass = '';
            if (rank === 1) rankClass = 'gold';
            else if (rank === 2) rankClass = 'silver';
            else if (rank === 3) rankClass = 'bronze';

            return `
                <div class="leaderboard-row ${rank <= 3 ? 'top-3' : ''}">
                    <div class="rank-col">
                        <div class="rank-badge ${rankClass}">${rank}</div>
                    </div>
                    <div class="athlete-col">
                        <div class="athlete-info">
                            <div class="athlete-name">${athlete.name}</div>
                            <div class="athlete-details">${athlete.age}y, ${athlete.gender}, ${athlete.sport}</div>
                        </div>
                    </div>
                    <div class="score-col">
                        <div class="score-value">${assessment.overall_score}</div>
                    </div>
                    <div class="test-col">${assessment.test_type.replace('_', ' ')}</div>
                    <div class="date-col">${new Date(assessment.timestamp).toLocaleDateString()}</div>
                </div>
            `;
        }).join('');
    }

    createHistogramBins(data, numBins) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binSize = (max - min) / numBins;
        
        const bins = Array(numBins).fill(0);
        const labels = [];
        
        for (let i = 0; i < numBins; i++) {
            const start = min + i * binSize;
            const end = min + (i + 1) * binSize;
            labels.push(`${start.toFixed(0)}-${end.toFixed(0)}`);
        }
        
        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binSize), numBins - 1);
            bins[binIndex]++;
        });
        
        return { labels, counts: bins };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SAIApp();
});