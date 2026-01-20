// ============================================
// Hospital Scheduler v2.0 - Main Application
// Cleaned Version
// ============================================

const API_BASE = '/api';

// State Management
const state = {
  currentDashboard: 'coordinator',
  currentStaffId: 1,
  currentPatientId: 101,
  selectedSwapSession: null,
  selectedSwapStaff: null,
  selectedApprovalId: null,
  coordinatorData: null,
  supervisorData: null,
  professionalData: null,
  patientData: null,
  notifications: [],
  staff: [],
  patients: []
};

// ============================================
// MOCK PATIENT DATA (for map functionality)
// ============================================

const mockPatients = [
  { id: 101, name: 'A. Marika', careNeeds: ['Palliative'], location: 'Oulu', address: 'Isokatu 1', latitude: 65.01585, longitude: 25.47898, preferredTime: 'Morning', priority: 'Urgent' },
  { id: 102, name: 'T. Vikke', careNeeds: ['Infection'], location: 'Oulu', address: 'Kalervantie 2', latitude: 65.06318, longitude: 25.48467, preferredTime: 'Afternoon', priority: 'Normal' },
  { id: 103, name: 'T. Mäki', careNeeds: ['Acute'], location: 'Kiiminki', address: 'Kivitie 5', latitude: 65.21678, longitude: 25.32988, preferredTime: 'Morning', priority: 'Normal' },
  { id: 104, name: 'Laouri', careNeeds: ['Palliative'], location: 'Kempele', address: 'Kauppakuja 8', latitude: 64.92385, longitude: 25.50677, preferredTime: 'Afternoon', priority: 'Normal' },
  { id: 105, name: 'P. Laine', careNeeds: ['Geriatrics', 'Palliative'], location: 'Oulu', address: 'Puistokatu 3', latitude: 65.00808, longitude: 25.44903, preferredTime: 'Morning', priority: 'Urgent' },
];

// ============================================
// MOCK API FOR DEVELOPMENT
// ============================================

async function fetchAPIMock(endpoint, options = {}) {
  console.log('Mock API call:', endpoint);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock responses for different endpoints
  const mockResponses = {
  '/staff': {
    staff: [
      { 
        id: 1, 
        name: 'Nurse Anna Smith', 
        role: 'Registered Nurse', 
        expertise: ['Geriatrics', 'Palliative Care', 'Pain Management'], 
        coverage: ['Oulu', 'Kempele'],
        photo: 'staff/anna-smith.jpg',
        rating: 4.9,
        experience: '8 years',
        languages: ['Finnish', 'English', 'Swedish'],
        certifications: ['Palliative Care Specialist', 'Wound Care Certified'],
        availability: 'Mon-Wed-Fri: 9:00-17:00',
        maxDailyVisits: 6,
        preferredAreas: ['Oulu Center', 'Kempele South']
      },
      { 
        id: 2, 
        name: 'Dr. Benjamin Johnson', 
        role: 'General Practitioner', 
        expertise: ['Acute Care', 'Infectious Diseases', 'Emergency Medicine'], 
        coverage: ['Oulu', 'Kiiminki'],
        photo: 'staff/benjamin-johnson.jpg',
        rating: 4.8,
        experience: '12 years',
        languages: ['Finnish', 'English'],
        certifications: ['Emergency Medicine Specialist', 'Infection Control'],
        availability: 'Tue-Thu: 8:00-16:00',
        maxDailyVisits: 4,
        preferredAreas: ['Oulu Hospital District', 'Kiiminki Central']
      },
      { 
        id: 3, 
        name: 'Nurse Clara Wilson', 
        role: 'Clinical Nurse Specialist', 
        expertise: ['Post-op Care', 'Wound Care', 'Rehabilitation'], 
        coverage: ['Kempele', 'Kiiminki'],
        photo: 'staff/clara-wilson.jpg',
        rating: 4.7,
        experience: '6 years',
        languages: ['Finnish', 'English'],
        certifications: ['Clinical Nurse Specialist', 'Wound Care Certified'],
        availability: 'Mon-Fri: 10:00-18:00',
        maxDailyVisits: 5,
        preferredAreas: ['Kempele Central', 'Kiiminki West']
      },
      { 
        id: 4, 
        name: 'Nurse Markus Korhonen', 
        role: 'Geriatric Nurse', 
        expertise: ['Geriatrics', 'Dementia Care', 'Mobility'], 
        coverage: ['Oulu'],
        photo: 'staff/markus-korhonen.jpg',
        rating: 4.6,
        experience: '10 years',
        languages: ['Finnish'],
        certifications: ['Geriatric Nursing Specialist', 'Dementia Care'],
        availability: 'Mon-Sat: 8:00-16:00',
        maxDailyVisits: 7,
        preferredAreas: ['Oulu North', 'Oulu Center']
      }
    ]
  },
  
  '/patients': {
    patients: [
      { 
        id: 101, 
        name: 'A. Marika', 
        age: 78,
        gender: 'Female',
        careNeeds: ['Palliative Care', 'Pain Management', 'Mobility Support'], 
        location: 'Oulu', 
        address: 'Isokatu 1, 90100 Oulu',
        latitude: 65.01585,
        longitude: 25.47898,
        preferredTime: 'Morning (9:00-12:00)',
        priority: 'Urgent',
        photo: '/patients/marika.jpg',
        lastVisit: '2024-01-18',
        nextVisit: '2024-01-20',
        notes: 'Requires daily pain medication check. Family support available.',
        contactPerson: 'Daughter: +358 40 123 4567',
        room: 'Apartment 5B'
      },
      { 
        id: 102, 
        name: 'T. Vikke', 
        age: 65,
        gender: 'Male',
        careNeeds: ['Infection Control', 'Antibiotic Therapy', 'Wound Care'], 
        location: 'Oulu', 
        address: 'Kalervantie 2, 90230 Oulu',
        latitude: 65.06318,
        longitude: 25.48467,
        preferredTime: 'Afternoon (13:00-16:00)',
        priority: 'Normal',
        photo: '/patients/vikke.jpg',
        lastVisit: '2024-01-19',
        nextVisit: '2024-01-21',
        notes: 'Post-surgery wound care. Monitor for infection signs.',
        contactPerson: 'Wife: +358 40 234 5678',
        room: 'House, ground floor'
      },
      { 
        id: 103, 
        name: 'T. Mäki', 
        age: 72,
        gender: 'Male',
        careNeeds: ['Acute Care', 'Blood Pressure Monitoring', 'Medication Management'], 
        location: 'Kiiminki', 
        address: 'Kivitie 5, 90900 Kiiminki',
        latitude: 65.21678,
        longitude: 25.32988,
        preferredTime: 'Morning (8:00-11:00)',
        priority: 'Normal',
        photo: '/patients/maki.jpg',
        lastVisit: '2024-01-17',
        nextVisit: '2024-01-22',
        notes: 'Hypertension patient. Requires daily BP check.',
        contactPerson: 'Son: +358 40 345 6789',
        room: 'Apartment 3A'
      },
      { 
        id: 104, 
        name: 'P. Lauri', 
        age: 85,
        gender: 'Male',
        careNeeds: ['Palliative Care', 'Oxygen Therapy', 'Nutrition Support'], 
        location: 'Kempele', 
        address: 'Kauppakuja 8, 90440 Kempele',
        latitude: 64.92385,
        longitude: 25.50677,
        preferredTime: 'Afternoon (14:00-17:00)',
        priority: 'Normal',
        photo: '/patients/lauri.jpg',
        lastVisit: '2024-01-16',
        nextVisit: '2024-01-20',
        notes: 'Terminal cancer patient. Requires gentle handling.',
        contactPerson: 'Home Care Nurse: +358 40 456 7890',
        room: 'Room 12, Senior Home'
      },
      { 
        id: 105, 
        name: 'P. Laine', 
        age: 81,
        gender: 'Female',
        careNeeds: ['Geriatrics', 'Palliative Care', 'Diabetes Management'], 
        location: 'Oulu', 
        address: 'Puistokatu 3, 90100 Oulu',
        latitude: 65.00808,
        longitude: 25.44903,
        preferredTime: 'Morning (10:00-13:00)',
        priority: 'Urgent',
        photo: '/patients/laine.jpg',
        lastVisit: '2024-01-19',
        nextVisit: '2024-01-20',
        notes: 'Diabetic with palliative needs. Check blood sugar levels.',
        contactPerson: 'Daughter-in-law: +358 40 567 8901',
        room: 'Apartment 7C'
      }
    ]
  },
  
  '/professional/1': {
    staff: { 
      id: 1, 
      name: 'Nurse Anna Smith', 
      role: 'Registered Nurse',
      photo: '/staff/anna-smith.jpg',
      todayStats: { visits: 4, hours: 6.5, patients: 3, distance: '18 km' },
      weeklyStats: { visits: 12, hours: 32, patients: 8, distance: '65 km' }
    },
    schedule: [
      { 
        id: 1, 
        patientId: 101, 
        patientName: 'A. Marika',
        patientPhoto: '/patients/marika.jpg',
        date: '2024-01-20', 
        time: '09:00 - 10:30', 
        timeSlot: 'Morning',
        careType: 'Palliative Care',
        location: 'Oulu', 
        address: 'Isokatu 1, 90100 Oulu',
        distance: '2.3 km',
        estimatedTravel: '15 min',
        canSwap: true, 
        priority: 'Urgent', 
        duration: 90,
        status: 'confirmed',
        notes: 'Check pain medication levels. Bring morphine.',
        equipment: ['Pain scale chart', 'Medication kit', 'Disposable gloves'],
        tasks: ['Pain assessment', 'Medication administration', 'Comfort care']
      },
      { 
        id: 2, 
        patientId: 102, 
        patientName: 'T. Vikke',
        patientPhoto: '/patients/vikke.jpg',
        date: '2024-01-20', 
        time: '11:00 - 12:00', 
        timeSlot: 'Morning',
        careType: 'Infection Control',
        location: 'Oulu', 
        address: 'Kalervantie 2, 90230 Oulu',
        distance: '1.8 km',
        estimatedTravel: '10 min',
        canSwap: false, 
        priority: 'Normal', 
        duration: 60,
        status: 'confirmed',
        notes: 'Post-surgery wound dressing change',
        equipment: ['Wound care kit', 'Antibiotic ointment', 'Sterile dressings'],
        tasks: ['Wound assessment', 'Dressing change', 'Infection monitoring']
      },
      { 
        id: 3, 
        patientId: 105, 
        patientName: 'P. Laine',
        patientPhoto: '/patients/laine.jpg',
        date: '2024-01-20', 
        time: '13:30 - 15:00', 
        timeSlot: 'Afternoon',
        careType: 'Diabetes & Palliative Care',
        location: 'Oulu', 
        address: 'Puistokatu 3, 90100 Oulu',
        distance: '3.5 km',
        estimatedTravel: '20 min',
        canSwap: true, 
        priority: 'Urgent', 
        duration: 90,
        status: 'confirmed',
        notes: 'Blood sugar check and insulin administration',
        equipment: ['Glucometer', 'Insulin kit', 'Sharps container'],
        tasks: ['Blood glucose check', 'Insulin injection', 'Foot examination']
      }
    ],
    schedulePeriod: { 
      startDate: '2024-01-20', 
      endDate: '2024-01-26',
      totalHours: 32,
      totalVisits: 12,
      averageDailyVisits: 2.4,
      coverageAreas: ['Oulu Center', 'Kempele']
    }
  },
  
  '/professional/2': {
    staff: { 
      id: 2, 
      name: 'Dr. Benjamin Johnson', 
      role: 'General Practitioner',
      photo: '/staff/benjamin-johnson.jpg',
      todayStats: { visits: 2, hours: 4, patients: 2, distance: '25 km' },
      weeklyStats: { visits: 8, hours: 20, patients: 6, distance: '85 km' }
    },
    schedule: [
      { 
        id: 3, 
        patientId: 103, 
        patientName: 'T. Mäki',
        patientPhoto: '/patients/maki.jpg',
        date: '2024-01-22', 
        time: '14:00 - 15:30', 
        timeSlot: 'Afternoon',
        careType: 'Acute Care',
        location: 'Kiiminki', 
        address: 'Kivitie 5, 90900 Kiiminki',
        distance: '15.2 km',
        estimatedTravel: '25 min',
        canSwap: true, 
        priority: 'Normal', 
        duration: 90,
        status: 'confirmed',
        notes: 'Hypertension follow-up. Adjust medication if needed.',
        equipment: ['Blood pressure monitor', 'Stethoscope', 'ECG machine'],
        tasks: ['Blood pressure measurement', 'Medication review', 'Physical examination']
      },
      { 
        id: 4, 
        patientId: 104, 
        patientName: 'P. Lauri',
        patientPhoto: '/patients/lauri.jpg',
        date: '2024-01-23', 
        time: '10:00 - 11:30', 
        timeSlot: 'Morning',
        careType: 'Palliative Consultation',
        location: 'Kempele', 
        address: 'Kauppakuja 8, 90440 Kempele',
        distance: '12.8 km',
        estimatedTravel: '20 min',
        canSwap: false, 
        priority: 'Normal', 
        duration: 90,
        status: 'pending',
        notes: 'Palliative care plan review with family',
        equipment: ['Medical records', 'Prescription pad', 'Oxygen monitor'],
        tasks: ['Care plan review', 'Family consultation', 'Symptom management']
      }
    ],
    schedulePeriod: { 
      startDate: '2024-01-20', 
      endDate: '2024-01-26',
      totalHours: 20,
      totalVisits: 8,
      averageDailyVisits: 1.6,
      coverageAreas: ['Oulu', 'Kiiminki']
    }
  },
  
  '/patient/101': {
    patient: { 
      id: 101, 
      name: 'A. Marika', 
      age: 78,
      gender: 'Female',
      address: 'Isokatu 1, 90100 Oulu', 
      location: 'Oulu', 
      careNeeds: ['Palliative Care', 'Pain Management'], 
      priority: 'Urgent',
      photo: '/patients/marika.jpg',
      room: 'Apartment 5B',
      contactPerson: 'Daughter: +358 40 123 4567',
      medicalConditions: ['Terminal cancer', 'Chronic pain', 'Mobility issues'],
      allergies: ['Morphine (alternative available)', 'Latex'],
      preferences: 'Prefers female caregivers, morning visits'
    },
    upcomingVisits: [
      { 
        id: 1, 
        date: '2024-01-20', 
        time: '09:00', 
        duration: '90 min', 
        careType: 'Palliative Care', 
        staffName: 'Nurse Anna Smith',
        staffPhoto: '/staff/anna-smith.jpg',
        status: 'Scheduled',
        notes: 'Pain management and comfort care'
      },
      { 
        id: 2, 
        date: '2024-01-22', 
        time: '14:00', 
        duration: '60 min', 
        careType: 'Follow-up', 
        staffName: 'Dr. Benjamin Johnson',
        staffPhoto: '/staff/benjamin-johnson.jpg',
        status: 'Confirmed',
        notes: 'Medical review and care plan adjustment'
      },
      { 
        id: 3, 
        date: '2024-01-24', 
        time: '10:00', 
        duration: '90 min', 
        careType: 'Palliative Care', 
        staffName: 'Nurse Anna Smith',
        staffPhoto: '/staff/anna-smith.jpg',
        status: 'Scheduled',
        notes: 'Regular palliative care visit'
      }
    ],
    recentVisits: [
      { 
        id: 1, 
        date: '2024-01-18', 
        time: '09:30', 
        duration: '85 min', 
        careType: 'Palliative Care', 
        staffName: 'Nurse Anna Smith',
        notes: 'Pain well controlled. Resting comfortably.',
        outcome: 'Stable'
      },
      { 
        id: 2, 
        date: '2024-01-16', 
        time: '14:15', 
        duration: '60 min', 
        careType: 'Medical Review', 
        staffName: 'Dr. Benjamin Johnson',
        notes: 'Adjusted pain medication dosage.',
        outcome: 'Medication adjusted'
      }
    ]
  },
  
  '/patient/102': {
    patient: { 
      id: 102, 
      name: 'T. Vikke', 
      age: 65,
      gender: 'Male',
      address: 'Kalervantie 2, 90230 Oulu', 
      location: 'Oulu', 
      careNeeds: ['Infection Control', 'Wound Care'], 
      priority: 'Normal',
      photo: '/patients/vikke.jpg',
      room: 'House, ground floor',
      contactPerson: 'Wife: +358 40 234 5678',
      medicalConditions: ['Post-surgery recovery', 'Wound infection'],
      allergies: 'None known',
      preferences: 'Afternoon visits preferred'
    },
    upcomingVisits: [
      { 
        id: 1, 
        date: '2024-01-20', 
        time: '11:00', 
        duration: '60 min', 
        careType: 'Wound Care', 
        staffName: 'Nurse Anna Smith',
        staffPhoto: '/staff/anna-smith.jpg',
        status: 'Scheduled',
        notes: 'Wound dressing change and assessment'
      },
      { 
        id: 2, 
        date: '2024-01-23', 
        time: '13:30', 
        duration: '45 min', 
        careType: 'Follow-up', 
        staffName: 'Nurse Clara Wilson',
        staffPhoto: '/staff/clara-wilson.jpg',
        status: 'Confirmed',
        notes: 'Check healing progress'
      }
    ]
  },
  
  '/coordinator': {
    staff: [
      { id: 1, name: 'Nurse Anna Smith', role: 'Registered Nurse', photo: '/staff/anna-smith.jpg' },
      { id: 2, name: 'Dr. Benjamin Johnson', role: 'General Practitioner', photo: '/staff/benjamin-johnson.jpg' },
      { id: 3, name: 'Nurse Clara Wilson', role: 'Clinical Nurse', photo: '/staff/clara-wilson.jpg' },
      { id: 4, name: 'Nurse Markus Korhonen', role: 'Geriatric Nurse', photo: '/staff/markus-korhonen.jpg' }
    ],
    patients: [
      // Use the enhanced patient data from above
      { id: 101, name: 'A. Marika', priority: 'Urgent', location: 'Oulu', nextVisit: 'Today 09:00', staffAssigned: 'Nurse A. Smith' },
      { id: 102, name: 'T. Vikke', priority: 'Normal', location: 'Oulu', nextVisit: 'Today 11:00', staffAssigned: 'Nurse A. Smith' },
      { id: 103, name: 'T. Mäki', priority: 'Normal', location: 'Kiiminki', nextVisit: 'Jan 22 14:00', staffAssigned: 'Dr. B. Johnson' },
      { id: 104, name: 'P. Lauri', priority: 'Normal', location: 'Kempele', nextVisit: 'Jan 23 10:00', staffAssigned: 'Dr. B. Johnson' },
      { id: 105, name: 'P. Laine', priority: 'Urgent', location: 'Oulu', nextVisit: 'Today 13:30', staffAssigned: 'Nurse A. Smith' }
    ],
    schedule: [
      { 
        id: 1, 
        patientId: 101, 
        patientName: 'A. Marika', 
        patientPhoto: '/patients/marika.jpg',
        date: '2024-01-20', 
        time: '09:00', 
        staffName: 'Nurse Anna Smith', 
        staffId: 1, 
        staffPhoto: '/staff/anna-smith.jpg',
        careType: 'Palliative Care', 
        location: 'Oulu', 
        duration: 90, 
        priority: 'Urgent', 
        status: 'Scheduled',
        color: 'red'
      },
      { 
        id: 2, 
        patientId: 102, 
        patientName: 'T. Vikke', 
        patientPhoto: '/patients/vikke.jpg',
        date: '2024-01-20', 
        time: '11:00', 
        staffName: 'Nurse Anna Smith', 
        staffId: 1,
        staffPhoto: '/staff/anna-smith.jpg',
        careType: 'Wound Care', 
        location: 'Oulu', 
        duration: 60, 
        priority: 'Normal', 
        status: 'Scheduled',
        color: 'blue'
      },
      { 
        id: 3, 
        patientId: 105, 
        patientName: 'P. Laine', 
        patientPhoto: '/patients/laine.jpg',
        date: '2024-01-20', 
        time: '13:30', 
        staffName: 'Nurse Anna Smith', 
        staffId: 1,
        staffPhoto: '/staff/anna-smith.jpg',
        careType: 'Diabetes Care', 
        location: 'Oulu', 
        duration: 90, 
        priority: 'Urgent', 
        status: 'Scheduled',
        color: 'red'
      },
      { 
        id: 4, 
        patientId: 103, 
        patientName: 'T. Mäki', 
        patientPhoto: '/patients/maki.jpg',
        date: '2024-01-22', 
        time: '14:00', 
        staffName: 'Dr. Benjamin Johnson', 
        staffId: 2,
        staffPhoto: '/staff/benjamin-johnson.jpg',
        careType: 'Acute Care', 
        location: 'Kiiminki', 
        duration: 90, 
        priority: 'Normal', 
        status: 'Confirmed',
        color: 'green'
      }
    ],
    activeRules: [
      { 
        staffName: 'Nurse Anna Smith', 
        staffRole: 'Registered Nurse',
        days: ['Mon', 'Wed', 'Fri'], 
        startTime: '09:00', 
        endTime: '17:00', 
        maxHours: 8, 
        maxVisits: 6,
        individualRules: { 
          maxTravelDistance: 30, 
          noOvertime: true, 
          preferUrgentCases: true,
          equipment: 'Full nursing kit required'
        },
        color: 'purple'
      },
      { 
        staffName: 'Dr. Benjamin Johnson', 
        staffRole: 'General Practitioner',
        days: ['Tue', 'Thu'], 
        startTime: '08:00', 
        endTime: '16:00', 
        maxHours: 8, 
        maxVisits: 4,
        individualRules: { 
          maxTravelDistance: 50, 
          emergencyCalls: true,
          equipment: 'Medical bag with diagnostics'
        },
        color: 'orange'
      }
    ],
    approvedAvailability: [
      { 
        staffName: 'Nurse Anna Smith', 
        staffRole: 'Registered Nurse', 
        staffPhoto: '/staff/anna-smith.jpg',
        days: ['Monday', 'Wednesday', 'Friday'], 
        startTime: '09:00', 
        endTime: '17:00', 
        maxHours: 8, 
        maxVisits: 6,
        coverageAreas: ['Oulu', 'Kempele'], 
        individualRules: { 
          maxTravelDistance: 30, 
          priorityPatients: true, 
          overtimeAllowed: false,
          preferredEquipment: 'Mobile nursing station'
        },
        status: 'Active',
        validUntil: '2024-06-30'
      }
    ],
    schedulePeriod: { 
      startDate: '2024-01-20', 
      endDate: '2024-01-26',
      totalStaff: 4,
      totalPatients: 5,
      totalVisits: 15,
      totalHours: 38
    }
  },
  
  '/supervisor': {
    pendingAvailability: [
      { 
        id: 1, 
        staffName: 'Nurse Clara Wilson', 
        staffRole: 'Clinical Nurse',
        staffPhoto: '/staff/clara-wilson.jpg',
        days: ['Tuesday', 'Thursday'], 
        startTime: '08:00', 
        endTime: '16:00', 
        maxHours: 8, 
        maxVisits: 5,
        coverageAreas: ['Kempele', 'Kiiminki'], 
        preferences: { 
          travelPreference: 'minimal', 
          shiftPreference: 'morning', 
          notes: 'Prefer morning shifts for better patient interaction'
        },
        submittedDate: '2024-01-19',
        status: 'Pending Review'
      },
      { 
        id: 2, 
        staffName: 'Nurse Markus Korhonen', 
        staffRole: 'Geriatric Nurse',
        staffPhoto: '/staff/markus-korhonen.jpg',
        days: ['Monday', 'Wednesday', 'Saturday'], 
        startTime: '08:00', 
        endTime: '16:00', 
        maxHours: 8, 
        maxVisits: 7,
        coverageAreas: ['Oulu'], 
        preferences: { 
          travelPreference: 'within city', 
          shiftPreference: 'early morning', 
          notes: 'Available for weekend shifts'
        },
        submittedDate: '2024-01-18',
        status: 'Pending Review'
      }
    ],
    approvedAvailability: [
      { 
        staffName: 'Nurse Anna Smith', 
        staffRole: 'Registered Nurse', 
        staffPhoto: '/staff/anna-smith.jpg',
        days: ['Monday', 'Wednesday', 'Friday'], 
        startTime: '09:00', 
        endTime: '17:00', 
        maxHours: 8, 
        maxVisits: 6,
        coverageAreas: ['Oulu', 'Kempele'],
        approvedDate: '2024-01-15',
        approvedBy: 'Supervisor Matti',
        status: 'Active'
      },
      { 
        staffName: 'Dr. Benjamin Johnson', 
        staffRole: 'General Practitioner', 
        staffPhoto: '/staff/benjamin-johnson.jpg',
        days: ['Tuesday', 'Thursday'], 
        startTime: '08:00', 
        endTime: '16:00', 
        maxHours: 8, 
        maxVisits: 4,
        coverageAreas: ['Oulu', 'Kiiminki'],
        approvedDate: '2024-01-10',
        approvedBy: 'Supervisor Matti',
        status: 'Active'
      }
    ],
    rejectedAvailability: [
      { 
        staffName: 'Nurse Test User', 
        staffRole: 'Temporary Nurse',
        days: ['Weekends'], 
        startTime: '07:00', 
        endTime: '19:00', 
        maxHours: 12,
        coverageAreas: ['All areas'],
        reason: 'Exceeds maximum allowed working hours',
        rejectedDate: '2024-01-12',
        rejectedBy: 'Supervisor Matti'
      }
    ],
    swapLog: [
      { 
        id: 1, 
        originalStaffName: 'Nurse Anna Smith', 
        originalStaffPhoto: '/staff/anna-smith.jpg',
        newStaffName: 'Nurse Markus Korhonen',
        newStaffPhoto: '/staff/markus-korhonen.jpg',
        sessionId: 1, 
        reason: 'Emergency family leave', 
        swappedAt: '2024-01-19 08:30',
        approvedBy: 'Coordinator Liisa',
        status: 'Completed'
      },
      { 
        id: 2, 
        originalStaffName: 'Nurse Clara Wilson', 
        originalStaffPhoto: '/staff/clara-wilson.jpg',
        newStaffName: 'Nurse Markus Korhonen',
        newStaffPhoto: '/staff/markus-korhonen.jpg',
        sessionId: 3, 
        reason: 'Training session conflict', 
        swappedAt: '2024-01-18 14:15',
        approvedBy: 'Supervisor Matti',
        status: 'Completed'
      }
    ],
    workload: {
      'Nurse Anna Smith': { 
        role: 'Registered Nurse', 
        tasks: 5, 
        hours: 32,
        patients: 8,
        efficiency: 92,
        color: 'blue'
      },
      'Dr. Benjamin Johnson': { 
        role: 'General Practitioner', 
        tasks: 3, 
        hours: 20,
        patients: 6,
        efficiency: 88,
        color: 'green'
      },
      'Nurse Clara Wilson': { 
        role: 'Clinical Nurse', 
        tasks: 2, 
        hours: 16,
        patients: 4,
        efficiency: 85,
        color: 'orange'
      },
      'Nurse Markus Korhonen': { 
        role: 'Geriatric Nurse', 
        tasks: 4, 
        hours: 24,
        patients: 7,
        efficiency: 90,
        color: 'purple'
      }
    },
    alerts: [
      { id: 1, type: 'warning', message: 'Nurse Anna Smith approaching maximum weekly hours', staff: 'Nurse Anna Smith', time: '2024-01-20 10:00' },
      { id: 2, type: 'info', message: 'New availability request pending review', staff: 'Nurse Clara Wilson', time: '2024-01-19 16:30' },
      { id: 3, type: 'success', message: 'Shift swap completed successfully', staff: 'Nurse Anna Smith', time: '2024-01-19 09:15' }
    ]
  }
};
  
  // Return mock response or empty data
  const path = endpoint.split('?')[0];
  return mockResponses[path] || { success: true, message: 'Mock response' };
}

// ============================================
// API UTILITY FUNCTIONS
// ============================================

async function fetchAPI(endpoint, options = {}) {
  // In development, use mock data
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return fetchAPIMock(endpoint, options);
  }
  
  // In production, use real API
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    showToast('Error', 'Failed to connect to server', 'error');
    throw error;
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getDayInfo(dateStr) {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return { day: date.getDate(), month: months[date.getMonth()], weekday: days[date.getDay()] };
}

function isToday(dateStr) {
  return dateStr === new Date().toISOString().split('T')[0];
}

// ============================================
// MAP FUNCTIONS (PROFESSIONAL DASHBOARD ONLY)
// ============================================

function openLocationInMaps(lat, lng, address = '') {
  if (lat && lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  } else if (address) {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }
}

function getDirectionsToPatient(patient) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${patient.latitude},${patient.longitude}&travelmode=driving`,
        '_blank'
      );
    }, () => {
      openLocationInMaps(patient.latitude, patient.longitude, `${patient.address}, ${patient.location}`);
    });
  } else {
    openLocationInMaps(patient.latitude, patient.longitude, `${patient.address}, ${patient.location}`);
  }
}

function createProfessionalSessionCard(sessionData) {
  const patient = mockPatients.find(p => p.id === sessionData.patientId);
  if (!patient) return '';
  
  const isTodayFlag = isToday(sessionData.date);
  const isUrgent = patient.priority === 'Urgent';
  const date = new Date(sessionData.date);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const weekday = date.toLocaleString('en-US', { weekday: 'short' });
  
  return `
    <div class="session-card ${isUrgent ? 'urgent' : ''} ${isTodayFlag ? 'today' : ''}">
      <div class="session-date">
        <div class="day">${day}</div>
        <div class="month">${month}</div>
        <div class="weekday">${weekday}</div>
      </div>
      <div class="session-info">
        <h4>${patient.name}</h4>
        <div class="time">${sessionData.time}</div>
        <div class="details">
          <span>Care: ${patient.careNeeds.join(', ')}</span> • 
          <span>Location: 
            <span class="location-link" 
                  onclick="window.openLocationInMaps(${patient.latitude}, ${patient.longitude}, '${patient.address}, ${patient.location}')"
                  title="Click to open in Google Maps">
              📍 ${patient.location}
            </span>
          </span>
        </div>
        <div class="patient-address" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
          ${patient.address}
        </div>
      </div>
      <div class="session-actions">
        <span class="swap-status ${sessionData.canSwap ? 'can-swap' : 'cannot-swap'}">
          ${sessionData.canSwap ? '🔄 Can Swap' : '⏸️ Fixed'}
        </span>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${sessionData.canSwap ? 
            '<button class="btn btn-sm btn-primary swap-btn" data-session-id="' + sessionData.id + '">Swap</button>' : 
            ''
          }
          <button class="btn btn-sm btn-secondary location-btn" 
                  onclick="window.openLocationInMaps(${patient.latitude}, ${patient.longitude}, '${patient.address}, ${patient.location}')"
                  title="Open in Google Maps">
            📍 Map
          </button>
          <button class="btn btn-sm btn-secondary directions-btn" 
                  onclick="window.getDirectionsToPatient(${JSON.stringify(patient).replace(/"/g, '&quot;')})"
                  title="Get directions from your location">
            🚗 Directions
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// TOAST & LOADING
// ============================================

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">&times;</button>
  `;
  container.appendChild(toast);
  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  setTimeout(() => toast.remove(), 5000);
}

function showLoading() { 
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.remove('hidden'); 
}

function hideLoading() { 
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.add('hidden'); 
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchDashboard(btn.dataset.dashboard));
  });
}

function switchDashboard(dashboard) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.dashboard === dashboard);
  });
  document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));
  const target = document.getElementById(`${dashboard}-dashboard`);
  if (target) target.classList.remove('hidden');
  state.currentDashboard = dashboard;
  
  switch(dashboard) {
    case 'coordinator': loadCoordinatorDashboard(); break;
    case 'supervisor': loadSupervisorDashboard(); break;
    case 'professional': loadProfessionalDashboard(); break;
    case 'patient': loadPatientDashboard(); break;
  }
}

// ============================================
// NOTIFICATIONS
// ============================================

function initNotifications() {
  const btn = document.getElementById('notificationBtn');
  const panel = document.getElementById('notificationPanel');
  
  if (btn && panel) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('show');
      if (panel.classList.contains('show')) loadNotifications();
    });
    
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove('show');
    });
    
    const markAllBtn = document.getElementById('markAllReadBtn');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', markAllNotificationsRead);
    }
  }
}

async function loadNotifications() {
  try {
    const type = state.currentDashboard === 'professional' ? 'staff' : state.currentDashboard;
    const id = state.currentDashboard === 'professional' ? state.currentStaffId : '';
    const data = await fetchAPI(`/notifications/${type}/${id}`);
    state.notifications = data.notifications || [];
    renderNotifications();
    updateNotificationBadge(data.unreadCount || 0);
  } catch (error) { console.error('Error loading notifications:', error); }
}

function renderNotifications() {
  const list = document.getElementById('notificationList');
  if (!list) return;
  
  if (state.notifications.length === 0) {
    list.innerHTML = '<div class="notification-empty">No notifications</div>';
    return;
  }
  list.innerHTML = state.notifications.map(n => `
    <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
      <div class="notification-title">${n.title}</div>
      <div class="notification-message">${n.message}</div>
      <div class="notification-time">${formatDateTime(n.createdAt)}</div>
    </div>
  `).join('');
  list.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => markNotificationRead(item.dataset.id));
  });
}

function updateNotificationBadge(count) {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

async function markNotificationRead(id) {
  try { await fetchAPI(`/notifications/${id}/read`, { method: 'PUT' }); loadNotifications(); } 
  catch (error) { console.error('Error:', error); }
}

async function markAllNotificationsRead() {
  try {
    const type = state.currentDashboard === 'professional' ? 'staff' : state.currentDashboard;
    const id = state.currentDashboard === 'professional' ? state.currentStaffId : '';
    await fetchAPI(`/notifications/mark-all-read/${type}/${id}`, { method: 'PUT' });
    loadNotifications();
    showToast('Success', 'All notifications marked as read', 'success');
  } catch (error) { console.error('Error:', error); }
}

// ============================================
// COORDINATOR DASHBOARD
// ============================================

async function loadCoordinatorDashboard() {
  try {
    const data = await fetchAPI('/coordinator');
    state.coordinatorData = data;
    state.staff = data.staff || [];
    state.patients = data.patients || [];
    
    document.getElementById('totalStaff').textContent = data.staff?.length || 0;
    document.getElementById('totalPatients').textContent = data.patients?.length || 0;
    document.getElementById('totalSessions').textContent = data.schedule?.length || 0;
    document.getElementById('approvedRules').textContent = data.activeRules?.length || 0;
    document.getElementById('approvedCount').textContent = data.approvedAvailability?.length || 0;
    document.getElementById('schedulePeriod').textContent = `${formatDate(data.schedulePeriod?.startDate)} - ${formatDate(data.schedulePeriod?.endDate)}`;
    
    populateStaffFilter(data.staff || []);
    renderApprovedAvailability(data.approvedAvailability || []);
    renderActiveRules(data.activeRules || []);
    renderScheduleTable(data.schedule || []);
  } catch (error) { console.error('Error:', error); }
}

function populateStaffFilter(staff) {
  const select = document.getElementById('filterStaff');
  if (select) {
    select.innerHTML = '<option value="">All Staff</option>' + staff.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  }
}

function renderApprovedAvailability(availability) {
  const container = document.getElementById('approvedAvailabilityList');
  if (!container) return;
  
  if (availability.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No approved availability yet</h3><p>Approved availability will appear here after supervisor review</p></div>`;
    return;
  }
  container.innerHTML = availability.map(a => `
    <div class="availability-card">
      <div class="availability-header">
        <div class="staff-info">
          <div class="staff-avatar">${getInitials(a.staffName)}</div>
          <div class="staff-details"><h4>${a.staffName}</h4><span class="role">${a.staffRole}</span></div>
        </div>
        <span class="status-badge status-approved">Approved</span>
      </div>
      <div class="availability-meta">
        <div class="meta-item"><span class="meta-label">Days</span><div class="days-list">${(a.days || []).map(d => `<span class="day-badge">${d.slice(0,3)}</span>`).join('')}</div></div>
        <div class="meta-item"><span class="meta-label">Hours</span><span class="meta-value">${a.startTime} - ${a.endTime}</span></div>
        <div class="meta-item"><span class="meta-label">Max Hours</span><span class="meta-value">${a.maxHours}h/day</span></div>
        <div class="meta-item"><span class="meta-label">Coverage</span><div class="coverage-list">${(a.coverageAreas || []).map(c => `<span class="coverage-badge">${c}</span>`).join('')}</div></div>
      </div>
      ${a.individualRules ? `<div class="preferences-section"><div class="preferences-title">Individual Rules</div><div class="preference-tags"><span class="preference-tag">Max Travel: ${a.individualRules.maxTravelDistance}km</span><span class="preference-tag">Priority: ${a.individualRules.priorityPatients ? 'Yes' : 'No'}</span><span class="preference-tag">Overtime: ${a.individualRules.overtimeAllowed ? 'Yes' : 'No'}</span></div></div>` : ''}
    </div>
  `).join('');
}

function renderActiveRules(rules) {
  const container = document.getElementById('activeRulesDisplay');
  if (!container) return;
  
  if (rules.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📜</div><h3>No active rules</h3></div>`;
    return;
  }
  container.innerHTML = rules.map(r => `
    <div class="rule-item">
      <div class="rule-info"><span class="rule-icon">👤</span><div class="rule-details"><h4>${r.staffName}</h4><span>${(r.days || []).join(', ')} | ${r.startTime}-${r.endTime}</span></div></div>
      <div class="rule-values"><span>🚗 ${r.individualRules?.maxTravelDistance || 30}km</span><span>⏰ ${r.maxHours}h/day</span></div>
    </div>
  `).join('');
}

function renderScheduleTable(schedule) {
  const tbody = document.getElementById('scheduleTableBody');
  if (!tbody) return;
  
  if (schedule.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><div class="empty-state-icon">📅</div><h3>No schedule generated</h3><p>Click "Run AI Scheduler" to generate</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = schedule.map(s => `
    <tr>
      <td>${formatDate(s.date)}</td><td>${s.time}</td><td>${s.staffName}</td><td>${s.patientName}</td>
      <td>${s.careType}</td><td>${s.location}</td><td>${s.duration} min</td>
      <td class="priority-${(s.priority || '').toLowerCase()}">${s.priority}</td>
      <td><span class="status-badge status-scheduled">${s.status}</span></td>
    </tr>
  `).join('');
}

function initCoordinatorActions() {
  const runBtn = document.getElementById('runSchedulerBtn');
  const exportBtn = document.getElementById('exportScheduleBtn');
  
  if (runBtn) {
    runBtn.addEventListener('click', runAIScheduler);
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      window.location.href = `${API_BASE}/coordinator/export-schedule`;
      showToast('Export', 'Schedule exported as CSV', 'success');
    });
  }
  
  const filterDate = document.getElementById('filterDate');
  const filterStaff = document.getElementById('filterStaff');
  const filterLocation = document.getElementById('filterLocation');
  
  if (filterDate) filterDate.addEventListener('change', filterSchedule);
  if (filterStaff) filterStaff.addEventListener('change', filterSchedule);
  if (filterLocation) filterLocation.addEventListener('change', filterSchedule);
}

async function runAIScheduler() {
  showLoading();
  try {
    const data = await fetchAPI('/coordinator/run-scheduler', { method: 'POST' });
    hideLoading();
    if (data.success) { showToast('Success', data.message, 'success'); loadCoordinatorDashboard(); }
  } catch (error) { hideLoading(); showToast('Error', 'Failed to run scheduler', 'error'); }
}

function filterSchedule() {
  const date = document.getElementById('filterDate')?.value;
  const staffId = document.getElementById('filterStaff')?.value;
  const location = document.getElementById('filterLocation')?.value;
  let filtered = state.coordinatorData?.schedule || [];
  if (date) filtered = filtered.filter(s => s.date === date);
  if (staffId) filtered = filtered.filter(s => s.staffId === parseInt(staffId));
  if (location) filtered = filtered.filter(s => s.location === location);
  renderScheduleTable(filtered);
}

// ============================================
// SUPERVISOR DASHBOARD
// ============================================

async function loadSupervisorDashboard() {
  try {
    const data = await fetchAPI('/supervisor');
    state.supervisorData = data;
    
    document.getElementById('pendingCount').textContent = data.pendingAvailability?.length || 0;
    document.getElementById('supervisorApprovedCount').textContent = data.approvedAvailability?.length || 0;
    document.getElementById('rejectedCount').textContent = data.rejectedAvailability?.length || 0;
    document.getElementById('swapCount').textContent = data.swapLog?.length || 0;
    document.getElementById('pendingBadge').textContent = data.pendingAvailability?.length || 0;
    
    renderPendingAvailability(data.pendingAvailability || []);
    renderSwapLog(data.swapLog || []);
    renderWorkloadGrid(data.workload || {});
  } catch (error) { console.error('Error:', error); }
}

function renderPendingAvailability(pending) {
  const container = document.getElementById('pendingAvailabilityList');
  if (!container) return;
  
  if (pending.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">✅</div><h3>All caught up!</h3><p>No pending submissions to review</p></div>`;
    return;
  }
  container.innerHTML = pending.map(a => `
    <div class="availability-card pending">
      <div class="availability-header">
        <div class="staff-info">
          <div class="staff-avatar">${getInitials(a.staffName)}</div>
          <div class="staff-details"><h4>${a.staffName}</h4><span class="role">${a.staffRole}</span></div>
        </div>
        <span class="status-badge status-pending">Pending Review</span>
      </div>
      <div class="availability-meta">
        <div class="meta-item"><span class="meta-label">Days</span><div class="days-list">${(a.days || []).map(d => `<span class="day-badge">${d.slice(0,3)}</span>`).join('')}</div></div>
        <div class="meta-item"><span class="meta-label">Hours</span><span class="meta-value">${a.startTime} - ${a.endTime}</span></div>
        <div class="meta-item"><span class="meta-label">Max Hours</span><span class="meta-value">${a.maxHours}h/day</span></div>
        <div class="meta-item"><span class="meta-label">Coverage</span><div class="coverage-list">${(a.coverageAreas || []).map(c => `<span class="coverage-badge">${c}</span>`).join('')}</div></div>
      </div>
      <div class="preferences-section">
        <div class="preferences-title">Professional Preferences</div>
        <div class="preference-tags">
          <span class="preference-tag ${a.preferences?.travelPreference === 'minimal' ? 'travel-minimal' : a.preferences?.travelPreference === 'flexible' ? 'travel-flexible' : ''}">Travel: ${a.preferences?.travelPreference}</span>
          <span class="preference-tag">Shift: ${a.preferences?.shiftPreference}</span>
        </div>
        ${a.preferences?.notes ? `<div class="preference-notes">"${a.preferences.notes}"</div>` : ''}
      </div>
      <div class="availability-actions">
        <button class="btn btn-success btn-sm" onclick="openApprovalModal(${a.id})"><span class="btn-icon">✅</span> Approve</button>
        <button class="btn btn-warning btn-sm" onclick="openApprovalModal(${a.id})"><span class="btn-icon">✏️</span> Modify</button>
        <button class="btn btn-danger btn-sm" onclick="rejectAvailability(${a.id})"><span class="btn-icon">❌</span> Reject</button>
      </div>
    </div>
  `).join('');
}

function renderSwapLog(swapLog) {
  const container = document.getElementById('swapLogList');
  if (!container) return;
  
  if (swapLog.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔄</div><h3>No swaps recorded</h3></div>`;
    return;
  }
  container.innerHTML = swapLog.map(s => `
    <div class="swap-log-item">
      <span class="swap-icon">🔄</span>
      <div class="swap-details"><h4>${s.originalStaffName} → ${s.newStaffName}</h4><p>Session #${s.sessionId} | ${s.reason}</p></div>
      <span class="swap-time">${formatDateTime(s.swappedAt)}</span>
    </div>
  `).join('');
}

function renderWorkloadGrid(workload) {
  const container = document.getElementById('workloadGrid');
  if (!container) return;
  
  const entries = Object.entries(workload);
  const maxTasks = Math.max(...entries.map(([_, data]) => data.tasks), 8);
  
  container.innerHTML = entries.map(([name, data]) => {
    const pct = (data.tasks / maxTasks) * 100;
    const cls = pct > 80 ? 'overload' : pct > 60 ? 'high' : '';
    return `
      <div class="workload-card">
        <div class="workload-header"><span class="workload-name">${name}</span><span class="workload-role">${data.role}</span></div>
        <div class="workload-bar"><div class="workload-fill ${cls}" style="width: ${pct}%"></div></div>
        <div class="workload-count">${data.tasks} sessions</div>
      </div>
    `;
  }).join('');
}

function openApprovalModal(id) {
  state.selectedApprovalId = id;
  const submission = state.supervisorData?.pendingAvailability?.find(a => a.id === id);
  if (!submission) return;
  
  const travelDist = submission.preferences?.travelPreference === 'minimal' ? 20 : submission.preferences?.travelPreference === 'moderate' ? 35 : 50;
  document.getElementById('ruleMaxTravel').value = travelDist;
  document.getElementById('rulePriority').value = 'true';
  document.getElementById('ruleOvertime').value = submission.preferences?.travelPreference === 'flexible' ? 'true' : 'false';
  
  const detailsContainer = document.getElementById('approvalDetails');
  if (detailsContainer) {
    detailsContainer.innerHTML = `
      <div class="availability-card">
        <div class="availability-header">
          <div class="staff-info">
            <div class="staff-avatar">${getInitials(submission.staffName)}</div>
            <div class="staff-details"><h4>${submission.staffName}</h4><span class="role">${submission.staffRole}</span></div>
          </div>
        </div>
        <div class="availability-meta">
          <div class="meta-item"><span class="meta-label">Days</span><div class="days-list">${(submission.days || []).map(d => `<span class="day-badge">${d.slice(0,3)}</span>`).join('')}</div></div>
          <div class="meta-item"><span class="meta-label">Hours</span><span class="meta-value">${submission.startTime} - ${submission.endTime}</span></div>
          <div class="meta-item"><span class="meta-label">Coverage</span><div class="coverage-list">${(submission.coverageAreas || []).map(c => `<span class="coverage-badge">${c}</span>`).join('')}</div></div>
        </div>
        <div class="preferences-section">
          <div class="preferences-title">Preferences</div>
          <div class="preference-tags"><span class="preference-tag">Travel: ${submission.preferences?.travelPreference}</span><span class="preference-tag">Shift: ${submission.preferences?.shiftPreference}</span></div>
          ${submission.preferences?.notes ? `<div class="preference-notes">"${submission.preferences.notes}"</div>` : ''}
        </div>
      </div>
    `;
  }
  
  const modal = document.getElementById('approvalModal');
  if (modal) modal.classList.remove('hidden');
}

function closeApprovalModal() {
  const modal = document.getElementById('approvalModal');
  if (modal) modal.classList.add('hidden');
  state.selectedApprovalId = null;
}

async function approveAvailability() {
  if (!state.selectedApprovalId) return;
  const rules = {
    maxTravelDistance: parseInt(document.getElementById('ruleMaxTravel').value),
    priorityPatients: document.getElementById('rulePriority').value === 'true',
    overtimeAllowed: document.getElementById('ruleOvertime').value === 'true'
  };
  const notes = document.getElementById('supervisorNotes').value;
  
  showLoading();
  try {
    const data = await fetchAPI(`/supervisor/availability/${state.selectedApprovalId}/approve`, {
      method: 'PUT', body: JSON.stringify({ supervisorNotes: notes, individualRules: rules })
    });
    hideLoading(); closeApprovalModal();
    if (data.success) { showToast('Success', 'Availability approved', 'success'); loadSupervisorDashboard(); }
  } catch (error) { hideLoading(); showToast('Error', 'Failed to approve', 'error'); }
}

async function rejectAvailability(id) {
  const reason = prompt('Please provide a reason for rejection:');
  if (!reason) return;
  showLoading();
  try {
    const data = await fetchAPI(`/supervisor/availability/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) });
    hideLoading();
    if (data.success) { showToast('Rejected', 'Availability rejected', 'warning'); loadSupervisorDashboard(); }
  } catch (error) { hideLoading(); showToast('Error', 'Failed to reject', 'error'); }
}

function initSupervisorActions() {
  const closeBtn = document.getElementById('closeApprovalModal');
  const approveBtn = document.getElementById('approveBtn');
  const modifyBtn = document.getElementById('modifyBtn');
  const rejectBtn = document.getElementById('rejectBtn');
  
  if (closeBtn) closeBtn.addEventListener('click', closeApprovalModal);
  if (approveBtn) approveBtn.addEventListener('click', approveAvailability);
  if (modifyBtn) modifyBtn.addEventListener('click', approveAvailability);
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      if (state.selectedApprovalId) { closeApprovalModal(); rejectAvailability(state.selectedApprovalId); }
    });
  }
}

// ============================================
// PROFESSIONAL DASHBOARD
// ============================================

async function loadProfessionalDashboard() {
  try {
    if (state.staff.length === 0) {
      const staffData = await fetchAPI('/staff');
      state.staff = staffData.staff || [];
    }
    
    populateStaffSelector();
    await loadProfessionalData();
    initializeProfessionalDashboardWithMaps();
    
  } catch (error) { 
    console.error('Error loading professional dashboard:', error); 
    showToast('Error', 'Failed to load professional dashboard', 'error');
  }
}

function populateStaffSelector() {
  const select = document.getElementById('staffSelect');
  if (select) {
    select.innerHTML = state.staff.map(s => 
      `<option value="${s.id}" ${s.id === state.currentStaffId ? 'selected' : ''}>${s.name} (${s.role})</option>`
    ).join('');
  }
}

async function loadProfessionalData() {
  try {
    showLoading();
    
    const data = await fetchAPI(`/professional/${state.currentStaffId}`);
    state.professionalData = data;
    
    renderProfessionalInfo(data.staff || {});
    
    const periodElement = document.getElementById('professionalSchedulePeriod');
    if (periodElement && data.schedulePeriod) {
      periodElement.textContent = `${formatDate(data.schedulePeriod.startDate)} - ${formatDate(data.schedulePeriod.endDate)}`;
    }
    
    // Render sessions
    await renderProfessionalSessionsWithMaps(data.schedule || []);
    
    hideLoading();
  } catch (error) { 
    hideLoading();
    console.error('Error loading professional data:', error); 
    showToast('Error', 'Failed to load professional data', 'error');
  }
}

function renderProfessionalInfo(staff) {
  const container = document.getElementById('professionalInfo');
  if (!container) return;
  
  container.innerHTML = `
    <div class="info-avatar">
      <img src="${staff.photo || 'staff/default-avatar.jpg'}" 
           alt="${staff.name}"
           class="staff-avatar-img"
           onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=3498db&color=fff&size=150'">
    </div>
    <div class="info-content">
      <h2>${staff.name || 'Staff Member'}</h2>
      <div class="role">${staff.role || 'Professional'}</div>
      <div class="info-tags">
        ${(staff.expertise || []).map(e => `<span class="info-tag">${e}</span>`).join('')}
        ${(staff.coverage || []).map(c => `<span class="info-tag">📍 ${c}</span>`).join('')}
      </div>
      ${staff.rating ? `<div class="staff-rating">⭐ ${staff.rating}/5.0</div>` : ''}
      ${staff.experience ? `<div class="staff-experience">${staff.experience} experience</div>` : ''}
    </div>
  `;
}

async function renderProfessionalSessionsWithMaps(sessions) {
  const container = document.getElementById('professionalSessionsList');
  if (!container) return;
  
  if (sessions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <h3>No upcoming sessions</h3>
        <p>No sessions scheduled for this staff member</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  
  sessions.forEach(session => {
    const patient = mockPatients.find(p => 
      p.id === session.patientId || p.name === session.patientName
    );
    
    if (patient) {
      const sessionCard = createProfessionalSessionCard({
        ...session,
        patientId: patient.id
      });
      container.innerHTML += sessionCard;
    } else {
      // Fallback session card without map
      const d = getDayInfo(session.date);
      const isTodayFlag = isToday(session.date);
      
      container.innerHTML += `
        <div class="session-card ${isTodayFlag ? 'today' : ''} ${session.priority === 'Urgent' ? 'urgent' : ''}">
          <div class="session-date">
            <div class="day">${d.day}</div>
            <div class="month">${d.month}</div>
            <div class="weekday">${d.weekday}</div>
          </div>
          <div class="session-info">
            <h4>${session.patientName}</h4>
            <div class="time">${session.time}</div>
            <div class="details">
              <span>Care: ${session.careType}</span> • 
              <span>Location: ${session.location}</span>
            </div>
            <div class="patient-address" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${session.address || 'Address not available'}
            </div>
          </div>
          <div class="session-actions">
            <span class="swap-status ${session.canSwap ? 'can-swap' : 'cannot-swap'}">
              ${session.canSwap ? '🔄 Can Swap' : '⏸️ Fixed'}
            </span>
            ${session.canSwap ? 
              `<button class="btn btn-sm btn-primary" onclick="openSwapModal(${session.id})">Swap</button>` : 
              ''
            }
          </div>
        </div>
      `;
    }
  });
}

function initializeProfessionalDashboardWithMaps() {
  addLocationTestSection();
}

function addLocationTestSection() {
  const professionalDashboard = document.getElementById('professional-dashboard');
  if (!professionalDashboard) return;
  
  if (document.querySelector('.location-test-section')) return;
  
  const testSection = document.createElement('div');
  testSection.className = 'section-card location-test-section';
  testSection.innerHTML = `
    <div class="section-header">
      <h2>📍 Patient Locations Quick Access</h2>
    </div>
    <div class="quick-location-buttons" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
      ${mockPatients.map(patient => `
        <button class="btn btn-sm btn-secondary location-quick-btn" 
                data-patient-id="${patient.id}"
                title="${patient.address}, ${patient.location}">
          <span class="btn-icon">📍</span>
          ${patient.name}
        </button>
      `).join('')}
    </div>
    <div style="font-size: 0.85rem; color: var(--text-secondary); padding: 0.5rem; background: rgba(0, 115, 230, 0.05); border-radius: var(--radius-md);">
      <strong>Tip:</strong> Click any patient button above to open their location in Google Maps.
    </div>
  `;
  
  const quickActions = professionalDashboard.querySelector('.quick-actions');
  if (quickActions) {
    quickActions.insertAdjacentHTML('afterend', testSection.outerHTML);
  } else {
    const professionalInfo = professionalDashboard.querySelector('.professional-info-card');
    if (professionalInfo) {
      professionalInfo.insertAdjacentHTML('afterend', testSection.outerHTML);
    }
  }
  
  setTimeout(() => {
    document.querySelectorAll('.location-quick-btn').forEach(button => {
      button.addEventListener('click', function() {
        const patientId = parseInt(this.getAttribute('data-patient-id'));
        const patient = mockPatients.find(p => p.id === patientId);
        if (patient) {
          openLocationInMaps(patient.latitude, patient.longitude, `${patient.address}, ${patient.location}`);
        }
      });
    });
  }, 100);
}

function initProfessionalActions() {
  const staffSelect = document.getElementById('staffSelect');
  
  if (staffSelect) {
    staffSelect.addEventListener('change', async (e) => {
      const newStaffId = parseInt(e.target.value);
      
      if (!newStaffId) {
        document.getElementById('professionalInfo').innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">👨‍⚕️</div>
            <h3>Select a Staff Member</h3>
            <p>Choose a staff member from the dropdown to view their dashboard</p>
          </div>
        `;
        document.getElementById('professionalSessionsList').innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📅</div>
            <h3>No staff selected</h3>
            <p>Select a staff member to view their schedule</p>
          </div>
        `;
        return;
      }
      
      showLoading();
      state.currentStaffId = newStaffId;
      
      try {
        await loadProfessionalData();
        showToast('Success', `Loaded data for selected staff member`, 'success');
      } catch (error) {
        console.error('Error changing staff:', error);
        showToast('Error', 'Failed to load staff data', 'error');
      } finally {
        hideLoading();
      }
    });
  }
  
  const submitBtn = document.getElementById('submitAvailabilityBtn');
  const closeModalBtn = document.getElementById('closeAvailabilityModal');
  const cancelBtn = document.getElementById('cancelAvailability');
  const viewBtn = document.getElementById('viewMyAvailabilityBtn');
  const closeSubmissionsBtn = document.getElementById('closeMySubmissionsModal');
  const closeSwapBtn = document.getElementById('closeSwapModal');
  const cancelSwapBtn = document.getElementById('cancelSwap');
  const confirmSwapBtn = document.getElementById('confirmSwap');
  const availabilityForm = document.getElementById('availabilityForm');
  
  if (submitBtn) submitBtn.addEventListener('click', () => {
    const modal = document.getElementById('availabilityModal');
    if (modal) modal.classList.remove('hidden');
  });
  
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
    const modal = document.getElementById('availabilityModal');
    if (modal) modal.classList.add('hidden');
  });
  
  if (cancelBtn) cancelBtn.addEventListener('click', () => {
    const modal = document.getElementById('availabilityModal');
    if (modal) modal.classList.add('hidden');
  });
  
  if (availabilityForm) availabilityForm.addEventListener('submit', submitAvailability);
  
  if (viewBtn) viewBtn.addEventListener('click', loadMySubmissions);
  
  if (closeSubmissionsBtn) closeSubmissionsBtn.addEventListener('click', () => {
    const modal = document.getElementById('mySubmissionsModal');
    if (modal) modal.classList.add('hidden');
  });
  
  if (closeSwapBtn) closeSwapBtn.addEventListener('click', closeSwapModal);
  if (cancelSwapBtn) cancelSwapBtn.addEventListener('click', closeSwapModal);
  if (confirmSwapBtn) confirmSwapBtn.addEventListener('click', executeSwap);
}

async function submitAvailability(e) {
  e.preventDefault();
  const form = e.target;
  const staff = state.staff.find(s => s.id === state.currentStaffId);
  const days = Array.from(form.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value);
  const coverage = Array.from(form.querySelectorAll('input[name="coverage"]:checked')).map(cb => cb.value);
  
  if (days.length === 0) { showToast('Error', 'Select at least one day', 'warning'); return; }
  if (coverage.length === 0) { showToast('Error', 'Select at least one area', 'warning'); return; }
  
  showLoading();
  try {
    const data = await fetchAPI('/professional/availability/submit', {
      method: 'POST',
      body: JSON.stringify({
        staffId: state.currentStaffId, staffName: staff.name, staffRole: staff.role,
        days, startTime: form.startTime.value, endTime: form.endTime.value,
        maxHours: parseInt(form.maxHours.value), coverageAreas: coverage,
        preferences: { travelPreference: form.travelPreference.value, shiftPreference: form.shiftPreference.value, notes: form.preferenceNotes.value }
      })
    });
    hideLoading();
    const modal = document.getElementById('availabilityModal');
    if (modal) modal.classList.add('hidden');
    form.reset();
    if (data.success) showToast('Success', 'Availability submitted for review', 'success');
  } catch (error) { hideLoading(); showToast('Error', 'Failed to submit', 'error'); }
}

async function loadMySubmissions() {
  try {
    const data = await fetchAPI(`/professional/${state.currentStaffId}/availability`);
    const container = document.getElementById('mySubmissionsList');
    if (!container) return;
    
    if (!data.submissions || data.submissions.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No submissions yet</h3></div>`;
    } else {
      container.innerHTML = data.submissions.map(s => `
        <div class="submission-item">
          <div class="submission-header">
            <span class="status-badge status-${s.status}">${s.status}</span>
            <span class="submission-date">${formatDateTime(s.submittedAt)}</span>
          </div>
          <div class="availability-meta">
            <div class="meta-item"><span class="meta-label">Days</span><div class="days-list">${(s.days || []).map(d => `<span class="day-badge">${d.slice(0,3)}</span>`).join('')}</div></div>
            <div class="meta-item"><span class="meta-label">Hours</span><span class="meta-value">${s.startTime} - ${s.endTime}</span></div>
          </div>
          ${s.supervisorNotes ? `<div class="preference-notes"><strong>Supervisor:</strong> ${s.supervisorNotes}</div>` : ''}
        </div>
      `).join('');
    }
    const modal = document.getElementById('mySubmissionsModal');
    if (modal) modal.classList.remove('hidden');
  } catch (error) { showToast('Error', 'Failed to load submissions', 'error'); }
}

// ============================================
// SWAP FUNCTIONALITY
// ============================================

async function openSwapModal(sessionId) {
  try {
    const data = await fetchAPI(`/professional/swap/eligible/${sessionId}`);
    if (!data.canSwap) { showToast('Cannot Swap', data.reason, 'warning'); return; }
    
    state.selectedSwapSession = data.session;
    state.selectedSwapStaff = null;
    
    const sessionInfo = document.getElementById('swapSessionInfo');
    if (sessionInfo) {
      sessionInfo.innerHTML = `
        <h3>Session Details</h3>
        <p><strong>Patient:</strong> ${data.session.patientName}</p>
        <p><strong>Date:</strong> ${formatDate(data.session.date)} at ${data.session.time}</p>
        <p><strong>Location:</strong> ${data.session.address}, ${data.session.location}</p>
      `;
    }
    
    const staffList = document.getElementById('eligibleStaffList');
    if (staffList) {
      if (!data.eligibleStaff || data.eligibleStaff.length === 0) {
        staffList.innerHTML = `<div class="empty-state"><h3>No eligible staff</h3></div>`;
        const confirmBtn = document.getElementById('confirmSwap');
        if (confirmBtn) confirmBtn.disabled = true;
      } else {
        staffList.innerHTML = `<h4>Select colleague:</h4>${data.eligibleStaff.map(s => `
          <div class="eligible-staff-item" data-staff-id="${s.id}">
            <input type="radio" name="swapStaff" value="${s.id}">
            <div class="staff-avatar">${getInitials(s.name)}</div>
            <div class="staff-details"><h4>${s.name}</h4><span class="role">${s.role} | ${s.expertise?.join(', ')}</span></div>
          </div>
        `).join('')}`;
        
        staffList.querySelectorAll('.eligible-staff-item').forEach(item => {
          item.addEventListener('click', () => {
            staffList.querySelectorAll('.eligible-staff-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            item.querySelector('input').checked = true;
            state.selectedSwapStaff = parseInt(item.dataset.staffId);
            const confirmBtn = document.getElementById('confirmSwap');
            if (confirmBtn) confirmBtn.disabled = false;
          });
        });
      }
    }
    
    const reasonInput = document.getElementById('swapReason');
    if (reasonInput) reasonInput.value = '';
    
    const modal = document.getElementById('swapModal');
    if (modal) modal.classList.remove('hidden');
  } catch (error) { showToast('Error', 'Failed to load swap options', 'error'); }
}

function closeSwapModal() {
  const modal = document.getElementById('swapModal');
  if (modal) modal.classList.add('hidden');
  state.selectedSwapSession = null;
  state.selectedSwapStaff = null;
}

async function executeSwap() {
  if (!state.selectedSwapSession || !state.selectedSwapStaff) { 
    showToast('Error', 'Select a colleague', 'warning'); 
    return; 
  }
  
  showLoading();
  try {
    const reasonInput = document.getElementById('swapReason');
    const reason = reasonInput ? reasonInput.value || 'No reason' : 'No reason';
    
    const data = await fetchAPI('/professional/swap/execute', {
      method: 'POST',
      body: JSON.stringify({ 
        sessionId: state.selectedSwapSession.id, 
        newStaffId: state.selectedSwapStaff, 
        reason: reason 
      })
    });
    
    hideLoading(); 
    closeSwapModal();
    
    if (data.success) { 
      showToast('Success', 'Session swapped', 'success'); 
      loadProfessionalData(); 
    }
  } catch (error) { 
    hideLoading(); 
    showToast('Error', 'Failed to swap', 'error'); 
  }
}

// ============================================
// PATIENT DASHBOARD
// ============================================

async function loadPatientDashboard() {
  try {
    if (state.patients.length === 0) {
      const patientsData = await fetchAPI('/patients');
      state.patients = patientsData.patients || [];
    }
    
    populatePatientSelector();
    await loadPatientData();
    
  } catch (error) { 
    console.error('Error loading patient dashboard:', error); 
    showToast('Error', 'Failed to load patient dashboard', 'error');
  }
}

function populatePatientSelector() {
  const select = document.getElementById('patientSelect');
  if (select) {
    select.innerHTML = state.patients.map(p => 
      `<option value="${p.id}" ${p.id === state.currentPatientId ? 'selected' : ''}>${p.name}</option>`
    ).join('');
  }
}

async function loadPatientData() {
  try {
    showLoading();
    
    const data = await fetchAPI(`/patient/${state.currentPatientId}`);
    state.patientData = data;
    
    renderPatientInfo(data.patient || {});
    renderPatientVisits(data.upcomingVisits || []);
    
    hideLoading();
  } catch (error) { 
    hideLoading();
    console.error('Error loading patient data:', error); 
    showToast('Error', 'Failed to load patient data', 'error');
  }
}

function renderPatientInfo(patient) {
  const container = document.getElementById('patientInfo');
  if (!container) return;
  
  container.innerHTML = `
    <div class="patient-avatar">
      <img src="${patient.photo || 'patients/default-patient.jpg'}" 
           alt="${patient.name}"
           class="patient-avatar-img"
           onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=e74c3c&color=fff&size=150'">
    </div>
    <div class="patient-content">
      <h2>${patient.name || 'Patient'}</h2>
      <div class="patient-details">
        ${patient.age ? `<div class="patient-age">👤 ${patient.age} years</div>` : ''}
        ${patient.gender ? `<div class="patient-gender">${patient.gender === 'Female' ? '👩' : '👨'}</div>` : ''}
        <div class="patient-priority ${patient.priority?.toLowerCase() || 'normal'}">
          ${patient.priority || 'Normal'} Priority
        </div>
      </div>
      <div class="patient-location">📍 ${patient.address || patient.location || 'Location not specified'}</div>
      
      <div class="info-tags">
        ${(patient.careNeeds || []).map(need => `<span class="info-tag medical-tag">${need}</span>`).join('')}
      </div>
      
      ${patient.notes ? `<div class="patient-notes">📝 ${patient.notes}</div>` : ''}
      ${patient.contactPerson ? `<div class="patient-contact">📞 ${patient.contactPerson}</div>` : ''}
    </div>
  `;
}

function renderPatientVisits(visits) {
  const container = document.getElementById('patientVisitsList');
  if (!container) return;
  
  if (visits.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📅</div><h3>No upcoming visits</h3></div>`;
    return;
  }
  
  container.innerHTML = visits.map((v, i) => {
    const d = getDayInfo(v.date);
    return `
      <div class="visit-card ${i === 0 ? 'next-visit' : ''}">
        <div class="visit-date"><div class="day">${d.day}</div><div class="month">${d.month}</div></div>
        <div class="visit-info">
          <h4>${v.careType || 'Care'}${i === 0 ? ' - Next Visit' : ''}</h4>
          <div class="time">🕐 ${v.time} (${v.duration})</div>
          <div class="caregiver">👨‍⚕️ ${v.staffName}</div>
        </div>
      </div>
    `;
  }).join('');
}

function initPatientActions() {
  const patientSelect = document.getElementById('patientSelect');
  
  if (patientSelect) {
    patientSelect.addEventListener('change', async (e) => {
      const selectedId = parseInt(e.target.value);
      
      if (!selectedId) {
        const patientInfo = document.getElementById('patientInfo');
        const visitsList = document.getElementById('patientVisitsList');
        
        if (patientInfo) {
          patientInfo.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon">🏠</div>
              <h3>Select a Patient</h3>
              <p>Choose a patient from the dropdown to view their dashboard</p>
            </div>
          `;
        }
        
        if (visitsList) {
          visitsList.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon">📅</div>
              <h3>No patient selected</h3>
              <p>Select a patient to view their visits</p>
            </div>
          `;
        }
        return;
      }
      
      state.currentPatientId = selectedId;
      showLoading();
      
      try {
        await loadPatientData();
        showToast('Success', `Loaded data for selected patient`, 'success');
      } catch (error) {
        console.error('Error changing patient:', error);
        showToast('Error', 'Failed to load patient data', 'error');
      } finally {
        hideLoading();
      }
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Make map functions globally available
  window.openLocationInMaps = openLocationInMaps;
  window.getDirectionsToPatient = getDirectionsToPatient;
  window.openSwapModal = openSwapModal;
  
  initNavigation();
  initNotifications();
  initCoordinatorActions();
  initSupervisorActions();
  initProfessionalActions();
  initPatientActions();
  
  // Load initial dashboard
  loadCoordinatorDashboard();
  
  console.log('🏥 Hospital Scheduler v2.0 initialized');
});
