import React from 'react';

type SectionLayoutProps = {
  children: React.ReactNode;
};

export default function SectionLayout({ children }: SectionLayoutProps) {
  return (
    <section className='flex-1'>
      <div className='mx-auto mt-4 w-full max-w-5xl px-4 pb-16'>{children}</div>
    </section>
  );
}
