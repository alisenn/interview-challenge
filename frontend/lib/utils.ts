export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const getRemainingDaysColor = (remainingDays?: number): string => {
  if (remainingDays === undefined) return 'text-gray-600';
  if (remainingDays < 0) return 'text-red-600';
  if (remainingDays <= 3) return 'text-orange-600';
  if (remainingDays <= 7) return 'text-yellow-600';
  return 'text-green-600';
};

export const getRemainingDaysLabel = (remainingDays?: number): string => {
  if (remainingDays === undefined) return 'Unknown';
  if (remainingDays < 0) return `Expired ${Math.abs(remainingDays)} days ago`;
  if (remainingDays === 0) return 'Ends today';
  if (remainingDays === 1) return '1 day remaining';
  return `${remainingDays} days remaining`;
};
