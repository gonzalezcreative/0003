import { loadStripe, Stripe } from '@stripe/stripe-js';
import { db } from '../config/firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';

export class StripeService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }

  async createPaymentSession(leadId: string, amount: number): Promise<string> {
    try {
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment session creation failed');
      }

      const { sessionId } = await response.json();
      return sessionId;
    } catch (error) {
      console.error('Error creating payment session:', error);
      throw error;
    }
  }

  async processPayment(sessionId: string): Promise<void> {
    const stripe = await this.stripe;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  async recordPayment(userId: string, leadId: string, amount: number): Promise<void> {
    try {
      const paymentsRef = collection(db, 'payments');
      await addDoc(paymentsRef, {
        userId,
        leadId,
        amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
      });

      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, {
        purchasedBy: userId,
        purchaseDate: new Date().toISOString(),
        status: 'claimed',
      });
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }
}