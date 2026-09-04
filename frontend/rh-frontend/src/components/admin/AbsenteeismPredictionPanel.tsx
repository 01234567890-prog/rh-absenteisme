import React from 'react';
import { Box, Button, Card, CardContent, Chip, LinearProgress, Skeleton, Typography } from '@mui/material';
import { ArrowUpRight, Brain, CalendarDays } from 'lucide-react';
import type {
  DepartementResponseDto,
  PredictionResponseDto,
  UserResponseDto,
} from '../../types/api';
import './AbsenteeismPredictionPanel.css';

interface AbsenteeismPredictionPanelProps {
  predictions: PredictionResponseDto[];
  users: UserResponseDto[];
  departements: DepartementResponseDto[];
  loading: boolean;
  error?: string;
  onRetry: () => void;
  onViewAll?: () => void;
}

const formatScore = (score: number) => {
  if (!Number.isFinite(score)) return 'Unavailable';
  const percentage = score <= 1 ? score * 100 : score;
  return `${Math.round(percentage)}%`;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

export const AbsenteeismPredictionPanel: React.FC<AbsenteeismPredictionPanelProps> = ({
  predictions,
  users,
  departements,
  loading,
  error,
  onRetry,
  onViewAll,
}) => {
  const userMap = new Map(users.map((user) => [user.id, user]));
  const departmentMap = new Map(departements.map((department) => [department.id, department.name]));
  const sortedPredictions = [...predictions].sort(
    (first, second) => (Number(second.score) || 0) - (Number(first.score) || 0)
  );
  const counts = predictions.reduce(
    (summary, prediction) => {
      summary[prediction.level] += 1;
      return summary;
    },
    { HIGH: 0, MEDIUM: 0, LOW: 0 } as Record<'HIGH' | 'MEDIUM' | 'LOW', number>
  );
  const totalPredictions = predictions.length;
  const riskWidth = (count: number) => `${totalPredictions ? (count / totalPredictions) * 100 : 0}%`;

  return (
    <Card className="prediction-panel" component="section" aria-labelledby="prediction-title">
      <CardContent>
      <Box className="prediction-heading">
        <div>
          <Typography className="dashboard-eyebrow"><Brain size={13} /> AI-assisted workforce insight</Typography>
          <Typography className="section-title" component="h2" id="prediction-title">Absenteeism Prediction</Typography>
          <Typography className="prediction-description">
            Risk levels generated from the prediction records currently available.
          </Typography>
        </div>
        <Box className="prediction-actions">
          {!loading && !error && <Chip className="prediction-total" label={`${predictions.length} records`} size="small" />}
          {onViewAll && <Button className="view-all-button" size="small" endIcon={<ArrowUpRight size={15} />} onClick={onViewAll}>View all</Button>}
        </Box>
      </Box>

      {error ? (
        <Box className="prediction-state prediction-error" role="alert"><span>{error}</span><Button onClick={onRetry}>Try again</Button></Box>
      ) : loading ? (
        <Box className="prediction-state"><Skeleton /><Skeleton /><Skeleton /></Box>
      ) : predictions.length === 0 ? (
        <Box className="prediction-state">
          No absenteeism predictions are available yet.
        </Box>
      ) : (
        <>
          <Box className="prediction-summary" aria-label="Prediction risk summary">
            <Box className="risk-summary risk-high"><Box className="risk-summary-label"><span>High risk</span><strong>{counts.HIGH}</strong></Box><LinearProgress variant="determinate" value={Number.parseFloat(riskWidth(counts.HIGH))} /></Box>
            <Box className="risk-summary risk-medium"><Box className="risk-summary-label"><span>Medium risk</span><strong>{counts.MEDIUM}</strong></Box><LinearProgress variant="determinate" value={Number.parseFloat(riskWidth(counts.MEDIUM))} /></Box>
            <Box className="risk-summary risk-low"><Box className="risk-summary-label"><span>Low risk</span><strong>{counts.LOW}</strong></Box><LinearProgress variant="determinate" value={Number.parseFloat(riskWidth(counts.LOW))} /></Box>
          </Box>

          <Box className="prediction-list">
            <div className="prediction-list-header">
              <span>Employee</span>
              <span>Risk score</span>
              <span>Level</span>
              <span>Prediction date</span>
            </div>
            {sortedPredictions.slice(0, 5).map((prediction) => {
              const user = userMap.get(prediction.userId);
              const department = user?.departementId
                ? departmentMap.get(user.departementId)
                : undefined;
              const employeeName = user
                ? `${user.firstName} ${user.lastName}`.trim()
                : `User #${prediction.userId}`;

              return (
                <Box className="prediction-row" key={prediction.id}>
                  <div className="prediction-employee">
                    <strong>{employeeName}</strong>
                    <span>{department || 'Department unavailable'}</span>
                  </div>
                  <strong className="prediction-score">{formatScore(prediction.score)}</strong>
                  <Chip className={`prediction-level level-${prediction.level.toLowerCase()}`} label={prediction.level} size="small" />
                  <span className="prediction-date">
                    <CalendarDays size={13} />
                    {formatDate(prediction.predictionDate)}
                    <small>{prediction.analysisPeriod}</small>
                  </span>
                </Box>
              );
            })}
          </Box>
          {predictions.length > 5 && (
            <p className="prediction-footnote">Showing the five highest risk records.</p>
          )}
        </>
      )}
      </CardContent>
    </Card>
  );
};