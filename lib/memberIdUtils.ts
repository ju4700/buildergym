// Utility functions for member ID management

export function generateMemberId(): string {
  // This will be replaced by generateNextSequentialId in the component
  // For now, return a placeholder that will trigger sequential generation
  return 'BD0001';
}

export function generateNextSequentialId(existingMembers: any[]): string {
  const prefix = 'BD';
  
  // Find all members with BD prefix
  const bdMembers = existingMembers
    .filter(member => member.id.startsWith(prefix))
    .map(member => {
      const numPart = member.id.replace(prefix, '');
      return parseInt(numPart) || 0;
    })
    .sort((a, b) => b - a); // Sort descending
  
  // Get the next sequential number
  const nextNum = bdMembers.length > 0 ? bdMembers[0] + 1 : 1;
  
  // Pad with zeros to make 4 digits (BD0001, BD0002, etc.)
  const paddedNum = nextNum.toString().padStart(4, '0');
  
  return `${prefix}${paddedNum}`;
}

export async function generateNextAvailableId(): Promise<string> {
  try {
    // Fetch all existing members to determine next sequential ID
    const response = await fetch('/api/members');
    if (response.ok) {
      const members = await response.json();
      return generateNextSequentialId(members);
    }
    // Fallback if API call fails
    return 'BD0001';
  } catch (error) {
    console.error('Error fetching members for ID generation:', error);
    return 'BD0001';
  }
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
