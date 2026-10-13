import './globals.css';

export const metadata = {
  title: 'Orbit — GitHub workspace manager',
  description: 'A free, browser-based GitHub account and organization management workspace.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
