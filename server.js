import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ============================================
// MOCK DATA - All data stored in memory
// ============================================

const mockStaff = [
  { id: 1, name: 'Dr. Pekka', role: 'Doctor', expertise: ['Palliative', 'Infection'], coverage: ['Oulu', 'Kempele'], availableHours: '09:00-17:00', maxHours: 8, email: 'pekka@hospital.fi', phone: '+358-40-111-1111' },
  { id: 2, name: 'Dr. Teemu', role: 'Doctor', expertise: ['Acute', 'Geriatrics'], coverage: ['Oulu', 'Kiiminki'], availableHours: '08:00-16:00', maxHours: 8, email: 'teemu@hospital.fi', phone: '+358-40-222-2222' },
  { id: 3, name: 'Nurse Nuura', role: 'Nurse', expertise: ['Infection', 'Palliative'], coverage: ['Oulu'], availableHours: '09:00-17:00', maxHours: 8, email: 'nuura@hospital.fi', phone: '+358-40-333-3333' },
  { id: 4, name: 'Nurse Anne', role: 'Nurse', expertise: ['Palliative', 'Geriatrics'], coverage: ['Kempele', 'Kiiminki'], availableHours: '10:00-18:00', maxHours: 8, email: 'anne@hospital.fi', phone: '+358-40-444-4444' },
  { id: 5, name: 'Nurse Sanna', role: 'Nurse', expertise: ['Acute'], coverage: ['Oulu'], availableHours: '08:00-16:00', maxHours: 8, email: 'sanna@hospital.fi', phone: '+358-40-555-5555' },
];

const mockPatients = [
  { id: 101, name: 'A. Marika', careNeeds: ['Palliative'], location: 'Oulu', address: 'Isokatu 1', latitude: 65.01585, longitude: 25.47898, preferredTime: 'Morning', priority: 'Urgent' },
  { id: 102, name: 'T. Vikke', careNeeds: ['Infection'], location: 'Oulu', address: 'Kalervantie 2', latitude: 65.06318, longitude: 25.48467, preferredTime: 'Afternoon', priority: 'Normal' },
  { id: 103, name: 'T. Mäki', careNeeds: ['Acute'], location: 'Kiiminki', address: 'Kivitie 5', latitude: 65.21678, longitude: 25.32988, preferredTime: 'Morning', priority: 'Normal' },
  { id: 104, name: 'Laouri', careNeeds: ['Palliative'], location: 'Kempele', address: 'Kauppakuja 8', latitude: 64.92385, longitude: 25.50677, preferredTime: 'Afternoon', priority: 'Normal' },
  { id: 105, name: 'P. Laine', careNeeds: ['Geriatrics', 'Palliative'], location: 'Oulu', address: 'Puistokatu 3', latitude: 65.00808, longitude: 25.44903, preferredTime: 'Morning', priority: 'Urgent' },
];

// ============================================
// SCHEDULE PERIOD CONFIGURATION
// ============================================

const schedulePeriod = {
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks
  status: 'active'
};

// ============================================
// IN-MEMORY STORAGE
// ============================================

let availabilityIdCounter = 1;
let scheduleIdCounter = 1;
let notificationIdCounter = 1;
let swapLogIdCounter = 1;
let ruleIdCounter = 1;

let availabilitySubmissions = [];
let activeRules = [];
let generatedSchedule = [];
let notifications = [];
let swapLog = [];

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateMockSchedule() {
  const schedule = [];
  const startDate = new Date(schedulePeriod.startDate);
  const endDate = new Date(schedulePeriod.endDate);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    mockPatients.forEach(patient => {
      const eligibleStaff = mockStaff.filter(staff => {
        const hasExpertise = staff.expertise.some(exp => patient.careNeeds.includes(exp));
        const canCover = staff.coverage.includes(patient.location);
        return hasExpertise && canCover;
      });

      if (eligibleStaff.length > 0) {
        const assignedStaff = eligibleStaff[Math.floor(Math.random() * eligibleStaff.length)];
        const timeSlot = patient.preferredTime === 'Morning' ? 
          `${String(9 + Math.floor(Math.random() * 3)).padStart(2, '0')}:00` : 
          `${String(13 + Math.floor(Math.random() * 4)).padStart(2, '0')}:00`;
        
        schedule.push({
          id: scheduleIdCounter++,
          staffId: assignedStaff.id,
          staffName: assignedStaff.name,
          staffRole: assignedStaff.role,
          staffExpertise: assignedStaff.expertise,
          patientId: patient.id,
          patientName: patient.name,
          careType: patient.careNeeds[0],
          date: dateStr,
          time: timeSlot,
          location: patient.location,
          address: patient.address,
          latitude: patient.latitude,
          longitude: patient.longitude,
          duration: 45,
          travelTime: Math.floor(Math.random() * 25) + 10,
          priority: patient.priority,
          status: 'Scheduled',
          canSwap: true
        });
      }
    });
  }

  return schedule;
}

function createNotification(recipientId, recipientType, title, message, type = 'info') {
  const notification = {
    id: notificationIdCounter++,
    recipientId,
    recipientType,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
  notifications.push(notification);
  return notification;
}

function addSwapLog(originalStaffId, newStaffId, sessionId, reason) {
  const log = {
    id: swapLogIdCounter++,
    originalStaffId,
    originalStaffName: mockStaff.find(s => s.id === originalStaffId)?.name || 'Unknown',
    newStaffId,
    newStaffName: mockStaff.find(s => s.id === newStaffId)?.name || 'Unknown',
    sessionId,
    reason,
    swappedAt: new Date().toISOString()
  };
  swapLog.push(log);
  return log;
}

function canSwapSession(session) {
  const sessionDateTime = new Date(`${session.date}T${session.time}:00`);
  const now = new Date();
  const hoursUntilSession = (sessionDateTime - now) / (1000 * 60 * 60);
  return hoursUntilSession > 4;
}

function getEligibleSwapStaff(session, excludeStaffId) {
  const sessionStaff = mockStaff.find(s => s.id === excludeStaffId);
  if (!sessionStaff) return [];

  return mockStaff.filter(staff => {
    if (staff.id === excludeStaffId) return false;
    
    const hasMatchingExpertise = staff.expertise.some(exp => 
      sessionStaff.expertise.includes(exp) || session.careType === exp
    );
    
    const canCoverLocation = staff.coverage.includes(session.location);
    
    return hasMatchingExpertise && canCoverLocation;
  });
}

// Initialize
generatedSchedule = generateMockSchedule();

availabilitySubmissions = [
  {
    id: availabilityIdCounter++,
    staffId: 1,
    staffName: 'Dr. Pekka',
    staffRole: 'Doctor',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    startTime: '09:00',
    endTime: '17:00',
    maxHours: 8,
    coverageAreas: ['Oulu', 'Kempele'],
    preferences: {
      travelPreference: 'minimal',
      shiftPreference: 'morning',
      notes: 'Prefer to minimize travel due to ongoing research work. Available for emergency calls.'
    },
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    supervisorNotes: null,
    individualRules: null
  },
  {
    id: availabilityIdCounter++,
    staffId: 3,
    staffName: 'Nurse Nuura',
    staffRole: 'Nurse',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    startTime: '08:00',
    endTime: '16:00',
    maxHours: 8,
    coverageAreas: ['Oulu'],
    preferences: {
      travelPreference: 'flexible',
      shiftPreference: 'morning',
      notes: 'Happy to take extra shifts if needed. Can cover Kiiminki area on Fridays.'
    },
    status: 'pending',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    supervisorNotes: null,
    individualRules: null
  },
  {
    id: availabilityIdCounter++,
    staffId: 4,
    staffName: 'Nurse Anne',
    staffRole: 'Nurse',
    days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '10:00',
    endTime: '18:00',
    maxHours: 7,
    coverageAreas: ['Kempele', 'Kiiminki'],
    preferences: {
      travelPreference: 'moderate',
      shiftPreference: 'afternoon',
      notes: 'Prefer afternoon shifts due to childcare in mornings. Maximum 30km travel radius.'
    },
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    supervisorNotes: null,
    individualRules: null
  }
];

activeRules = [
  {
    id: ruleIdCounter++,
    type: 'availability',
    staffId: 2,
    staffName: 'Dr. Teemu',
    staffRole: 'Doctor',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '08:00',
    endTime: '16:00',
    maxHours: 8,
    coverageAreas: ['Oulu', 'Kiiminki'],
    preferences: {
      travelPreference: 'flexible',
      shiftPreference: 'flexible',
      notes: 'Available for all assignments'
    },
    individualRules: {
      maxTravelDistance: 50,
      priorityPatients: true,
      overtimeAllowed: true
    },
    approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'Supervisor'
  },
  {
    id: ruleIdCounter++,
    type: 'availability',
    staffId: 5,
    staffName: 'Nurse Sanna',
    staffRole: 'Nurse',
    days: ['Monday', 'Wednesday', 'Friday'],
    startTime: '08:00',
    endTime: '16:00',
    maxHours: 8,
    coverageAreas: ['Oulu'],
    preferences: {
      travelPreference: 'minimal',
      shiftPreference: 'morning',
      notes: 'Part-time schedule'
    },
    individualRules: {
      maxTravelDistance: 20,
      priorityPatients: false,
      overtimeAllowed: false
    },
    approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: 'Supervisor'
  }
];

// ============================================
// API ENDPOINTS
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/staff', (req, res) => {
  res.json(mockStaff);
});

app.get('/api/patients', (req, res) => {
  res.json(mockPatients);
});

app.get('/api/schedule-period', (req, res) => {
  res.json(schedulePeriod);
});

app.get('/api/coordinator', (req, res) => {
  res.json({
    staff: mockStaff,
    patients: mockPatients,
    schedule: generatedSchedule,
    schedulePeriod: schedulePeriod,
    todayCapacity: { current: mockPatients.length, max: 30 },
    approvedAvailability: activeRules.filter(r => r.type === 'availability'),
    activeRules: activeRules
  });
});

app.post('/api/coordinator/run-scheduler', (req, res) => {
  setTimeout(() => {
    scheduleIdCounter = 1;
    generatedSchedule = generateMockSchedule();
    
    createNotification(
      null,
      'supervisor',
      'Schedule Generated',
      `New schedule generated with ${generatedSchedule.length} sessions for the period ${schedulePeriod.startDate} to ${schedulePeriod.endDate}`,
      'success'
    );

    res.json({
      success: true,
      schedule: generatedSchedule,
      message: `Schedule optimized successfully. ${generatedSchedule.length} sessions created.`,
      rulesApplied: activeRules.length
    });
  }, 1500);
});

app.get('/api/coordinator/export-schedule', (req, res) => {
  let csv = 'Date,Time,Staff,Role,Patient,Care Type,Location,Address,Duration (min),Travel Time (min),Priority,Status\n';
  
  generatedSchedule.forEach(item => {
    csv += `${item.date},${item.time},${item.staffName},${item.staffRole},${item.patientName},${item.careType},${item.location},${item.address},${item.duration},${item.travelTime},${item.priority},${item.status}\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="schedule.csv"');
  res.send(csv);
});

app.get('/api/supervisor', (req, res) => {
  const workloadByStaff = {};
  
  mockStaff.forEach(staff => {
    const assignedTasks = generatedSchedule.filter(s => s.staffId === staff.id).length;
    workloadByStaff[staff.name] = {
      tasks: assignedTasks,
      role: staff.role,
      expertise: staff.expertise
    };
  });

  res.json({
    schedule: generatedSchedule,
    workload: workloadByStaff,
    pendingAvailability: availabilitySubmissions.filter(a => a.status === 'pending'),
    approvedAvailability: availabilitySubmissions.filter(a => a.status === 'approved'),
    rejectedAvailability: availabilitySubmissions.filter(a => a.status === 'rejected'),
    activeRules: activeRules,
    swapLog: swapLog,
    systemRules: {
      maxTravelTime: 30,
      coverage: ['Oulu', 'Kempele', 'Kiiminki'],
      maxWorkload: 8,
      swapWindowHours: 4
    }
  });
});

app.get('/api/supervisor/pending-availability', (req, res) => {
  res.json({
    pending: availabilitySubmissions.filter(a => a.status === 'pending'),
    total: availabilitySubmissions.filter(a => a.status === 'pending').length
  });
});

app.put('/api/supervisor/availability/:id/approve', (req, res) => {
  const id = parseInt(req.params.id);
  const { supervisorNotes, individualRules } = req.body;
  
  const submission = availabilitySubmissions.find(a => a.id === id);
  if (!submission) {
    return res.status(404).json({ error: 'Availability submission not found' });
  }

  submission.status = 'approved';
  submission.reviewedAt = new Date().toISOString();
  submission.reviewedBy = 'Supervisor';
  submission.supervisorNotes = supervisorNotes || null;
  submission.individualRules = individualRules || null;

  const newRule = {
    id: ruleIdCounter++,
    type: 'availability',
    staffId: submission.staffId,
    staffName: submission.staffName,
    staffRole: submission.staffRole,
    days: submission.days,
    startTime: submission.startTime,
    endTime: submission.endTime,
    maxHours: submission.maxHours,
    coverageAreas: submission.coverageAreas,
    preferences: submission.preferences,
    individualRules: individualRules || {
      maxTravelDistance: submission.preferences.travelPreference === 'minimal' ? 20 : 
                         submission.preferences.travelPreference === 'moderate' ? 35 : 50,
      priorityPatients: true,
      overtimeAllowed: submission.preferences.travelPreference === 'flexible'
    },
    approvedAt: new Date().toISOString(),
    approvedBy: 'Supervisor'
  };
  activeRules.push(newRule);

  createNotification(
    submission.staffId,
    'staff',
    'Availability Approved',
    `Your availability submission has been approved.${supervisorNotes ? ' Note: ' + supervisorNotes : ''}`,
    'approval'
  );

  res.json({
    success: true,
    message: 'Availability approved and added to active rules',
    submission: submission,
    newRule: newRule
  });
});

app.put('/api/supervisor/availability/:id/modify', (req, res) => {
  const id = parseInt(req.params.id);
  const { days, startTime, endTime, maxHours, coverageAreas, supervisorNotes, individualRules } = req.body;
  
  const submission = availabilitySubmissions.find(a => a.id === id);
  if (!submission) {
    return res.status(404).json({ error: 'Availability submission not found' });
  }

  if (days) submission.days = days;
  if (startTime) submission.startTime = startTime;
  if (endTime) submission.endTime = endTime;
  if (maxHours) submission.maxHours = maxHours;
  if (coverageAreas) submission.coverageAreas = coverageAreas;
  
  submission.status = 'approved';
  submission.reviewedAt = new Date().toISOString();
  submission.reviewedBy = 'Supervisor';
  submission.supervisorNotes = supervisorNotes || 'Modified by supervisor';
  submission.individualRules = individualRules || null;

  const newRule = {
    id: ruleIdCounter++,
    type: 'availability',
    staffId: submission.staffId,
    staffName: submission.staffName,
    staffRole: submission.staffRole,
    days: submission.days,
    startTime: submission.startTime,
    endTime: submission.endTime,
    maxHours: submission.maxHours,
    coverageAreas: submission.coverageAreas,
    preferences: submission.preferences,
    individualRules: individualRules || {
      maxTravelDistance: 30,
      priorityPatients: true,
      overtimeAllowed: false
    },
    approvedAt: new Date().toISOString(),
    approvedBy: 'Supervisor'
  };
  activeRules.push(newRule);

  createNotification(
    submission.staffId,
    'staff',
    'Availability Modified & Approved',
    `Your availability has been modified and approved by supervisor. ${supervisorNotes || ''}`,
    'approval'
  );

  res.json({
    success: true,
    message: 'Availability modified and approved',
    submission: submission,
    newRule: newRule
  });
});

app.put('/api/supervisor/availability/:id/reject', (req, res) => {
  const id = parseInt(req.params.id);
  const { reason } = req.body;
  
  const submission = availabilitySubmissions.find(a => a.id === id);
  if (!submission) {
    return res.status(404).json({ error: 'Availability submission not found' });
  }

  submission.status = 'rejected';
  submission.reviewedAt = new Date().toISOString();
  submission.reviewedBy = 'Supervisor';
  submission.supervisorNotes = reason || 'Rejected by supervisor';

  createNotification(
    submission.staffId,
    'staff',
    'Availability Rejected',
    `Your availability submission has been rejected. Reason: ${reason || 'No reason provided'}`,
    'warning'
  );

  res.json({
    success: true,
    message: 'Availability rejected',
    submission: submission
  });
});

app.get('/api/supervisor/swap-log', (req, res) => {
  res.json({
    swapLog: swapLog,
    total: swapLog.length
  });
});

app.get('/api/supervisor/active-rules', (req, res) => {
  res.json({
    rules: activeRules,
    total: activeRules.length
  });
});

app.delete('/api/supervisor/active-rules/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = activeRules.findIndex(r => r.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Rule not found' });
  }

  const removed = activeRules.splice(index, 1)[0];
  
  res.json({
    success: true,
    message: 'Rule removed from active rules',
    removed: removed
  });
});

app.get('/api/professional/:staffId', (req, res) => {
  const staffId = parseInt(req.params.staffId);
  const staff = mockStaff.find(s => s.id === staffId);
  
  if (!staff) {
    return res.status(404).json({ error: 'Staff not found' });
  }

  const personalSchedule = generatedSchedule
    .filter(s => s.staffId === staffId)
    .map(session => ({
      ...session,
      canSwap: canSwapSession(session),
      hoursUntilSession: Math.max(0, (new Date(`${session.date}T${session.time}:00`) - new Date()) / (1000 * 60 * 60)).toFixed(1)
    }))
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const staffNotifications = notifications.filter(n => 
    (n.recipientId === staffId && n.recipientType === 'staff') ||
    (n.recipientType === 'all-staff')
  );

  res.json({
    staff: staff,
    schedule: personalSchedule,
    schedulePeriod: schedulePeriod,
    notifications: staffNotifications,
    route: personalSchedule.map(s => ({ 
      location: s.address, 
      time: s.time, 
      date: s.date,
      patient: s.patientName,
      latitude: s.latitude,
      longitude: s.longitude
    }))
  });
});

app.post('/api/professional/availability/submit', (req, res) => {
  const { 
    staffId, staffName, staffRole,
    days, startTime, endTime, maxHours, coverageAreas,
    preferences
  } = req.body;

  if (!staffId || !days || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const submission = {
    id: availabilityIdCounter++,
    staffId,
    staffName: staffName || mockStaff.find(s => s.id === staffId)?.name || 'Unknown',
    staffRole: staffRole || mockStaff.find(s => s.id === staffId)?.role || 'Unknown',
    days,
    startTime,
    endTime,
    maxHours: maxHours || 8,
    coverageAreas: coverageAreas || [],
    preferences: preferences || {
      travelPreference: 'flexible',
      shiftPreference: 'flexible',
      notes: ''
    },
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    supervisorNotes: null,
    individualRules: null
  };

  availabilitySubmissions.push(submission);

  createNotification(
    null,
    'supervisor',
    'New Availability Submission',
    `${submission.staffName} has submitted availability for review`,
    'info'
  );

  res.json({
    success: true,
    message: 'Availability submitted for supervisor review',
    submission: submission
  });
});

app.get('/api/professional/:staffId/availability', (req, res) => {
  const staffId = parseInt(req.params.staffId);
  const submissions = availabilitySubmissions.filter(a => a.staffId === staffId);

  res.json({
    staffId,
    submissions,
    total: submissions.length
  });
});

app.get('/api/professional/swap/eligible/:sessionId', (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const session = generatedSchedule.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if (!canSwapSession(session)) {
    return res.status(400).json({ 
      error: 'Cannot swap this session',
      reason: 'Swap window closed (less than 4 hours before session)',
      canSwap: false
    });
  }

  const eligibleStaff = getEligibleSwapStaff(session, session.staffId);

  res.json({
    session: session,
    eligibleStaff: eligibleStaff,
    canSwap: true
  });
});

app.post('/api/professional/swap/execute', (req, res) => {
  const { sessionId, newStaffId, reason } = req.body;

  if (!sessionId || !newStaffId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const session = generatedSchedule.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if (!canSwapSession(session)) {
    return res.status(400).json({ 
      error: 'Cannot swap this session',
      reason: 'Swap window closed (less than 4 hours before session)'
    });
  }

  const newStaff = mockStaff.find(s => s.id === newStaffId);
  if (!newStaff) {
    return res.status(404).json({ error: 'New staff not found' });
  }

  const eligibleStaff = getEligibleSwapStaff(session, session.staffId);
  if (!eligibleStaff.find(s => s.id === newStaffId)) {
    return res.status(400).json({ error: 'Selected staff is not eligible for this swap' });
  }

  const originalStaffId = session.staffId;
  const originalStaffName = session.staffName;

  session.staffId = newStaff.id;
  session.staffName = newStaff.name;
  session.staffRole = newStaff.role;
  session.staffExpertise = newStaff.expertise;

  addSwapLog(originalStaffId, newStaffId, sessionId, reason || 'No reason provided');

  createNotification(
    originalStaffId,
    'staff',
    'Session Swapped',
    `Your session with ${session.patientName} on ${session.date} at ${session.time} has been swapped to ${newStaff.name}`,
    'swap'
  );

  createNotification(
    newStaffId,
    'staff',
    'New Session Assigned',
    `You have been assigned a session with ${session.patientName} on ${session.date} at ${session.time} (swapped from ${originalStaffName})`,
    'swap'
  );

  createNotification(
    null,
    'supervisor',
    'Session Swap Executed',
    `${originalStaffName} swapped session with ${session.patientName} to ${newStaff.name}. Reason: ${reason || 'Not provided'}`,
    'swap'
  );

  res.json({
    success: true,
    message: 'Session swapped successfully',
    session: session,
    swapDetails: {
      originalStaff: originalStaffName,
      newStaff: newStaff.name,
      reason: reason
    }
  });
});

app.get('/api/notifications/:recipientType/:recipientId?', (req, res) => {
  const { recipientType, recipientId } = req.params;
  
  let filtered = notifications.filter(n => n.recipientType === recipientType);
  
  if (recipientId) {
    filtered = filtered.filter(n => n.recipientId === parseInt(recipientId) || n.recipientId === null);
  }

  res.json({
    notifications: filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    unreadCount: filtered.filter(n => !n.read).length
  });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const id = parseInt(req.params.id);
  const notification = notifications.find(n => n.id === id);

  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notification.read = true;

  res.json({
    success: true,
    notification: notification
  });
});

app.put('/api/notifications/mark-all-read/:recipientType/:recipientId?', (req, res) => {
  const { recipientType, recipientId } = req.params;

  notifications.forEach(n => {
    if (n.recipientType === recipientType) {
      if (!recipientId || n.recipientId === parseInt(recipientId) || n.recipientId === null) {
        n.read = true;
      }
    }
  });

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

app.get('/api/patient/:patientId', (req, res) => {
  const patientId = parseInt(req.params.patientId);
  const patient = mockPatients.find(p => p.id === patientId);
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const upcomingVisits = generatedSchedule
    .filter(s => s.patientId === patientId)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  res.json({
    patient: patient,
    upcomingVisits: upcomingVisits,
    nextVisit: upcomingVisits[0] || null
  });
});

// ============================================
// STATIC FILE SERVING (AFTER API ROUTES)
// ============================================

// Serve static files from 'public' directory
app.use(express.static(join(__dirname, 'public')));

// ============================================
// CATCH-ALL ROUTE FOR INDEX.HTML (MUST BE LAST)
// ============================================

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🏥 Hospital Scheduler v2.0`);
  console.log(`===============================`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Test: http://localhost:${PORT}/api/health`);
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`\nAvailable API endpoints:`);
  console.log(`- /api/health - Health check`);
  console.log(`- /api/staff - Get all staff`);
  console.log(`- /api/patients - Get all patients`);
  console.log(`- /api/coordinator - Coordinator dashboard data`);
  console.log(`- /api/supervisor - Supervisor dashboard data`);
  console.log(`- /api/professional/:id - Professional dashboard`);
  console.log(`===============================\n`);
});
