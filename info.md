# Overview

This is a Sports Authority of India (SAI) AI-Powered Athletic Talent Assessment Platform built with Streamlit. The platform enables remote assessment of athletic talent through mobile video recording and AI-powered analysis. Athletes can record fitness test videos (vertical jump, sit-ups, sprints, push-ups, flexibility) using their smartphones, which are then analyzed using computer vision and machine learning to extract performance metrics, detect potential cheating, and provide standardized scoring against age/gender benchmarks.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Streamlit web application with multi-page architecture
- **Pages**: Main dashboard, athlete assessment interface, official dashboard, and public leaderboard
- **UI Components**: Mobile-first design with video upload, real-time analysis feedback, and interactive data visualizations using Plotly
- **State Management**: Streamlit session state for user authentication and data persistence

## Backend Architecture
- **Video Processing**: OpenCV and MediaPipe for pose estimation, motion analysis, and frame quality assessment
- **AI/ML Pipeline**: Computer vision models for extracting fitness metrics (jump height, rep counting, timing) from video data
- **Scoring Engine**: Age/gender-normalized performance scoring system based on standardized benchmarks
- **Cheat Detection**: Multi-layer anomaly detection including video manipulation detection, movement consistency analysis, and temporal verification

## Data Storage Solutions
- **Database**: Simple JSON-based file storage system with in-memory caching for development
- **Schema**: Separate collections for athletes, assessments, officials, and performance benchmarks
- **Thread Safety**: Implemented locking mechanisms for concurrent access
- **Data Structure**: Normalized data with athlete profiles linked to assessment records

## Authentication and Authorization
- **Simplified Authentication**: Basic session-based authentication for officials dashboard
- **Role-Based Access**: Separate interfaces for athletes (assessment) and officials (analytics/management)
- **Data Privacy**: Athlete information isolation and secure data handling

## Performance Analysis Components
- **Test Processors**: Specialized algorithms for each fitness test type (vertical jump, sit-ups, sprint, push-ups, flexibility)
- **Benchmark Comparison**: Age-group and gender-based performance standards for scoring
- **Real-time Feedback**: Instant performance analysis and scoring upon video upload
- **Quality Assurance**: Video quality validation and pose detection accuracy verification

# External Dependencies

## Computer Vision Libraries
- **OpenCV**: Core video processing, frame analysis, and motion detection
- **MediaPipe**: Google's pose estimation and face detection models for human movement analysis

## Web Framework and UI
- **Streamlit**: Main web application framework for rapid development and deployment
- **Plotly**: Interactive data visualization for dashboards and analytics

## Data Processing
- **Pandas**: Data manipulation and analysis for athlete records and performance metrics
- **NumPy**: Numerical computations for video analysis and scoring algorithms

## Development Tools
- **Python Standard Library**: Core functionality including JSON handling, datetime operations, and file I/O
- **Threading**: Concurrent access management for database operations

## Future Integration Points
- **Mobile Application**: Planned native mobile app for video recording with on-device preliminary analysis
- **Cloud Storage**: Integration planned for scalable video storage and processing
- **Advanced ML Models**: Custom trained models for sport-specific movement analysis and performance prediction
- **Database Migration**: Ready for migration to PostgreSQL or other production databases for scalability