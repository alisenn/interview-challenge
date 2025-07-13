export class DateUtils {
  /**
   * Calculate remaining days of treatment
   * Formula: (startDate + numberOfDays) - today
   */
  static calculateRemainingDays(startDate: Date, numberOfDays: number): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numberOfDays);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
}
