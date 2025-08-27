import {
  getSubidFromUrl,
  sendPostback,
  type PostbackParams,
} from '@/utils/postback';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

// Hook for sending lead postback (wallet connection) - only once per connection
export const useLeadPostback = () => {
  const queryClient = useQueryClient();
  const subid = getSubidFromUrl();
  const previousConnectionState = useRef(false);
  const previousAddress = useRef<string | undefined>(undefined);
  const isPending = useRef(false);

  const sendLeadPostback = async () => {
    // Check if already sent or pending
    const alreadySent = queryClient.getQueryData(['lead-postback-sent', subid]);

    if (!alreadySent && subid && !isPending.current) {
      isPending.current = true;

      try {
        await sendPostback({ subid, status: 'lead' });
        console.log('Lead postback sent successfully');

        // Mark as sent in query cache
        queryClient.setQueryData(['lead-postback-sent', subid], true);
      } catch (error) {
        console.error('Failed to send lead postback:', error);
      } finally {
        isPending.current = false;
      }
    }
  };

  const resetLeadPostback = () => {
    // Reset the postback state when wallet disconnects
    if (subid) {
      queryClient.removeQueries({ queryKey: ['lead-postback-sent', subid] });
      isPending.current = false;
    }
  };

  // Track connection state changes
  const trackConnectionState = (isConnected: boolean, address?: string) => {
    console.log('Track connection state:', {
      isConnected,
      address,
      previousConnectionState: previousConnectionState.current,
      previousAddress: previousAddress.current,
    });

    // If connection state changed from false to true
    if (isConnected && !previousConnectionState.current) {
      console.log('Connection state changed: disconnected -> connected');
      // Reset postback state when reconnecting
      resetLeadPostback();
    }
    // If connection state changed from true to false
    else if (!isConnected && previousConnectionState.current) {
      console.log('Connection state changed: connected -> disconnected');
      resetLeadPostback();
    }
    // If address changed while connected
    else if (
      isConnected &&
      previousConnectionState.current &&
      address !== previousAddress.current
    ) {
      console.log('Address changed while connected, resetting postback state');
      resetLeadPostback();
    }

    previousConnectionState.current = isConnected;
    previousAddress.current = address;
  };

  return {
    sendLeadPostback,
    resetLeadPostback,
    trackConnectionState,
    isPending: isPending.current,
  };
};

// Hook for sending sale postback (token purchase)
export const useSalePostback = () => {
  const sendSalePostback = async () => {
    const subid = getSubidFromUrl();
    if (!subid) {
      console.warn('No subid found in URL for sale postback');
      return;
    }

    try {
      await sendPostback({ subid, status: 'sale' });
    } catch (error) {
      console.error('Failed to send sale postback:', error);
    }
  };

  return { sendSalePostback };
};

// Hook for sending custom postback
export const useCustomPostback = () => {
  const sendCustomPostback = async (params: PostbackParams) => {
    try {
      await sendPostback(params);
    } catch (error) {
      console.error('Failed to send custom postback:', error);
    }
  };

  return { sendCustomPostback };
};