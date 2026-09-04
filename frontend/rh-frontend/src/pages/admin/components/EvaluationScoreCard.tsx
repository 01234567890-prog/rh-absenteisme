import React from 'react';
import { Box, Card, CardContent, Chip, LinearProgress, Typography } from '@mui/material';
import { ClipboardCheck } from 'lucide-react';

interface EvaluationScoreCardProps {
  loading: boolean;
  score: number | null;
}

export const EvaluationScoreCard: React.FC<EvaluationScoreCardProps> = ({ loading, score }) => (
  <Card className="dashboard-section-card evaluation-card">
    <CardContent>
      <Box className="section-heading-row">
        <div><Typography className="dashboard-eyebrow">Evaluation health</Typography><Typography className="section-title">Overall evaluation score</Typography></div>
        <Chip icon={<ClipboardCheck size={14} />} label="0–100 scale" size="small" className="section-chip" />
      </Box>
      <Typography className="evaluation-value">{loading ? '...' : score === null ? 'N/A' : score.toFixed(1)}</Typography>
      <Typography className="section-caption">Average of performance, competency, and behavior scores.</Typography>
      {score !== null && <LinearProgress variant="determinate" value={Math.max(0, Math.min(score, 100))} className="evaluation-bar" />}
    </CardContent>
  </Card>
);
