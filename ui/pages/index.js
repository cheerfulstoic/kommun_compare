import Head from "next/head";
import Layout from "../components/Layout";
import data from "../sampleData";

export default () => {
  const sortedRows = data.sort(
    (a, b) => Number(a.yearly_change) - Number(b.yearly_change)
  );

  return (
    <Layout>
      <Head>
        <title>Kommunrankning</title>
      </Head>
      <div>
        <h1 className="text-5xl font-bold text-grey-500">Kommunrankning</h1>

        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Kommun</th>
              <th className="px-4 py-2">
                <strong>
                  Samtliga växthusgaser totalt (exklusive industrin)
                </strong>
                <br />
                Procentuell förändring av växthusgasutsläpp över en 5-årig
                period
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
              <tr key={row.name}>
                <td className="border px-4 py-2">{i + 1}</td>
                <td className="border px-4 py-2">{row.name}</td>
                <td className="border px-4 py-2 text-right">
                  {row.yearly_change.toString()}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
