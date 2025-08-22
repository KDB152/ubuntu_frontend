'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  Receipt,
  History,
  Filter,
  Download,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Edit,
  Trash2,
  Calendar,
  User,
  Users,
  Tag,
  Search,
  ChevronDown,
  ChevronUp,
  Wallet,
  Banknote,
  FileText,
  Mail,
  Printer,
} from 'lucide-react';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'refunded';
export type PaymentType = 'tuition' | 'activity_fee' | 'material_fee' | 'lunch_fee' | 'other';

export interface Payment {
  id: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string; // YYYY-MM-DD
  paidDate?: string; // YYYY-MM-DD
  status: PaymentStatus;
  type: PaymentType;
  childId?: string;
  childName?: string;
  invoiceNumber: string;
  receiptUrl?: string;
  notes?: string;
}

const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    description: 'Frais de scolarité - Janvier',
    amount: 500,
    currency: 'EUR',
    dueDate: '2025-01-05',
    paidDate: '2024-12-28',
    status: 'paid',
    type: 'tuition',
    childId: 'child-1',
    childName: 'Lucas Dubois',
    invoiceNumber: 'INV-2025-001',
    receiptUrl: '/receipts/inv-2025-001.pdf',
  },
  {
    id: 'pay-2',
    description: 'Frais d\'activité - Sortie musée',
    amount: 25,
    currency: 'EUR',
    dueDate: '2025-01-15',
    paidDate: undefined,
    status: 'pending',
    type: 'activity_fee',
    childId: 'child-1',
    childName: 'Lucas Dubois',
    invoiceNumber: 'INV-2025-002',
  },
  {
    id: 'pay-3',
    description: 'Frais de cantine - Décembre',
    amount: 80,
    currency: 'EUR',
    dueDate: '2024-12-10',
    paidDate: undefined,
    status: 'overdue',
    type: 'lunch_fee',
    childId: 'child-2',
    childName: 'Emma Dubois',
    invoiceNumber: 'INV-2024-015',
  },
  {
    id: 'pay-4',
    description: 'Frais de matériel - Histoire',
    amount: 15,
    currency: 'EUR',
    dueDate: '2025-01-20',
    paidDate: '2025-01-10',
    status: 'paid',
    type: 'material_fee',
    childId: 'child-2',
    childName: 'Emma Dubois',
    invoiceNumber: 'INV-2025-003',
  },
];

const statusBadge = (status: PaymentStatus) => {
  const map: Record<PaymentStatus, { text: string; class: string; icon: any }> = {
    paid: { text: 'Payé', class: 'text-green-300 bg-green-500/20', icon: CheckCircle },
    pending: { text: 'En attente', class: 'text-yellow-300 bg-yellow-500/20', icon: Info },
    overdue: { text: 'En retard', class: 'text-red-300 bg-red-500/20', icon: AlertCircle },
    refunded: { text: 'Remboursé', class: 'text-blue-300 bg-blue-500/20', icon: History },
  };
  const Icon = map[status].icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${map[status].class}`}>
      <Icon className="w-3.5 h-3.5" /> {map[status].text}
    </span>
  );
};

const PaymentsTab: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(DEFAULT_PAYMENTS);
  const [filters, setFilters] = useState<{ child: 'all' | 'child-1' | 'child-2'; status: 'all' | PaymentStatus; type: 'all' | PaymentType; search: string }>({ child: 'all', status: 'all', type: 'all', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);

  const filteredPayments = useMemo(() => payments.filter(p => {
    const f1 = filters.child === 'all' || p.childId === filters.child;
    const f2 = filters.status === 'all' || p.status === filters.status;
    const f3 = filters.type === 'all' || p.type === filters.type;
    const f4 = p.description.toLowerCase().includes(filters.search.toLowerCase()) ||
               p.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
               (p.childName && p.childName.toLowerCase().includes(filters.search.toLowerCase()));
    return f1 && f2 && f3 && f4;
  }), [payments, filters]);

  const totalPending = useMemo(() => filteredPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0), [filteredPayments]);
  const totalPaid = useMemo(() => filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0), [filteredPayments]);

  const upsertPayment = (p: Payment) => {
    setPayments(prev => {
      const idx = prev.findIndex(x => x.id === p.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = p;
        return clone;
      }
      return [p, ...prev];
    });
    setShowForm(false);
    setEditing(null);
  };

  const deletePayment = (id: string) => setPayments(prev => prev.filter(p => p.id !== id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold">Gestion des Paiements</h2>
            <p className="text-blue-200">Suivez et gérez tous les frais scolaires de vos enfants</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              <Plus className="w-4 h-4" /> Nouveau paiement
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
            <Wallet className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-blue-300 text-sm">Montant en attente</div>
              <div className="text-white text-2xl font-bold">{totalPending.toFixed(2)} {payments[0]?.currency || 'EUR'}</div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
            <Banknote className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-blue-300 text-sm">Montant payé</div>
              <div className="text-white text-2xl font-bold">{totalPaid.toFixed(2)} {payments[0]?.currency || 'EUR'}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input 
            type="text" 
            placeholder="Rechercher par description, facture..." 
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:ring-2 focus:ring-blue-400"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
          <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={filters.child} onChange={e => setFilters(f => ({ ...f, child: e.target.value as any }))}>
            <option value="all">Tous les enfants</option>
            <option value="child-1">Lucas</option>
            <option value="child-2">Emma</option>
          </select>
          <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value as any }))}>
            <option value="all">Tous les statuts</option>
            <option value="paid">Payé</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
            <option value="refunded">Remboursé</option>
          </select>
          <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value as any }))}>
            <option value="all">Tous les types</option>
            <option value="tuition">Frais de scolarité</option>
            <option value="activity_fee">Frais d'activité</option>
            <option value="material_fee">Frais de matériel</option>
            <option value="lunch_fee">Frais de cantine</option>
            <option value="other">Autre</option>
          </select>
        </div>
      </div>

      {/* Payments list */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <h3 className="text-white font-semibold">Historique des paiements</h3>
          <div className="text-blue-200 text-sm">{filteredPayments.length} éléments</div>
        </div>
        <div className="divide-y divide-white/10">
          {filteredPayments.length === 0 ? (
            <div className="p-4 text-center text-blue-300">Aucun paiement trouvé pour les filtres sélectionnés.</div>
          ) : (
            filteredPayments.map(p => (
              <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <DollarSign className="w-4 h-4" /> {p.description} {p.childName ? <span className="text-blue-300 font-normal">• {p.childName}</span> : null}
                  </div>
                  <div className="text-blue-200 text-sm mt-1 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1"><Receipt className="w-4 h-4" /> Facture: {p.invoiceNumber}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /> Échéance: {p.dueDate}</span>
                    {p.paidDate && <span className="inline-flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Payé le: {p.paidDate}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg font-bold">{p.amount.toFixed(2)} {p.currency}</span>
                  {statusBadge(p.status)}
                  {p.receiptUrl && (
                    <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg inline-flex items-center gap-2">
                      <Download className="w-4 h-4" /> Reçu
                    </a>
                  )}
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg inline-flex items-center gap-2"><Edit className="w-4 h-4" /> Modifier</button>
                  <button onClick={() => deletePayment(p.id)} className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg inline-flex items-center gap-2"><Trash2 className="w-4 h-4" /> Supprimer</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-[#0b1220] border border-white/20 rounded-xl shadow-xl">
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
              <h4 className="text-white font-semibold">{editing ? 'Modifier le paiement' : 'Nouveau paiement'}</h4>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 hover:bg-white/10 rounded text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <PaymentForm
              initial={editing || undefined}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              onSave={upsertPayment}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentForm: React.FC<{ initial?: Payment; onSave: (p: Payment) => void; onCancel: () => void; }> = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState<Payment>(initial || {
    id: `pay-${Math.random().toString(36).slice(2,8)}`,
    description: '',
    amount: 0,
    currency: 'EUR',
    dueDate: new Date().toISOString().slice(0,10),
    status: 'pending',
    type: 'tuition',
    invoiceNumber: `INV-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
  });

  const save = () => onSave(form);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-300 mb-1">Description</label>
          <input className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ex: Frais de scolarité" />
        </div>
        <div>
          <label className="block text-sm text-blue-300 mb-1">Montant</label>
          <input type="number" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm text-blue-300 mb-1">Devise</label>
          <input className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm text-blue-300 mb-1">Date d'échéance</label>
          <input type="date" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm text-blue-300 mb-1">Date de paiement</label>
          <input type="date" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.paidDate || ''} onChange={e => setForm({ ...form, paidDate: e.target.value || undefined })} />
        </div>
        <div>
          <label className="block text-sm text-blue-300 mb-1">Statut</label>
          <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as PaymentStatus })}>
            <option value="pending">En attente</option>
            <option value="paid">Payé</option>
            <option value="overdue">En retard</option>
            <option value="refunded">Remboursé</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-300 mb-1">Type</label>
          <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as PaymentType })}>
            <option value="tuition">Frais de scolarité</option>
            <option value="activity_fee">Frais d'activité</option>
            <option value="material_fee">Frais de matériel</option>
            <option value="lunch_fee">Frais de cantine</option>
            <option value="other">Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-300 mb-1">Enfant</label>
          <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.childId || ''} onChange={e => setForm({ ...form, childId: e.target.value || undefined, childName: e.target.value === 'child-1' ? 'Lucas Dubois' : e.target.value === 'child-2' ? 'Emma Dubois' : undefined })}>
            <option value="">— Non spécifié —</option>
            <option value="child-1">Lucas Dubois</option>
            <option value="child-2">Emma Dubois</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-300 mb-1">Numéro de facture</label>
          <input className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white" value={form.invoiceNumber} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-blue-300 mb-1">Notes</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
            value={form.notes || ''}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">Annuler</button>
        <button onClick={save} disabled={!form.description || !form.amount || !form.invoiceNumber} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-60">Enregistrer</button>
      </div>
    </div>
  );
};