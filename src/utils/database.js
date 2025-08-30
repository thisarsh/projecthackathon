export class DatabaseManager {
    constructor() {
        this.data = {
            athletes: [],
            assessments: [],
            officials: [
                { id: 1, username: 'sai_official', password: 'demo123', name: 'SAI Administrator' }
            ]
        };
        this.nextAthleteId = 1;
        this.nextAssessmentId = 1;
    }

    initializeSampleData() {
        // Add sample athletes
        const sampleAthletes = [
            { name: 'Rajesh Kumar', age: 22, gender: 'Male', sport: 'Athletics' },
            { name: 'Priya Sharma', age: 19, gender: 'Female', sport: 'Swimming' },
            { name: 'Arjun Singh', age: 24, gender: 'Male', sport: 'Football' }
        ];

        sampleAthletes.forEach(athlete => {
            const athleteId = this.addAthlete(athlete);
            
            // Add sample assessments
            const assessments = [
                { test: 'vertical_jump', score: 75 + Math.random() * 20 },
                { test: 'situps', score: 70 + Math.random() * 25 },
                { test: 'sprint', score: 65 + Math.random() * 30 }
            ];

            assessments.forEach(assessment => {
                const results = {
                    overall_score: Math.round(assessment.score),
                    performance_metrics: {
                        primary_metric: this.getRandomMetric(assessment.test),
                        metric_name: this.getMetricName(assessment.test),
                        unit: this.getMetricUnit(assessment.test)
                    },
                    percentile: Math.round(assessment.score * 0.8 + Math.random() * 20),
                    quality_score: 85 + Math.random() * 15,
                    cheat_detection: {
                        confidence: 0.95 + Math.random() * 0.05,
                        flags: []
                    }
                };
                this.addAssessment(athleteId, assessment.test, results);
            });
        });
    }

    getRandomMetric(testType) {
        const metrics = {
            vertical_jump: () => (40 + Math.random() * 20).toFixed(1),
            situps: () => Math.round(25 + Math.random() * 20),
            sprint: () => (6.5 + Math.random() * 2).toFixed(2),
            pushups: () => Math.round(20 + Math.random() * 25),
            flexibility: () => (15 + Math.random() * 10).toFixed(1)
        };
        return metrics[testType]();
    }

    getMetricName(testType) {
        const names = {
            vertical_jump: 'Jump Height',
            situps: 'Repetitions',
            sprint: 'Time',
            pushups: 'Repetitions',
            flexibility: 'Reach Distance'
        };
        return names[testType];
    }

    getMetricUnit(testType) {
        const units = {
            vertical_jump: 'cm',
            situps: 'reps',
            sprint: 'seconds',
            pushups: 'reps',
            flexibility: 'cm'
        };
        return units[testType];
    }

    addAthlete(athleteData) {
        const athlete = {
            id: this.nextAthleteId++,
            ...athleteData,
            registration_date: new Date().toISOString()
        };
        this.data.athletes.push(athlete);
        return athlete.id;
    }

    addAssessment(athleteId, testType, results) {
        const assessment = {
            id: this.nextAssessmentId++,
            athlete_id: athleteId,
            test_type: testType,
            timestamp: new Date().toISOString(),
            ...results
        };
        this.data.assessments.push(assessment);
        return assessment.id;
    }

    getAthletes() {
        return this.data.athletes;
    }

    getAthlete(id) {
        return this.data.athletes.find(a => a.id === id);
    }

    getAssessments() {
        return this.data.assessments;
    }

    getAssessmentsByAthlete(athleteId) {
        return this.data.assessments.filter(a => a.athlete_id === athleteId);
    }

    getTopPerformers(limit = 10, sport = null, testType = null) {
        let assessments = this.data.assessments;
        
        if (sport) {
            assessments = assessments.filter(a => {
                const athlete = this.getAthlete(a.athlete_id);
                return athlete.sport === sport;
            });
        }
        
        if (testType) {
            assessments = assessments.filter(a => a.test_type === testType);
        }

        return assessments
            .sort((a, b) => b.overall_score - a.overall_score)
            .slice(0, limit);
    }
}