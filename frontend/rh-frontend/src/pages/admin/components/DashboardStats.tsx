import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { Building2, Users, UserRound } from 'lucide-react';

interface DashboardStatsProps {
  loading: boolean;
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
}

const StatCard: React.FC<{ label: string; value: number; note: string; accent?: boolean; icon: React.ReactNode; loading: boolean }> = ({ label, value, note, accent, icon, loading }) => (
  <Card className={`dashboard-stat-card ${accent ? 'dashboard-stat-card-accent' : ''}`}>
    <CardContent>
      <Box className="stat-content-row">
        <div>
          <Typography className="stat-label">{label}</Typography>
          {loading ? <Skeleton width={58} height={40} /> : <Typography className="stat-value">{value}</Typography>}
          <Typography className="stat-note">{note}</Typography>
        </div>
        <span className="stat-icon">{icon}</span>
      </Box>
    </CardContent>
  </Card>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ loading, totalEmployees, activeEmployees, departments }) => (
  <Grid container spacing={1.5} className="dashboard-stats-grid">
    <Grid size={{ xs: 12, sm: 4 }}>
      <StatCard label="Total employees" value={totalEmployees} note="From the employee directory" icon={<Users size={19} />} loading={loading} />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <StatCard label="Active employees" value={activeEmployees} note="Status marked ACTIVE" accent icon={<UserRound size={19} />} loading={loading} />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <StatCard label="Departments" value={departments} note="Current department records" icon={<Building2 size={19} />} loading={loading} />
    </Grid>
  </Grid>
);
