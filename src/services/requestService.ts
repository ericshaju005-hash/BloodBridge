import { storageService } from './storageService';
import { notificationService } from './notificationService';
import { getSupabase, isSupabaseConfigured } from './supabaseClient';

export interface BloodRequest {
  id: string;
  requesterId: string;
  patientName: string;
  bloodGroup: string;
  units: number;
  urgency: 'Normal' | 'Urgent' | 'Emergency';
  hospitalName: string;
  hospitalAddress: string;
  state: string;
  city: string;
  pincode: string;
  requiredDate: string;
  requiredTime?: string;
  contactPerson: string;
  contactNumber: string;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Completed' | 'Cancelled';
  targetDonorId?: string;
  targetDonorName?: string;
  createdAt: string;
}

function mapSupabaseRowToRequest(row: any): BloodRequest {
  return {
    id: row.id,
    requesterId: row.requester_id || 'demo-requester',
    patientName: row.patient_name,
    bloodGroup: row.blood_group,
    units: row.units_needed || 1,
    urgency: row.urgency || 'Normal',
    hospitalName: row.hospital_name,
    hospitalAddress: row.hospital_address || '',
    state: row.state,
    city: row.city,
    pincode: row.pincode || '',
    requiredDate: row.requirement_date || row.created_at?.split('T')[0],
    contactPerson: row.contact_person,
    contactNumber: row.contact_phone,
    status: row.status || 'Pending',
    createdAt: row.created_at || new Date().toISOString()
  };
}

export const requestService = {
  async syncWithSupabase(): Promise<BloodRequest[]> {
    const client = getSupabase();
    if (!client) {
      return this.getAllBloodRequests();
    }

    try {
      const { data, error } = await client.from('blood_requests').select('*');
      if (error) {
        console.warn('Supabase fetch requests error:', error.message);
        return this.getAllBloodRequests();
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapSupabaseRowToRequest);
        storageService.saveRequests(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Failed to sync requests from Supabase:', e);
    }

    return this.getAllBloodRequests();
  },

  getAllBloodRequests(): BloodRequest[] {
    return (storageService.getRequests() || []) as BloodRequest[];
  },

  getUserRequests(userId: string): BloodRequest[] {
    const requests = (storageService.getRequests() || []) as BloodRequest[];
    return requests.filter((r) => r.requesterId === userId);
  },

  getIncomingRequestsForDonor(donorId: string): BloodRequest[] {
    const requests = (storageService.getRequests() || []) as BloodRequest[];
    return requests.filter((r) => r.targetDonorId === donorId);
  },

  createBloodRequest(data: Omit<BloodRequest, 'id' | 'createdAt' | 'status'> & { status?: BloodRequest['status'] }): BloodRequest {
    const requests = (storageService.getRequests() || []) as BloodRequest[];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `REQ-2026-${randomNum}`;

    const newRequest: BloodRequest = {
      ...data,
      id: newId,
      status: data.status || 'Pending',
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    storageService.saveRequests(requests);

    // Asynchronously insert into Supabase if configured
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client.from('blood_requests').insert([{
          id: newRequest.id,
          patient_name: newRequest.patientName,
          blood_group: newRequest.bloodGroup,
          units_needed: newRequest.units,
          urgency: newRequest.urgency,
          hospital_name: newRequest.hospitalName,
          city: newRequest.city,
          state: newRequest.state,
          contact_person: newRequest.contactPerson,
          contact_phone: newRequest.contactNumber,
          requirement_date: newRequest.requiredDate,
          status: newRequest.status
        }]).then(({ error }) => {
          if (error) console.error('Supabase blood request insert error:', error.message);
        });
      }
    }

    // If targeted at a donor, notify them
    if (data.targetDonorId) {
      notificationService.createNotification({
        userId: data.targetDonorId,
        title: `New ${data.urgency} Request: ${data.bloodGroup}`,
        message: `${data.patientName} urgently needs ${data.units} unit(s) at ${data.hospitalName}, ${data.city}.`,
        type: 'request',
        link: '/dashboard'
      });
    }

    return newRequest;
  },

  updateRequestStatus(requestId: string, status: BloodRequest['status']): boolean {
    const requests = (storageService.getRequests() || []) as BloodRequest[];
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) return false;

    const req = requests[idx];
    req.status = status;
    storageService.saveRequests(requests);

    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client.from('blood_requests')
          .update({ status })
          .eq('id', requestId)
          .then(({ error }) => {
            if (error) console.error('Supabase request update error:', error.message);
          });
      }
    }

    // Notify requester
    if (req.requesterId) {
      notificationService.createNotification({
        userId: req.requesterId,
        title: `Request ${status}: ${req.id}`,
        message: `Your blood request for ${req.patientName} (${req.bloodGroup}) was marked as ${status}.`,
        type: status === 'Accepted' ? 'accepted' : status === 'Declined' ? 'declined' : 'system',
        link: '/dashboard'
      });
    }

    return true;
  },

  cancelBloodRequest(requestId: string): boolean {
    return this.updateRequestStatus(requestId, 'Cancelled');
  },

  deleteRequest(requestId: string): boolean {
    let requests = (storageService.getRequests() || []) as BloodRequest[];
    const lenBefore = requests.length;
    requests = requests.filter((r) => r.id !== requestId);
    if (requests.length !== lenBefore) {
      storageService.saveRequests(requests);

      if (isSupabaseConfigured()) {
        const client = getSupabase();
        if (client) {
          client.from('blood_requests').delete().eq('id', requestId).then(({ error }) => {
            if (error) console.error('Supabase request delete error:', error.message);
          });
        }
      }
      return true;
    }
    return false;
  }
};
