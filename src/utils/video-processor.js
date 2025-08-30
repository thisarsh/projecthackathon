export class VideoProcessor {
    constructor() {
        this.testProcessors = {
            vertical_jump: this.processVerticalJump.bind(this),
            situps: this.processSitups.bind(this),
            sprint: this.processSprint.bind(this),
            pushups: this.processPushups.bind(this),
            flexibility: this.processFlexibility.bind(this)
        };
    }

    processVideo(testType, athleteData) {
        // Simulate AI processing with realistic results
        const processor = this.testProcessors[testType];
        if (!processor) {
            throw new Error(`Unknown test type: ${testType}`);
        }

        return processor(athleteData);
    }

    processVerticalJump(athleteData) {
        // Simulate vertical jump analysis
        const baseHeight = athleteData.gender === 'Male' ? 45 : 35;
        const ageAdjustment = Math.max(0, (25 - athleteData.age) * 0.5);
        const randomVariation = (Math.random() - 0.5) * 10;
        
        const jumpHeight = Math.max(20, baseHeight + ageAdjustment + randomVariation);
        const score = Math.min(100, Math.max(0, (jumpHeight / 60) * 100));

        return {
            overall_score: Math.round(score),
            performance_metrics: {
                primary_metric: jumpHeight.toFixed(1),
                metric_name: 'Jump Height',
                unit: 'cm',
                secondary_metrics: {
                    takeoff_velocity: (Math.sqrt(2 * 9.81 * jumpHeight / 100)).toFixed(2),
                    hang_time: (2 * Math.sqrt(2 * jumpHeight / 100 / 9.81)).toFixed(3)
                }
            },
            percentile: this.calculatePercentile(score, athleteData),
            quality_score: 85 + Math.random() * 15,
            cheat_detection: {
                confidence: 0.95 + Math.random() * 0.05,
                flags: []
            },
            recommendations: this.getRecommendations('vertical_jump', score)
        };
    }

    processSitups(athleteData) {
        const baseReps = athleteData.gender === 'Male' ? 35 : 30;
        const ageAdjustment = Math.max(0, (25 - athleteData.age) * 0.3);
        const randomVariation = (Math.random() - 0.5) * 8;
        
        const reps = Math.max(10, Math.round(baseReps + ageAdjustment + randomVariation));
        const score = Math.min(100, (reps / 50) * 100);

        return {
            overall_score: Math.round(score),
            performance_metrics: {
                primary_metric: reps,
                metric_name: 'Repetitions',
                unit: 'reps',
                secondary_metrics: {
                    average_pace: (60 / reps).toFixed(1),
                    form_consistency: (85 + Math.random() * 15).toFixed(1)
                }
            },
            percentile: this.calculatePercentile(score, athleteData),
            quality_score: 80 + Math.random() * 20,
            cheat_detection: {
                confidence: 0.92 + Math.random() * 0.08,
                flags: []
            },
            recommendations: this.getRecommendations('situps', score)
        };
    }

    processSprint(athleteData) {
        const baseTime = athleteData.gender === 'Male' ? 7.0 : 8.0;
        const ageAdjustment = Math.max(0, (athleteData.age - 20) * 0.05);
        const randomVariation = (Math.random() - 0.5) * 0.8;
        
        const time = Math.max(5.5, baseTime + ageAdjustment + randomVariation);
        const score = Math.min(100, Math.max(0, (10 - time) / 4 * 100));

        return {
            overall_score: Math.round(score),
            performance_metrics: {
                primary_metric: time.toFixed(2),
                metric_name: 'Time',
                unit: 'seconds',
                secondary_metrics: {
                    top_speed: (50 / time * 3.6).toFixed(1),
                    acceleration: (10 / (time * time)).toFixed(2)
                }
            },
            percentile: this.calculatePercentile(score, athleteData),
            quality_score: 90 + Math.random() * 10,
            cheat_detection: {
                confidence: 0.98 + Math.random() * 0.02,
                flags: []
            },
            recommendations: this.getRecommendations('sprint', score)
        };
    }

    processPushups(athleteData) {
        const baseReps = athleteData.gender === 'Male' ? 25 : 18;
        const ageAdjustment = Math.max(0, (25 - athleteData.age) * 0.4);
        const randomVariation = (Math.random() - 0.5) * 6;
        
        const reps = Math.max(5, Math.round(baseReps + ageAdjustment + randomVariation));
        const score = Math.min(100, (reps / 40) * 100);

        return {
            overall_score: Math.round(score),
            performance_metrics: {
                primary_metric: reps,
                metric_name: 'Repetitions',
                unit: 'reps',
                secondary_metrics: {
                    average_pace: (60 / reps).toFixed(1),
                    form_score: (80 + Math.random() * 20).toFixed(1)
                }
            },
            percentile: this.calculatePercentile(score, athleteData),
            quality_score: 82 + Math.random() * 18,
            cheat_detection: {
                confidence: 0.90 + Math.random() * 0.10,
                flags: []
            },
            recommendations: this.getRecommendations('pushups', score)
        };
    }

    processFlexibility(athleteData) {
        const baseReach = athleteData.gender === 'Male' ? 12 : 16;
        const ageAdjustment = Math.max(0, (30 - athleteData.age) * 0.2);
        const randomVariation = (Math.random() - 0.5) * 6;
        
        const reach = Math.max(0, baseReach + ageAdjustment + randomVariation);
        const score = Math.min(100, (reach / 25) * 100);

        return {
            overall_score: Math.round(score),
            performance_metrics: {
                primary_metric: reach.toFixed(1),
                metric_name: 'Reach Distance',
                unit: 'cm',
                secondary_metrics: {
                    flexibility_index: (reach / 20 * 100).toFixed(1),
                    symmetry_score: (90 + Math.random() * 10).toFixed(1)
                }
            },
            percentile: this.calculatePercentile(score, athleteData),
            quality_score: 88 + Math.random() * 12,
            cheat_detection: {
                confidence: 0.93 + Math.random() * 0.07,
                flags: []
            },
            recommendations: this.getRecommendations('flexibility', score)
        };
    }

    calculatePercentile(score, athleteData) {
        // Simulate percentile calculation based on age and gender
        const basePercentile = score * 0.8;
        const ageBonus = athleteData.age < 22 ? 5 : 0;
        return Math.min(99, Math.round(basePercentile + ageBonus + Math.random() * 10));
    }

    getRecommendations(testType, score) {
        const recommendations = {
            vertical_jump: {
                high: ['Excellent explosive power!', 'Focus on maintaining technique', 'Consider plyometric training'],
                medium: ['Good foundation', 'Work on leg strength', 'Practice jump technique'],
                low: ['Focus on basic strength training', 'Improve flexibility', 'Practice proper form']
            },
            situps: {
                high: ['Outstanding core strength!', 'Maintain consistency', 'Add variety to core workouts'],
                medium: ['Solid core foundation', 'Increase training frequency', 'Focus on form quality'],
                low: ['Build basic core strength', 'Start with modified exercises', 'Improve endurance gradually']
            },
            sprint: {
                high: ['Excellent speed!', 'Work on race strategy', 'Maintain technique at high speeds'],
                medium: ['Good speed foundation', 'Improve acceleration', 'Work on running form'],
                low: ['Focus on basic running technique', 'Build leg strength', 'Improve cardiovascular fitness']
            },
            pushups: {
                high: ['Great upper body strength!', 'Vary push-up types', 'Maintain proper form'],
                medium: ['Good strength base', 'Increase training volume', 'Focus on full range of motion'],
                low: ['Build basic upper body strength', 'Start with modified push-ups', 'Improve gradually']
            },
            flexibility: {
                high: ['Excellent flexibility!', 'Maintain regular stretching', 'Focus on dynamic mobility'],
                medium: ['Good flexibility range', 'Increase stretching frequency', 'Work on problem areas'],
                low: ['Improve basic flexibility', 'Daily stretching routine', 'Consider yoga or mobility work']
            }
        };

        const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
        return recommendations[testType][level];
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

    getPerformanceStats() {
        const assessments = this.data.assessments;
        if (assessments.length === 0) {
            return { total: 0, average: 0, distribution: {} };
        }

        const total = assessments.length;
        const average = assessments.reduce((sum, a) => sum + a.overall_score, 0) / total;
        
        const distribution = {};
        assessments.forEach(a => {
            distribution[a.test_type] = (distribution[a.test_type] || 0) + 1;
        });

        return { total, average, distribution };
    }
}