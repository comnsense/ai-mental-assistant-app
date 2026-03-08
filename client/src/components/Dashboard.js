import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/chat/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionData = () => {
    const emotionCounts = {};
    sessions.forEach(session => {
      if (session.emotionSummary) {
        Object.entries(session.emotionSummary).forEach(([emotion, count]) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + count;
        });
      }
    });
    
    return Object.entries(emotionCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getDailyActivity = () => {
    const dailyCounts = {};
    sessions.forEach(session => {
      const date = new Date(session.createdAt).toLocaleDateString('bg-BG');
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    return Object.entries(dailyCounts).map(([date, sessions]) => ({
      date,
      sessions
    })).slice(-7);
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Моето табло
      </Typography>

      <Grid container spacing={3}>
        {/* Статистика */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Общо сесии
              </Typography>
              <Typography variant="h3">
                {sessions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Последна сесия
              </Typography>
              <Typography variant="body1">
                {sessions[0] ? new Date(sessions[0].createdAt).toLocaleDateString('bg-BG') : 'Няма'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Средна продължителност
              </Typography>
              <Typography variant="body1">
                {sessions.length > 0 ? '15 мин' : 'Няма данни'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Графика на емоциите */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Разпределение на емоциите
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getEmotionData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getEmotionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Дневна активност */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Дневна активност (последни 7 дни)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getDailyActivity()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;