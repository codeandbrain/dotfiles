import './globals.css';

export const metadata = {
  title: 'Dotfile Composer',
  description: 'Visual dotfile composer for GitHub repositories',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
