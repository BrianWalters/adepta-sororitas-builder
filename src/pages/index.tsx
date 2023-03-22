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
        <table>
          <thead>
            <tr>
              <td></td>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.name}>
                <td>
                  <img src={unit.imageUrl} alt="" />
                </td>
                <td>{unit.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
