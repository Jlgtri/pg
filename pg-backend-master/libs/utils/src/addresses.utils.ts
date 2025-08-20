export const isAddressesEqual = (
  address0: string | undefined,
  address1: string | undefined,
): boolean =>
  !!address0 && !!address1 && address0.toLowerCase() === address1.toLowerCase();

export const toLower = (str: string) => str?.toLowerCase();
