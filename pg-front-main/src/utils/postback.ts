// Postback utility for tracking user actions
export interface PostbackParams {
  subid?: string;
  status: 'lead' | 'sale';
}

export const sendPostback = async (params: PostbackParams): Promise<void> => {
  const { subid, status } = params;

  if (!subid) {
    console.warn('No subid provided for postback');
    return;
  }

  try {
    const response = await fetch(
      `https://dashboard.optimizeroal.com/9d564d6/postback?subid=${encodeURIComponent(subid)}&status=${status}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Postback failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending postback:', error);
    throw error;
  }
};

// Get subid from URL parameters
export const getSubidFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('click_id');
};