import SavedDesignsClient from '@/components/SavedDesignsClient';

export const metadata = {
  title: 'Saved Designs — Local QR Projects | EverQR',
  description: 'Open, rename, duplicate, and delete QR designs saved locally in your browser.',
  alternates: { canonical: '/saved-designs/' },
};

export default function SavedDesignsPage() {
  return <SavedDesignsClient />;
}
