import { storageService } from './storageService';
import { INDIAN_STATES } from '../data/indianLocations';
import { getSupabase, isSupabaseConfigured } from './supabaseClient';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  gender: string;
  age: number;
  state: string;
  city: string;
  pincode: string;
  phone: string;
  email: string;
  availability: 'Available' | 'Temporarily Unavailable' | 'Not Currently Donating';
  phoneVisibility: 'visible' | 'request_only' | 'hidden';
  preferredContact: string;
  totalDonations: number;
  lastDonationDate?: string;
  registeredDate: string;
  verified: boolean;
  coordinates: Coordinates;
  bio?: string;
  distanceKm?: number;
}

export interface DonorSearchParams {
  bloodGroup?: string;
  state?: string;
  city?: string;
  pincode?: string;
  radiusKm?: number;
  availability?: string;
  sortBy?: 'distance' | 'name' | 'donations';
  centerCoords?: Coordinates;
}

// Haversine formula to compute distance in km
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Find approximate coords for a city/state
export function resolveLocationCoords(cityName?: string, stateName?: string): Coordinates | null {
  if (!cityName && !stateName) return null;

  for (const st of INDIAN_STATES) {
    if (stateName && st.name.toLowerCase() === stateName.toLowerCase()) {
      if (cityName) {
        const c = st.cities.find((city) => city.name.toLowerCase().includes(cityName.toLowerCase()));
        if (c) return { lat: c.lat, lng: c.lng };
      }
      if (st.cities.length > 0) {
        return { lat: st.cities[0].lat, lng: st.cities[0].lng };
      }
    }
  }

  // Fallback search across all cities
  if (cityName) {
    for (const st of INDIAN_STATES) {
      const c = st.cities.find((city) => city.name.toLowerCase().includes(cityName.toLowerCase()));
      if (c) return { lat: c.lat, lng: c.lng };
    }
  }

  return null;
}

function mapSupabaseRowToDonor(row: any): Donor {
  return {
    id: row.id,
    name: row.name,
    bloodGroup: row.blood_group,
    gender: row.gender,
    age: Number(row.age) || 30,
    state: row.state,
    city: row.city,
    pincode: row.pincode,
    phone: row.phone,
    email: row.email || '',
    availability: row.availability || 'Available',
    phoneVisibility: row.phone_visibility || 'request_only',
    preferredContact: row.preferred_contact || 'Phone & WhatsApp',
    totalDonations: Number(row.total_donations) || 0,
    lastDonationDate: row.last_donation_date,
    registeredDate: row.registered_date || new Date().toISOString().split('T')[0],
    verified: row.verified ?? true,
    coordinates: {
      lat: Number(row.latitude) || 20.5937,
      lng: Number(row.longitude) || 78.9629
    },
    bio: row.bio
  };
}

export const donorService = {
  // Sync with Supabase if configured
  async syncWithSupabase(): Promise<Donor[]> {
    const client = getSupabase();
    if (!client) {
      return this.getAllDonors();
    }

    try {
      const { data, error } = await client.from('donors').select('*');
      if (error) {
        console.warn('Supabase fetch donors error:', error.message);
        return this.getAllDonors();
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapSupabaseRowToDonor);
        storageService.saveDonors(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Failed to sync donors from Supabase:', e);
    }

    return this.getAllDonors();
  },

  getAllDonors(): Donor[] {
    return storageService.getDonors();
  },

  getDonorById(id: string): Donor | undefined {
    const donors = storageService.getDonors();
    return donors.find((d: Donor) => d.id === id);
  },

  searchDonors(params: DonorSearchParams): Donor[] {
    let list: Donor[] = storageService.getDonors();

    // 1. Blood Group Filter
    if (params.bloodGroup && params.bloodGroup !== 'ALL') {
      list = list.filter((d) => d.bloodGroup.toUpperCase() === params.bloodGroup?.toUpperCase());
    }

    // 2. State Filter
    if (params.state && params.state !== 'ALL') {
      list = list.filter((d) => d.state.toLowerCase() === params.state?.toLowerCase());
    }

    // 3. City Filter
    if (params.city && params.city.trim() !== '') {
      const cQuery = params.city.trim().toLowerCase();
      list = list.filter((d) => d.city.toLowerCase().includes(cQuery));
    }

    // 4. PIN Code Filter
    if (params.pincode && params.pincode.trim() !== '') {
      const pinQuery = params.pincode.trim();
      list = list.filter((d) => d.pincode.startsWith(pinQuery));
    }

    // 5. Availability Filter
    if (params.availability && params.availability !== 'ALL') {
      list = list.filter((d) => d.availability === params.availability);
    }

    // 6. Coordinates & Radius calculation
    const searchCenter = params.centerCoords || resolveLocationCoords(params.city, params.state);

    if (searchCenter) {
      list = list.map((donor) => {
        const dist = donor.coordinates
          ? calculateDistanceKm(searchCenter, donor.coordinates)
          : undefined;
        return { ...donor, distanceKm: dist };
      });

      // Filter by radius if specified
      if (params.radiusKm && params.radiusKm > 0) {
        list = list.filter(
          (donor) => donor.distanceKm !== undefined && donor.distanceKm <= (params.radiusKm || 100)
        );
      }
    }

    // 7. Sorting
    if (params.sortBy === 'distance' && searchCenter) {
      list.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    } else if (params.sortBy === 'donations') {
      list.sort((a, b) => b.totalDonations - a.totalDonations);
    } else if (params.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  },

  registerDonor(donorData: Omit<Donor, 'id' | 'registeredDate' | 'totalDonations' | 'verified' | 'coordinates'> & { coordinates?: Coordinates }): Donor {
    const donors = storageService.getDonors();
    const newId = `donor-${Date.now()}`;
    
    // Resolve coordinates if not provided
    const coords = donorData.coordinates?.lat
      ? donorData.coordinates
      : resolveLocationCoords(donorData.city, donorData.state) || { lat: 20.5937, lng: 78.9629 };

    const newDonor: Donor = {
      ...donorData,
      id: newId,
      coordinates: coords,
      registeredDate: new Date().toISOString().split('T')[0],
      totalDonations: 0,
      verified: true
    };

    donors.unshift(newDonor);
    storageService.saveDonors(donors);

    // Asynchronously insert into Supabase if configured
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client.from('donors').insert([{
          id: newDonor.id,
          name: newDonor.name,
          blood_group: newDonor.bloodGroup,
          gender: newDonor.gender,
          age: newDonor.age,
          state: newDonor.state,
          city: newDonor.city,
          pincode: newDonor.pincode,
          phone: newDonor.phone,
          email: newDonor.email,
          availability: newDonor.availability,
          phone_visibility: newDonor.phoneVisibility,
          preferred_contact: newDonor.preferredContact,
          total_donations: newDonor.totalDonations,
          registered_date: newDonor.registeredDate,
          verified: newDonor.verified,
          latitude: newDonor.coordinates.lat,
          longitude: newDonor.coordinates.lng,
          bio: newDonor.bio
        }]).then(({ error }) => {
          if (error) {
            console.error('Supabase donor insertion error:', error.message);
          }
        });
      }
    }

    return newDonor;
  },

  updateDonorAvailability(donorId: string, availability: Donor['availability']): boolean {
    const donors = storageService.getDonors();
    const index = donors.findIndex((d: Donor) => d.id === donorId);
    if (index === -1) return false;

    donors[index].availability = availability;
    storageService.saveDonors(donors);

    // Asynchronously update Supabase if configured
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client.from('donors')
          .update({ availability })
          .eq('id', donorId)
          .then(({ error }) => {
            if (error) console.error('Supabase availability update error:', error.message);
          });
      }
    }

    return true;
  },

  reportDonor(donorId: string, donorName: string, reason: string): void {
    const reports: any[] = storageService.getReports() || [];
    const newReport = {
      id: `rep-${Date.now()}`,
      reportedItemType: 'donor',
      reportedItemId: donorId,
      reportedItemName: donorName,
      reason,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    reports.push(newReport);
    storageService.saveReports(reports);

    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client.from('reports').insert([{
          id: newReport.id,
          reported_item_type: newReport.reportedItemType,
          reported_item_id: newReport.reportedItemId,
          reported_item_name: newReport.reportedItemName,
          reason: newReport.reason,
          status: newReport.status
        }]).then(({ error }) => {
          if (error) console.warn('Supabase report insert error:', error.message);
        });
      }
    }
  }
};
