# T013 — Statistics & Analytics

## Goal
Provide comprehensive progress visualization and insights through charts, graphs, and metrics.

## Scope
- Statistics screen with sections:
  - **Overview cards**: Total study time, total words learned, current streak, best streak, average accuracy
  - **Learning Progress Chart**: Line/bar chart showing words learned over time with timeframe selector (Week/Month/Year/All)
  - **Accuracy by Level**: Bar chart showing performance across CEFR levels (A1-C2)
  - **Topic Distribution**: Pie/donut chart showing words learned by topic
  - **Activity Heatmap**: Calendar view showing daily activity (color intensity = words learned)
  - **Detailed Metrics Table**: Breakdown by level, by topic, mastery percentage, average time per word
- API endpoints:
  - Get statistics summary
  - Get learning activity timeline
  - Get accuracy breakdown by level
  - Get topic distribution data
  - Get activity heatmap data (last 365 days)
- Chart library integration:
  - react-native-chart-kit or react-native-svg-charts
  - Victory Native for advanced charts

## Requirements
- Charts must update in real-time as user progresses
- Support multiple timeframes for time-series data
- Accurate calculation of all metrics from database
- Follow MOBILE_UI_SPEC.md color scheme for charts
- Smooth animations for chart rendering
- Handle edge cases (no data, single data point)
- Export capability (future consideration)

## Deliverables
- `StatsScreen.tsx` main statistics screen
- Chart components:
  - `ProgressChart.tsx` (line/bar chart)
  - `AccuracyChart.tsx` (bar chart by level)
  - `TopicDistributionChart.tsx` (pie/donut)
  - `ActivityHeatmap.tsx` (calendar grid)
- `MetricsTable.tsx` for detailed breakdowns
- API routes for statistics data
- Statistics calculation services
- Data aggregation queries
- Tests for statistics calculations

## Acceptance Criteria
- Overview cards display accurate summary stats
- Learning progress chart shows data for selected timeframe
- Accuracy chart displays performance across all levels
- Topic distribution chart shows proportional breakdown
- Activity heatmap displays last 365 days of activity
- Metrics table shows detailed breakdowns
- Charts animate smoothly on render
- Timeframe selector updates chart data
- Handles empty states gracefully
- All calculations are accurate against database
- Typecheck and lint pass

## Dependencies
- T006 (learning session data)
- T011 (topic data for distribution)
- T008 (streak and activity tracking)
