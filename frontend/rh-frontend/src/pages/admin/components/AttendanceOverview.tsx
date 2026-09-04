import React from 'react';
import { Box, Card, CardContent, Chip, Divider, LinearProgress, Typography } from '@mui/material';
import { CalendarCheck, UserCheck, UserMinus } from 'lucide-react';

interface AttendanceOverviewProps {
  loading: boolean;
  presentToday: number;
  absentToday: number;
  leaveToday: number;
  recordedAbsenceRate: number | null;
}

export const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({ loading, presentToday, absentToday, leaveToday, recordedAbsenceRate }) => {
  const totalMeasured = presentToday + absentToday;
  const attendanceProgress = totalMeasured ? presentToday / totalMeasured * 100 : 0;

  return (
    <Card className="dashboard-section-card attendance-card">
      <CardContent>
        <Box className="section-heading-row">
          <div>
            <Typography className="dashboard-eyebrow">Attendance overview</Typography>
            <Typography className="section-title">Today at a glance</Typography>
            <Typography className="section-caption">Based on presence records dated today.</Typography>
          </div>
          <Chip className="section-chip" icon={<CalendarCheck size={14} />} label="Live records" size="small" />
        </Box>
        <Box className="attendance-content">
          <Box className="attendance-progress">
            <Typography className="progress-value">{loading ? '...' : totalMeasured ? `${Math.round(attendanceProgress)}%` : 'N/A'}</Typography>
            <Typography className="progress-label">Recorded attendance</Typography>
            <LinearProgress variant="determinate" value={loading ? 0 : attendanceProgress} className="attendance-bar" />
            <Typography className="section-caption">{recordedAbsenceRate === null ? 'No measurable presence records yet.' : `Recorded absence rate: ${recordedAbsenceRate.toFixed(1)}%`}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem className="attendance-divider" />
          <Box className="attendance-stat-list">
            <div className="attendance-stat"><UserCheck size={17} /><strong>{loading ? '...' : presentToday}</strong><span>Present / late</span></div>
            <div className="attendance-stat"><UserMinus size={17} /><strong>{loading ? '...' : absentToday}</strong><span>Absent</span></div>
            <div className="attendance-stat"><CalendarCheck size={17} /><strong>{loading ? '...' : leaveToday}</strong><span>On leave</span></div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
