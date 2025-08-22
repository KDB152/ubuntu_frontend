'use client';

import React, { useMemo, useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  X,
  Send,
} from 'lucide-react';

type MeetingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface MeetingItem {
  id: string;
  title: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  participants: { id: string; name: string; role: 'parent' | 'teacher' | 'admin'; }[];
  status: MeetingStatus;
  notes?: string;
}

const DEFAULT_MEETINGS: MeetingItem[] = [
  {
    id: 'mtg-1',
    title: 'Réunion parents-professeurs (Lucas)',
    date: '2024-12-27',
    startTime: '17:00',
    endTime: '18:00',
    location: 'Collège Jean Moulin - Salle 205',
    participants: [
      { id: 'parent-1', name: 'Marie Dubois', role: 'parent' },
      { id: 'teacher-1', name: 'Mme Martin', role: 'teacher' },
    ],
    status: 'confirmed',
    notes: 'Point sur la progression du trimestre.'
  },
  {
    id: 'mtg-2',
    title: 'Entretien pédagogique (Emma)',
    date: '2025-01-05',
    startTime: '18:30',
    endTime: '19:00',
    location: 'En ligne (lien communiqué par le professeur)',
    participants: [
      { id: 'parent-1', name: 'Marie Dubois', role: 'parent' },
      { id: 'teacher-2', name: 'M. Leroy', role: 'teacher' },
    ],
    status: 'pending'
  },
];

const statusBadge = (status: MeetingStatus) => {
  const map: Record<MeetingStatus, { text: string; class: string }> = {
    pending: { text: 'En attente', class: 'text-yellow-300 bg-yellow-500/20' },
    confirmed: { text: 'Confirmée', class: 'text-green-300 bg-green-500/20' },
    cancelled: { text: 'Annulée', class: 'text-red-300 bg-red-500/20' },
    completed: { text: 'Terminée', class: 'text-blue-300 bg-blue-500/20' },
  };
  return <span className={`inline-block text-xs px-2 py-1 rounded ${map[status].class}`}>{map[status].text}</span>;
};

const MeetingsTab: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingItem[]>(DEFAULT_MEETINGS);
  const [filters, setFilters] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<MeetingItem>({
    id: `mtg-${Math.random().toString(36).slice(2,8)}`,
    title: '',
    date: new Date().toISOString().slice(0,10),
    startTime: '17:00',
    endTime: '17:30',
    location: '',
    participants: [
      { id: 'parent-1', name: 'Vous', role: 'parent' },
    ],
    status: 'pending',
    notes: ''
  });

  const filtered = useMemo(() => {
    const now = new Date();
    return meetings.filter(m => {
      const start = new Date(`${m.date}T${m.startTime}:00`);
      if (filters === 'all') return true;
      if (filters === 'upcoming') return start.getTime() >= now.getTime();
      return start.getTime() < now.getTime();
    });
  }, [meetings, filters]);

  const save = () => {
    setMeetings(prev => [draft, ...prev]);
    setShowCreate(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Rendez-vous</h1>
            <p className="text-blue-200">Planifiez et suivez vos réunions avec les professeurs</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={filters} onChange={e => setFilters(e.target.value as any)}>
              <option value="upcoming">À venir</option>
              <option value="past">Passés</option>
              <option value="all">Tous</option>
            </select>
            <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(m => (
          <div key={m.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{m.title}</h3>
                  <div className="text-blue-200 text-sm flex flex-wrap gap-3 mt-1">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(m.date).toLocaleDateString('fr-FR')}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {m.startTime} – {m.endTime}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {m.location}</span>
                  </div>
                </div>
              </div>
              <div>{statusBadge(m.status)}</div>
            </div>
            <div className="mt-3 text-blue-200 text-sm">{m.notes}</div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {m.participants.map(p => (
                <span key={p.id} className="text-xs text-blue-300 bg-white/10 px-2 py-1 rounded">{p.name} ({p.role})</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Nouveau rendez-vous</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-200 text-sm mb-2">Titre</label>
                <input className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-2">Date</label>
                <input type="date" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-2">Début</label>
                <input type="time" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={draft.startTime} onChange={e => setDraft(d => ({ ...d, startTime: e.target.value }))} />
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-2">Fin</label>
                <input type="time" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={draft.endTime} onChange={e => setDraft(d => ({ ...d, endTime: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-blue-200 text-sm mb-2">Lieu</label>
                <input className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={draft.location} onChange={e => setDraft(d => ({ ...d, location: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-blue-200 text-sm mb-2">Notes</label>
                <textarea rows={4} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">Annuler</button>
              <button onClick={save} disabled={!draft.title || !draft.location} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white disabled:opacity-60">
                <Send className="w-4 h-4" /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsTab;


