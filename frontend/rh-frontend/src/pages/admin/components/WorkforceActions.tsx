import React from 'react';
import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import { ArrowUpRight, CalendarOff, FileClock } from 'lucide-react';

interface WorkforceActionsProps {
  contractsToReview: number;
  leavesToday: number;
  onNavigate: (path: string) => void;
}

const ActionCard: React.FC<{ title: string; value: number; note: string; icon: React.ReactNode; action: () => void }> = ({ title, value, note, icon, action }) => (
  <Card className="dashboard-section-card action-card">
    <CardContent>
      <Box className="action-heading-row">
        <span className="action-icon">{icon}</span>
        <Chip label="Needs attention" size="small" className="attention-chip" />
      </Box>
      <Typography className="action-title">{title}</Typography>
      <Typography className="action-value">{value}</Typography>
      <Typography className="section-caption">{note}</Typography>
      <Button size="small" className="view-all-button" endIcon={<ArrowUpRight size={15} />} onClick={action}>View all</Button>
    </CardContent>
  </Card>
);

export const WorkforceActions: React.FC<WorkforceActionsProps> = ({ contractsToReview, leavesToday, onNavigate }) => (
  <Box className="workforce-actions">
    <ActionCard title="Contracts to review" value={contractsToReview} note="Expired or suspended records" icon={<FileClock size={19} />} action={() => onNavigate('/admin/contracts')} />
    <ActionCard title="On leave today" value={leavesToday} note="Approved leave records" icon={<CalendarOff size={19} />} action={() => onNavigate('/admin/leaves')} />
  </Box>
);
