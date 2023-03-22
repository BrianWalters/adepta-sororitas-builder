import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { cmsProvider } from '@/cms/CmsProvider';
import { InferGetStaticPropsType } from 'next';

export default function Home({
  units,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Adepta Sororitas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <ul>
          {units.map((unit) => (
            <li key={unit.name}>{unit.name}</li>
          ))}
        </ul>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const units = await cmsProvider.getUnitListings();
  return {
    props: {
      units,
    },
  };
}
