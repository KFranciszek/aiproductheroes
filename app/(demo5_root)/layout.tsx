import type { Metadata } from 'next';
import '../demo5-globals.css';

export const metadata: Metadata = {
  title: 'Syzio - Dev Monitoring',
  description: 'Development monitoring and deployment tracking',
};

export default function Demo5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
