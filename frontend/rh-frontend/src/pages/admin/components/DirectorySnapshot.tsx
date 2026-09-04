import React from 'react';
import { Avatar, Box, Card, CardContent, Chip, Typography } from '@mui/material';
import { Building2, Mail, Users } from 'lucide-react';
import type { DepartementResponseDto, UserResponseDto } from '../../../types/api';

interface DirectorySnapshotProps {
  users: UserResponseDto[];
  departments: DepartementResponseDto[];
  loading: boolean;
}

export const DirectorySnapshot: React.FC<DirectorySnapshotProps> = ({ users, departments, loading }) => (
  <Box className="directory-snapshot">
    <Card className="dashboard-section-card directory-card">
      <CardContent>
        <Box className="section-heading-row">
          <div><Typography className="dashboard-eyebrow">Directory</Typography><Typography className="section-title">Recent employees</Typography></div>
          <Chip icon={<Users size={14} />} label={loading ? '...' : users.length} size="small" className="section-chip" />
        </Box>
        {loading ? <Typography className="section-state">Loading employees...</Typography> : users.length === 0 ? <Typography className="section-state">No employees found.</Typography> : (
          <Box className="directory-list">
            {users.slice(0, 5).map((user) => (
              <Box className="directory-row" key={user.id}>
                <Avatar className="directory-avatar">{(user.firstName?.[0] || user.email[0] || '?').toUpperCase()}</Avatar>
                <div className="directory-person"><Typography>{user.firstName} {user.lastName}</Typography><span><Mail size={12} />{user.email}</span></div>
                <Chip label={user.status || 'Unspecified'} size="small" className={user.status === 'ACTIVE' ? 'active-chip' : 'muted-chip'} />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
    <Card className="dashboard-section-card directory-card">
      <CardContent>
        <Box className="section-heading-row">
          <div><Typography className="dashboard-eyebrow">Structure</Typography><Typography className="section-title">Departments</Typography></div>
          <Chip icon={<Building2 size={14} />} label={loading ? '...' : departments.length} size="small" className="section-chip" />
        </Box>
        {loading ? <Typography className="section-state">Loading departments...</Typography> : departments.length === 0 ? <Typography className="section-state">No departments found.</Typography> : (
          <Box className="directory-list">
            {departments.slice(0, 5).map((department) => <Box className="directory-row" key={department.id}><Avatar className="department-avatar">{department.name[0]?.toUpperCase() || '?'}</Avatar><div className="directory-person"><Typography>{department.name}</Typography><span>{department.description || 'No description provided'}</span></div></Box>)}
          </Box>
        )}
      </CardContent>
    </Card>
  </Box>
);
