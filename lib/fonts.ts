import { Inter, Montserrat } from 'next/font/google'

/** Body text for the dashboard and register screens (Tailwind: font-ui). */
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

/** Headings (Tailwind: font-heading). */
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})
