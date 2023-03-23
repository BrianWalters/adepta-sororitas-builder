import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { cmsProvider } from '@/cms/CmsProvider';
import { InferGetStaticPropsType } from 'next';
import { SimpleList } from '@/components/SimpleList';

export default function Home({
  units,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Adepta Sororitas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <h1>Adepta Sororitas</h1>
        <p className={styles.armyBuilderLink}>
          <a href="/builder">Army builder</a>
        </p>
        <hr />
        <h2>Unit summaries</h2>
        <table>
          <thead>
            <tr>
              <td></td>
              <th>Name</th>
              <th>Power</th>
              <th>Keywords</th>
              <th>Abilities</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.name}>
                <td>
                  <img src={unit.imageUrl} alt="" />
                </td>
                <td>{unit.name}</td>
                <td>
                  <div className="power-badge">{unit.power}</div>
                </td>
                <td>
                  <SimpleList items={unit.keywords} />
                </td>
                <td>
                  <SimpleList items={unit.abilities} />
                </td>
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
