import React, { useState } from 'react';
import { Calendar, MapPin, Package, ExternalLink, Phone, Mail, User } from 'lucide-react';
import type { Lead } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { PaymentModal } from './PaymentModal';

interface LeadPreviewProps {
  leads: Lead[];
  isPurchased?: boolean;
}

export const LeadPreview = ({ leads, isPurchased = false }: LeadPreviewProps) => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const handlePurchase = (leadId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedLeadId(leadId);
    setIsPaymentModalOpen(true);
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg">
        <p className="text-white text-lg">
          {isPurchased 
            ? "You haven't purchased any leads yet"
            : "No rental requests available at the moment"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Lead card content remains the same */}
            {!isPurchased && (
              <button
                onClick={() => handlePurchase(lead.id)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View Customer Details ($5)
              </button>
            )}
          </div>
        ))}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {selectedLeadId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedLeadId(null);
          }}
          leadId={selectedLeadId}
          amount={5}
        />
      )}
    </>
  );
};