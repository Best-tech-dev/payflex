export interface OnboardingSlide {
  id: string;
  title?: string;
  description: string;
  icon: any;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Multi-Currency Wallets',
    description: 'Open USD, NGN, EUR & more accounts in one place',
    icon: require('@/assets/images/multi-currency.png'),
  },
  {
    id: '2',
    title: 'Virtual Cards',
    description: 'Shop online with Dollar or Naira cards',
    icon: require('@/assets/images/virtual-card.png'),
  },
  {
    id: '3',
    // title: 'Digital Services',
    description: 'Top-up airtime, pay bills & more',
    icon: require('@/assets/images/digital-service.jpg'),
  },
]; 