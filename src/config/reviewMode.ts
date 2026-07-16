/**
 * Razorpay Review Mode Configuration
 *
 * When Review Mode is enabled (`NEXT_PUBLIC_REVIEW_MODE=true` or `EXPO_PUBLIC_REVIEW_MODE=true`),
 * the website hides all community, social networking, discussion forums, messaging, and peer-to-peer
 * elements so that it appears as a pure educational digital study hub and academic marketplace.
 *
 * All hidden features and UI elements remain fully implemented in the codebase and can be restored
 * instantly without data or functionality loss simply by setting `NEXT_PUBLIC_REVIEW_MODE=false`.
 */

export const isReviewMode = (): boolean => {
  if (typeof process !== 'undefined' && process.env) {
    const flag =
      process.env.NEXT_PUBLIC_REVIEW_MODE ||
      process.env.REVIEW_MODE ||
      process.env.EXPO_PUBLIC_REVIEW_MODE;
    return flag === 'true' || flag === '1' || flag === 'yes';
  }
  return false;
};
