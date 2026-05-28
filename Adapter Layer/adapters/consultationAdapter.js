import fetch from 'node-fetch';

const LEGACY_URL = process.env.LEGACY_SYSTEM_URL;

export const sendToLegacySystem = async (modernData) => {

    const legacyPayload = {
        patientId: modernData.patientId,
        appointmentId: modernData.appointmentId,
        diagnosis: modernData.clinicalFinding,      
        prescription: modernData.rx,               
        notes: modernData.doctorNotes || "N/A"    
    };

    console.log("Normalizing Data to Legacy Consultation Payload:", legacyPayload);

    const response = await fetch(`${LEGACY_URL}/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(legacyPayload)
    });

    if (!response.ok) {
        const legacyErr = await response.json();
        throw new Error(legacyErr.error || "The Legacy Core Subsystem failed to store the clinical document.");
    }

    const legacyData = await response.json();
    return {
        legacyConsultationId: legacyData._id,
        status: "Clinical Record successfully committed"
    };
};

export const fetchFromLegacySystem = async (patientId) => {
    const response = await fetch(`${LEGACY_URL}/consultation/${patientId}`);
    
    if (!response.ok) throw new Error("Failed to pull records from the central legacy document vault.");
    
    const rawLegacyList = await response.json();

    return rawLegacyList.map(legacyRecord => ({
        consultationId: legacyRecord._id,
        patientId: legacyRecord.patientId,
        appointmentId: legacyRecord.appointmentId,
        clinicalFinding: legacyRecord.diagnosis,     
        rx: legacyRecord.prescription,               
        doctorNotes: legacyRecord.notes,             
        createdAt: legacyRecord.createdAt
    }));
};