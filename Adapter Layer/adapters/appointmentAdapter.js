import fetch from 'node-fetch';

const LEGACY_URL = process.env.LEGACY_SYSTEM_URL;

export const sendToLegacySystem = async (modernData) => {
    
    const legacyPayload = {
        patientId: modernData.patientId,        
        doctorName: modernData.doctor,           
        department: modernData.dept,            
        appointmentDate: modernData.date,       
        appointmentStatus: modernData.status || "Scheduled"
    };

    console.log("Translating to Legacy Payload:", legacyPayload);

    
    const response = await fetch(`${LEGACY_URL}/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(legacyPayload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Legacy System failed to save the appointment.");
    }

    const legacyData = await response.json();
    return { 
        legacyAppointmentId: legacyData._id, 
        status: "Saved in Legacy DB" 
    };
};

export const fetchFromLegacySystem = async (patientId) => {
    if (!LEGACY_URL) {
        // Fallback: return mock appointment list for development
        console.log('LEGACY_SYSTEM_URL not configured — returning mock appointments');
        return [
            {
                id: 'mock-1',
                patientId,
                doctor: 'Dr. Dev',
                dept: 'General',
                date: new Date().toISOString(),
                status: 'scheduled'
            }
        ];
    }

    const response = await fetch(`${LEGACY_URL}/appointment/${patientId}`);

    if (!response.ok) {
        throw new Error("Failed to retrieve appointments from Legacy System");
    }

    const rawLegacyList = await response.json();

    return rawLegacyList.map(legacyRecord => ({
        id: legacyRecord._id,
        patientId: legacyRecord.patientId,
        doctor: legacyRecord.doctorName,
        dept: legacyRecord.department,
        date: legacyRecord.appointmentDate,
        status: legacyRecord.appointmentStatus
    }));
};