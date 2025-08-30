export class ChartManager {
    constructor() {
        this.charts = new Map();
    }

    createChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        // Destroy existing chart if it exists
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }

        const chart = new Chart(canvas, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }

    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }

    destroyAllCharts() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }

    createPerformanceDistributionChart(canvasId, scores) {
        const bins = this.createHistogramBins(scores, 10);
        
        return this.createChart(canvasId, {
            type: 'bar',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: 'Number of Athletes',
                    data: bins.counts,
                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance Score Distribution',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
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
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createTestCategoryChart(canvasId, assessments) {
        const testCounts = {};
        assessments.forEach(a => {
            const testName = a.test_type.replace('_', ' ').toUpperCase();
            testCounts[testName] = (testCounts[testName] || 0) + 1;
        });

        return this.createChart(canvasId, {
            type: 'doughnut',
            data: {
                labels: Object.keys(testCounts),
                datasets: [{
                    data: Object.values(testCounts),
                    backgroundColor: [
                        '#ef4444', '#f97316', '#eab308', '#22c55e',
                        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Test Distribution by Category',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createPerformanceTrendChart(canvasId, athleteAssessments) {
        const sortedAssessments = athleteAssessments.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );

        const labels = sortedAssessments.map(a => 
            new Date(a.timestamp).toLocaleDateString()
        );
        const scores = sortedAssessments.map(a => a.overall_score);

        return this.createChart(canvasId, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Performance Score',
                    data: scores,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance Trend Over Time',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Score'
                        },
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    createHistogramBins(data, numBins) {
        if (data.length === 0) return { labels: [], counts: [] };
        
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

    animateCountUp(element, target, duration = 1000) {
        const start = parseInt(element.textContent) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (target - start) * this.easeOutQuart(progress);
            element.textContent = Math.round(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
}