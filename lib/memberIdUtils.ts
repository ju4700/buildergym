// Utility functions for member ID management

export function generateMemberId(): string {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  return `GM${currentYear}${randomNum}`;
}

export function generateNextSequentialId(existingMembers: any[]): string {
  const currentYear = new Date().getFullYear();
  const prefix = `GM${currentYear}`;
  
  // Find all members with current year prefix
  const currentYearMembers = existingMembers
    .filter(member => member.id.startsWith(prefix))
    .map(member => {
      const numPart = member.id.replace(prefix, '');
      return parseInt(numPart) || 0;
    })
    .sort((a, b) => b - a); // Sort descending
  
  // Get the next sequential number
  const nextNum = currentYearMembers.length > 0 ? currentYearMembers[0] + 1 : 1001;
  
  // Pad with zeros if needed (minimum 4 digits)
  const paddedNum = nextNum.toString().padStart(4, '0');
  
  return `${prefix}${paddedNum}`;
}

export async function checkMemberIdAvailability(memberId: string): Promise<{
  available: boolean;
  message: string;
  suggestion?: string;
}> {
  try {
    const response = await fetch(`/api/members/check-id?id=${encodeURIComponent(memberId)}`);
    if (response.ok) {
      const data = await response.json();
      return {
        available: data.available,
        message: data.message || (data.available ? 'ID is available' : 'ID is not available'),
        suggestion: data.suggestion,
      };
    }
    return { 
      available: false,
      message: 'Failed to check ID availability',
    };
  } catch (error) {
    console.error('Error checking member ID:', error);
    return { 
      available: false,
      message: 'Error checking ID availability',
    };
  }
}
